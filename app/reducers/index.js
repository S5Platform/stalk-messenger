/**
 *
 */

var { combineReducers } = require('redux');

module.exports = combineReducers({
  config:     require('./config'),
  navigation: require('./navigation'),
  user:       require('./user'),
  follows:    require('./follows'),  // all follows list on follows tab
  chats:      require('./chats'),      // all chats list on chats tab
  messages:   require('./messages'),
});
