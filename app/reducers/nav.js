/**
 * Naviation Reducer
 * Tab 메뉴 구성
 *
 */

import { LOGGED_IN, SWITCH_TAB, LOGGED_OUT} from 's5-action';

import { NavigationActions } from "react-navigation";
import { AppNavigator } from "../components/navigatorV2";

const initialState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams("Login"));

function nav(state = initialState, action) {

  let nextState;
  switch (action.type) {
    case LOGGED_IN:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: "TabsView" })] }),
        state
      );
      break;
    case SWITCH_TAB:
      nextState = {...state, tab: action.tab};
      break;
    case LOGGED_OUT:
      nextState = initialState;
      break;
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }
  
  return nextState || state;
}

module.exports = nav;
