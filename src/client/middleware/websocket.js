import * as actions from '../actions/websocket'

let socket = null

const onOpen = (ws, store) => () => {
  // Send a handshake, or authenticate with remote end
  // Tell the store we're connected
  store.dispatch(actions.connected())
}

const onClose = (ws, store) => () => {
  // Tell the store we've disconnected
  store.dispatch(actions.disconnected())
}

const onMessage = (ws, store) => evt => {
  // Parse the JSON message received on the websocket
  const msg = JSON.parse(evt.data)
  switch (msg.type) {
    case 'CHAT_MESSAGE':
      // Dispatch an action that adds the received message to our state
      store.dispatch(actions.messageReceived(msg))
      break
    default:
      console.log('Received unknown message type: ' + msg.type)
      break
  }
}

const websocketMiddleware = store => next => action => {
  switch (action.type) {

    case 'CONNECT':
      if (socket !== null) {
        socket.close()
      }

      // Attempt to connect (we could send a 'failed' action on error)

      socket = new WebSocket(action.url)
      socket.onmessage = onMessage(socket, store)
      socket.onclose = onClose(socket, store)
      socket.onopen = onOpen(socket, store, action.token)

      store.dispatch(actions.connected())
      break

    case 'DISCONNECT':
      if (socket !== null) {
        socket.close()
      }
      socket = null
      store.dispatch(actions.disconnected())
      break

    // Send the 'SEND_MESSAGE' action down the websocket to the server
    case 'SEND_CHAT_MESSAGE':
      socket.send(JSON.stringify(action))
      break

    // This action is irrelevant to us, pass it on to the next middleware
    default:
      return next(action)
  }
}

module.exports = websocketMiddleware
