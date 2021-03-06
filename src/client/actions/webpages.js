export const SET_WEBPAGES = 'SET_WEBPAGES'
export const RESET_WEBPAGES = 'RESET_WEBPAGES'
export const SELECT_WEBPAGE = 'SELECT_WEBPAGE'
export const DESELECT_WEBPAGE = 'DESELECT_WEBPAGE'
export const SET_WEBPAGE_ARCHIVE = 'SET_WEBPAGE_ARCHIVE'
export const ARCHIVE_ERROR = 'ARCHIVE_ERROR'

export const setWebpages = (webpages) => {
  return {
    type: SET_WEBPAGES,
    webpages: webpages
  }
}

export const resetWebpages = () => {
  return {
    type: RESET_WEBPAGES
  }
}

export const getWebpages = (searchId) => {
  return (dispatch) => {
    fetch(`/api/v1/search/${searchId}/webpages`, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((result) => {
        dispatch(setWebpages(result))
      })
  }
}

export const selectWebpage = (searchId, url) => {
  return (dispatch) => {
    dispatch({
      type: SELECT_WEBPAGE,
      searchId,
      url
    })
    const opts = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({url: url, selected: true}),
      credentials: 'same-origin'
    }
    fetch(`/api/v1/search/${searchId}/webpages`, opts)
  }
}

export const deselectWebpage = (searchId, url) => {
  return (dispatch) => {
    dispatch({
      type: DESELECT_WEBPAGE,
      searchId,
      url
    })
    const opts = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({url: url, deselected: true}),
      credentials: 'same-origin'
    }
    fetch(`/api/v1/search/${searchId}/webpages`, opts)
  }
}

export const checkArchive = (url) => {
  return (dispatch) => {
    const apiUrl = '/api/v1/wayback/' + encodeURIComponent(url)
    fetch(apiUrl, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((result) => {
        if (result !== null) {
          dispatch({
            type: SET_WEBPAGE_ARCHIVE,
            url: url,
            archiveUrl: result.url,
            archiveTime: result.time
          })
        }
      })
  }
}

export const saveArchive = (url) => {
  return async (dispatch) => {
    const apiUrl = '/api/v1/wayback/' + encodeURIComponent(url)
    const resp = await fetch(apiUrl, {credentials: 'same-origin', method: 'PUT'})
    const result = await resp.json()
    if (result) {
      dispatch({
        type: SET_WEBPAGE_ARCHIVE,
        url: url,
        archiveUrl: result.url,
        archiveTime: result.time
      })
    } else {
      dispatch({
        type: ARCHIVE_ERROR,
        url: url
      })
    }
  }
}
