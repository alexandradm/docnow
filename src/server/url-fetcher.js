import getRedis from './redis'
import metaweb from 'metaweb'
import log from './logger'

// redis key for url to url mappings
const urlKey = (url) => {return `url:${url}`}

// redis key for url metadata
const metadataKey = (url) => {return `metadata:${url}`}

// redis key for a search's sorted set of url counts
const urlsKey = (search) => {return `urls:${search.id}`}

// redis key for the number of urls yet to be fetched for a search
const queueCountKey = (search) => {return `queue:${search.id}`}

// redis key for the total number of urls to be checked in a search
const urlsCountKey = (search) => {return `urlscount:${search.id}`}

export class UrlFetcher {

  constructor(concurrency = 5) {
    this.concurrency = concurrency
    this.redis = getRedis()
    this.redisBlocking = this.redis.duplicate()
    this.active = false
  }

  async start() {
    this.active = true
    while (this.active) {
      const promises = []
      for (let i = 0; i < this.concurrency; i++) {
        promises.push(this.fetchJob())
      }
      log.info('waiting to process ' + this.concurrency + ' urls')
      await Promise.all(promises)
    }
    return true
  }

  stop() {
    this.active = false
    this.redis.quit()
    this.redisBlocking.quit()
  }

  add(search, url) {
    const job = {search, url}
    this.incrSearchQueue(search)
    this.incrUrlsCount(search)
    return this.redis.lpushAsync('urlqueue', JSON.stringify(job))
  }

  async fetchJob() {
    // wait 10 seconds for a new job
    let result = null
    const item = await this.redisBlocking.blpopAsync('urlqueue', 10)
    if (item) {
      const job = JSON.parse(item[1])
      log.info('got job', job)
      result = await this.processJob(job)
    }
    return result
  }

  async processJob(job) {

    // see if we have metadata for this url already. if we don't
    // have it got out to the web to fetch it

    let metadata = await this.getMetadata(job.url)
    if (metadata) {
      log.info('found cached metadata', job.url)
    } else {
      log.info('looking up url', job.url)
      try {
        metadata = await metaweb.get(job.url)
        if (metadata) {

          // use the canonical url if it is present
          metadata.url = metadata.canonical || metadata.url
          delete metadata.canonical

          await this.saveMetadata(job, metadata)
        }
      } catch (error) {
        log.error(`metaweb.get error for ${job.url}`, error.message)
      }
    }

    if (metadata) {
      await this.tally(job, metadata)
    }

    this.decrSearchQueue(job.search)
    return metadata
  }

  async getMetadata(url) {
    let metadata = null
    const val = await this.redis.getAsync(urlKey(url))
    if (val) {
      const json = await this.redis.getAsync(metadataKey(val))
      if (json) {
        metadata = JSON.parse(json)
      }
    }
    return metadata
  }

  async saveMetadata(job, metadata) {
    const url = metadata.url

    // key/value lookups for determining the url that
    // metadata is stored under

    await this.redis.setAsync(urlKey(job.url), url)
    await this.redis.setAsync(urlKey(url), url)

    // save the metadata

    await this.redis.setAsync(
      metadataKey(url),
      JSON.stringify(metadata)
    )
  }

  async tally(job, metadata) {
    const key = urlsKey(job.search)
    log.info('tallying', key, metadata.url)
    await this.redis.zincrbyAsync(key, 1, metadata.url)
  }

  async queueStats(search) {
    const total = await this.redis.getAsync(urlsCountKey(search))
    const remaining = await this.redis.getAsync(queueCountKey(search))
    return {
      total: parseInt(total, 10),
      remaining: parseInt(remaining, 10)
    }
  }

  incrUrlsCount(search) {
    this.redis.incr(urlsCountKey(search))
  }

  incrSearchQueue(search) {
    this.redis.incr(queueCountKey(search))
  }

  decrSearchQueue(search) {
    this.redis.decr(queueCountKey(search))
  }

  async getWebpages(search, start = 0, limit = 100) {
    const key = urlsKey(search)

    // get the list of urls and their counts while building up
    // a list of redis commands to get metadata for the urls

    const counts = {}
    const commands = []
    const urlCounts = await this.redis.zrevrangeAsync(key, start, limit, 'withscores')
    for (let i = 0; i < urlCounts.length; i += 2) {
      const url = urlCounts[i]
      const count = parseInt(urlCounts[i + 1], 10)
      counts[url] = count
      commands.push(['get', metadataKey(url)])
    }

    // redis does not have a multiAsync command so we return a Promise
    // that will execute all the metadata gets and then build up a list
    // of webpage metadata annotated with the counts we collected above

    return new Promise((resolve) => {
      this.redis.multi(commands).exec((err, urlMetadata) => {
        const webpages = []
        for (const json of urlMetadata) {
          const metadata = JSON.parse(json)
          metadata.count = counts[metadata.url]
          webpages.push(metadata)
        }
        resolve(webpages)
      })
    })

  }

}
