import React, { Component } from 'react'
import PropTypes from 'prop-types'
import style from './Media.css'
import Medium from './Medium'

export default class Media extends Component {

  componentDidUpdate() {
    if (this.props.endpoint && this.props.tweets.length === 0) {
      this.props.getTweets(this.props.endpoint)
    }
  }

  render() {
    let loader = null
    if (this.props.tweets.length === 0) {
      loader = 'Loading...'
    }
    return (
        <div className={ style.Box }>
          {loader}
          {this.props.tweets.map(tweet => (
            tweet.media.map((medium, idx) => (
              <Medium key={tweet.id + '_m' + idx} data={medium}/>
            ))
          ))}
        </div>
    )
  }
}

Media.propTypes = {
  endpoint: PropTypes.string,
  getTweets: PropTypes.func,
  tweets: PropTypes.array
}
