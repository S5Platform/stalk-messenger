/**
 * Naviation Reducer
 * Tab 메뉴 구성
 *
 */

import { LOGGED_IN, SWITCH_TAB, LOGGED_OUT} from 's5-action';

import { NavigationActions } from "react-navigation";
import { AppNavigator } from "../components/navigatorV2";

const initialState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams("Login"));

function navigation(state = initialState, action) {
  if(action.type === LOGGED_IN) {
    var nextState = AppNavigator.router.getStateForAction(
      NavigationActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: "TabsView" })] }),
      state
    );

    return nextState;
  }

  if (action.type === SWITCH_TAB) {
    return {...state, tab: action.tab};
  }
  if (action.type === LOGGED_OUT) {
    return initialState;
  }
  return state;
}

module.exports = navigation;
