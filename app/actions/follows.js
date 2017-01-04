
import Parse from 'parse/react-native';

export const LOADED_FOLLOWS   = 'LOADED_FOLLOWS';
export const ADDED_FOLLOWS    = 'ADDED_FOLLOWS';
export const REMOVED_FOLLOWS  = 'REMOVED_FOLLOWS';

const InteractionManager = require('InteractionManager');

const Follows = Parse.Object.extend('Follows');

function loadFollowsAsync () {

  return new Promise( (resolve, reject) => {

    var currentUser = Parse.User.current();

    new Parse.Query(Follows)
      .equalTo('userFrom', currentUser)
      .include('userTo')
      .ascending('nickName')
      .find()
      .then(
        (list) => {
          resolve(list);
        },
        (err) => { console.error(error); reject(err); }
      );
  });

};

/**
 * Load list of all follows once logined
 * @params N/A
 **/
export function loadFollows() {

  return async (dispatch) => {

    var list = await loadFollowsAsync();

    return dispatch(({
      type: LOADED_FOLLOWS,
      list,
    }));

  };

}

/**
 * create follow relation
 * @params id : user.id of target user
 **/
export function createFollow(id) {

  return (dispatch) => {
    return Parse.Cloud.run('follows-create', {id}, {
      success: (follow) => {

        if(follow) {
          InteractionManager.runAfterInteractions(() => {
            dispatch(({type: ADDED_FOLLOWS, follow}));

            return Promise.resolve();
          });
        }

      },
      error: (error) => {
        console.warn(error); // TODO 에러 처리 필요!
      }
    });
  };

}

/**
 * Remove follow relation
 * @params id : user.id of target user
 **/
export function removeFollow(row) {

  return (dispatch, getState) => {

    let followId = getState().follows.list[row].id;

    return Parse.Cloud.run('follows-remove', {id: followId}, {
      success: (result) => {

        InteractionManager.runAfterInteractions(() => {
          dispatch({
            type: REMOVED_FOLLOWS,
            result,
            row
          });
        });

      },
      error: (error) => {
        console.warn(error);
      }
    });

  };

}
