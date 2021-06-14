
import {createStore,applyMiddleware,combineReducers} from  'redux';
import LocationReducer from './Location/Reducer';
import NotificationReducer from './Notification/Reducer';
import logger from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension';

const store=createStore(combineReducers(
                           {LocationReducer,
                            NotificationReducer
                           }),composeWithDevTools(applyMiddleware(logger)));
export default store;