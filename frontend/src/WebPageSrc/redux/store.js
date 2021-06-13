
import {createStore,applyMiddleware} from  'redux';
import LocationReducer from './Reducer';
import logger from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension';

const store=createStore(LocationReducer,composeWithDevTools(applyMiddleware(logger)));
export default store;