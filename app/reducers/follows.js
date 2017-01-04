/**
 * Follows Reducer
 */

import { LOADED_FOLLOWS, ADDED_FOLLOWS, REMOVED_FOLLOWS, LOGGED_OUT } from 's5-action';

const initialState = {
  list: [],
  ids: '',
  lastLoadedAt: null,
};

function sortByKey(array, key) {
  return array.sort(function(a, b) {
    var x = a[key]; var y = b[key];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}

function generateIds(array) {
  return array.map(function(elem){
    return elem.id;
  }).join("^");
}

function follows(state = initialState, action) {

  if (action.type === LOADED_FOLLOWS) {
      let list = action.list.map(_parseObjToJSON);

      return {
        list: sortByKey(list, 'nickName'),
        ids: generateIds(list),
        lastLoadedAt: new Date(),
      };

  } else if (action.type === REMOVED_FOLLOWS) {
      let newData = [...state.list];
      newData.splice(action.row, 1);
      return {
        list: newData,
        ids: generateIds(newData),
        lastLoadedAt: new Date(),
      };

  } else if (action.type === ADDED_FOLLOWS) {
    
    let newData = [...state.list];

    if (Array.isArray(action.follow)) {
      for( var inx in action.follow ){
        let follow = _parseObjToJSON(action.follow[inx]);    
        newData.unshift(follow);
      }
    } else {
      let follow = _parseObjToJSON(action.follow);    
      newData.unshift(follow);
    }

    return {
      list: sortByKey(newData, 'nickName'),
      ids: generateIds(newData),
      lastLoadedAt: new Date(),
    };

  } else if (action.type === LOGGED_OUT) {

    return initialState;

  }

  return state;
}

export function _parseObjToJSON(object){

  var user = object.get('userTo');
  var avatar = "";
  if( user && user.get('profileFile') != null && user.get('profileFile') != undefined ){
    avatar = user.get('profileFile').url();
  }

  return {
    followId: object.id,
    id: user.id,
    username: user.get('username'),
    email: user.get('email'),
    nickName: user.get('nickName'),
    statusMessage: user.get('statusMessage'),
    avatar: avatar,
  };
}

module.exports = follows;
