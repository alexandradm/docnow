import React, { Component } from 'react'
import PropTypes from 'prop-types'
import style from '../styles/Webpage.css'
import card from '../styles/Card.css'
import doc from '../images/doc.png'

export default class Webpage extends Component {

  showTweets() {
    this.props.getTweetsForUrl(this.props.searchId, this.props.url)
  }

  render() {
    let website = new URL(this.props.url).host
    website = website.replace(/^www\./, '')

    const img = this.props.image || doc
    return (
      <div className={card.Card}>
        <div className={style.Image}>
          <div className={style.Controls}>
            <i className={style.Add + ' fa fa-plus'} />
            &nbsp;
            <i className={style.Remove + ' fa fa-minus'}/>
          </div>
          <a href={this.props.url} target="_new">
            <img src={img} />
          </a>
        </div>
        <div className={style.Title}>
          <a href={this.props.url} target="_new">
            {this.props.title}
          </a>
        </div>
        <div className={style.Description}>
          {this.props.description}
        </div>
        <div className={style.Stats}>
          <div
            className={style.Count}
            onClick={() => {this.showTweets()}}>
            <i className="fa fa-twitter" />
            &nbsp;
            {this.props.count}
          </div>
          <div className={style.WebsiteName}>
            <a href={this.props.url} target="_new">{website}</a>
          </div>
        </div>
      </div>
    )
  }
}

Webpage.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  image: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.array,
  count: PropTypes.number,
  searchId: PropTypes.string,
  getTweetsForUrl: PropTypes.func
}
