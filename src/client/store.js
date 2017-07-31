import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'
import rootReducer from './reducers'
import websocketMiddleware from './middleware/websocket'

export const history = createHistory()

const initialState = {}
const enhancers = []
const middleware = [
  routerMiddleware(history),
  websocketMiddleware,
  thunk
]

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.devToolsExtension

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }
}

const componsedEnhancers = composeWithDevTools(
  applyMiddleware(...middleware),
  ...enhancers
)

const store = createStore(
  rootReducer,
  initialState,
  componsedEnhancers
)

export default store
