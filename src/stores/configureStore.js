import { createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import appReducer from '../app/appReducer';
import webConfig from '../app/config/base';

const { nodeEnv } = webConfig;

const rootReducer = combineReducers({
  app: appReducer,
});

const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 25 });
const store = nodeEnv === 'development' ? createStore(rootReducer, composeEnhancers()) : createStore(rootReducer);

export default store;
