import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import settings from './settings'
import user from './user'
import trends from './trends'
import websocket from './websocket'

const rootReducer = combineReducers({
  settings,
  user,
  trends,
  websocket,
  router: routerReducer
})

export default rootReducer
