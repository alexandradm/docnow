import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Fab from '@material-ui/core/Fab'

export default class BackButton extends Component {
  render() {
    return (
      <div style={{margin: '0 auto', maxWidth: '800px'}}>
        <Fab
          variant="extended"
          size="medium"
          color="primary"
          aria-label="add"
          onClick={() => this.props.navigateTo(`/search/${this.props.searchId}`)}
        >
          <ion-icon name="arrow-round-back"></ion-icon>
          Back to Search
        </Fab>
      </div>
    )
  }
}

BackButton.propTypes = {
  searchId: PropTypes.string,
  navigateTo: PropTypes.func
}
