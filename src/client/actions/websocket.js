const CONNECT = 'CONNECT'
const CONNECTED = 'CONNECTED'
const DISCONNECT = 'DISCONNECT'
const DISCONNECTED = 'DISCONNECTED'

export const connect = () => {
  return {
    type: CONNECT,
    url: 'ws://localhost:3000/api/v1/websocket'
  }
}

export const connected = () => {
  return {
    type: CONNECTED
  }
}

export const disconnect = () => {
  return {
    type: DISCONNECT
  }
}

export const disconnected = () => {
  return {
    type: DISCONNECTED
  }
}
