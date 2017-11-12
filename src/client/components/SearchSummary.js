import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import style from '../styles/Search.css'

export default class SearchSummary extends Component {

  render() {
    if (this.props.count > 0) {
      const minDate = moment(this.props.minDate).local().format('MMM D h:mm A')
      const maxDate = moment(this.props.maxDate).local().format('MMM D h:mm A')
      return (
        <p className={style.Summary}>
          <span className={style.Count}>{this.props.count}</span> tweets
          from <time>{minDate}</time> to <time>{maxDate}</time>&nbsp;
          from the Twitter Search API.
        </p>
      )
    } else {
      return <p>Loading...</p>
    }
  }
}

SearchSummary.propTypes = {
  maxDate: PropTypes.string,
  minDate: PropTypes.string,
  count: PropTypes.number,
  hashtagCount: PropTypes.number,
  active: PropTypes.bool
}
