const websocket = (ws, req) => {
  ws.on('message', (message) => {
    console.log(message, req)
    ws.send('received')
  })
}

module.exports = websocket
