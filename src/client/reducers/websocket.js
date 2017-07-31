import { CONNECTED, DISCONNECTED } from '../actions/websocket'

const initialState = {
  connected: false
}

export default (state = initialState, action) => {

  switch (action.type) {

    case CONNECTED: {
      return {
        connected: true
      }
    }

    case DISCONNECTED: {
      return {
        connected: false
      }
    }

    default: {
      return state
    }
  }

}
