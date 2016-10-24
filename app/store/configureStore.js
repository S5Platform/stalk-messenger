/**
 *
 * @flow
 */

'use strict';

import { Platform } from 'react-native';
import { applyMiddleware, createStore, compose }  from 'redux';
import { persistStore, autoRehydrate }            from 'redux-persist';
import { AsyncStorage }                           from 'react-native';

import thunk        from 'redux-thunk';   // (https://github.com/gaearon/redux-thunk)
import createLogger from 'redux-logger';  // (https://github.com/theaqua/redux-logger)
import promise      from './middleware/promise';
import array        from './middleware/array';

import reducers     from '../reducers';

import devTools     from 'remote-redux-devtools'; // (http://remotedev.io/local/)

var isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent;

var logger = createLogger({
  predicate: (getState, action) => isDebuggingInChrome, // 로깅 조건
  collapsed: true,
  duration: true,
});

function configureStore(onComplete) {

  const enhancer = compose(
    applyMiddleware(
      thunk,
      promise,
      array,
      logger
    ),
    autoRehydrate(),
    devTools({
      name: Platform.OS,
      hostname: 'localhost'
    })
  );

  const store = createStore(reducers, undefined, enhancer);
  persistStore(store, {storage: AsyncStorage}, onComplete);

  // If you have other enhancers & middlewares
  // update the store after creating / changing to allow devTools to use them
  devTools.updateStore(store);


  if (isDebuggingInChrome) {
    window.store = store;
  }
  return store;
}

module.exports = configureStore;
