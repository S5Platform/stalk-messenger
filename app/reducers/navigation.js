/**
 * Naviation Reducer
 * Tab 메뉴 구성
 *
 */

import { SWITCH_TAB, LOGGED_OUT} from 's5-action';

const initialState = { tab: 0 };

function navigation(state = initialState, action) {
  if (action.type === SWITCH_TAB) {
    return {...state, tab: action.tab};
  }
  if (action.type === LOGGED_OUT) {

    console.log( 'bbbbb' );

    console.log( initialState );
    return initialState;
  }
  return state;
}

module.exports = navigation;
