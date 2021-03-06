export const SET_TWEETS = 'SET_TWEETS'
export const RESET_TWEETS = 'RESET_TWEETS'

export const setTweets = (tweets) => {
  return {
    type: SET_TWEETS,
    tweets
  }
}

export const resetTweets = () => {
  return {
    type: RESET_TWEETS
  }
}

export const getTweetsForUrl = (searchId, url) => {
  return (dispatch) => {
    fetch(`/api/v1/search/${searchId}/tweets?url=${url}`, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((result) => {
        dispatch(setTweets(result))
      })
  }
}

export const getTweetsForImage = (searchId, image) => {
  return (dispatch) => {
    fetch(`/api/v1/search/${searchId}/tweets?image=${image}`, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((result) => {
        dispatch(setTweets(result))
      })
  }
}

export const getTweetsForVideo = (searchId, video) => {
  return (dispatch) => {
    fetch(`/api/v1/search/${searchId}/tweets?video=${video}`, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((result) => {
        dispatch(setTweets(result))
      })
  }
}

export const getTweetsByIds = (searchId, ids) => {
  return (dispatch) => {
    fetch(`/api/v1/search/${searchId}/tweets?ids=${ids.join(',')}`, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((result) => {
        dispatch(setTweets(result))
      })
  }
}
