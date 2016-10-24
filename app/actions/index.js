/**
 * @providesModule s5-action
 */

const commonActions   = require('./common');
const userActions     = require('./user');
const followsActions  = require('./follows');
const chatsActions    = require('./chats');
const messagesActions = require('./messages');

module.exports = {
  ...commonActions,
  ...userActions,
  ...followsActions,
  ...chatsActions,
  ...messagesActions,
};
