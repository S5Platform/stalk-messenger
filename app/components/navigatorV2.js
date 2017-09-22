/**
 *
 * @flow
 */

import React, { Component } from 'react';

import PropTypes from "prop-types";
import {
  Platform,
  BackAndroid,
  StyleSheet,
} from 'react-native';

import { Navigator } from 'react-native-deprecated-custom-components'

import { connect }    from 'react-redux';
import { switchTab, dismissKeyboard }  from 's5-action';
import { S5Colors } from 's5-components';

import LoginScreen    from './login';
import SignupView     from './login/SignupView';

import TabsView       from './tabs/TabsView';

import ChatView       from './tabs/chats/ChatView';
import ImageViewer    from './tabs/chats/ImageViewer';
import SearchUserView from './tabs/follows/SearchUserView';
import SelectUserView from './tabs/follows/SelectUserView';
import UserView       from './tabs/follows/UserView';
import ProfileForm    from './tabs/profile/ProfileForm';

import SettingView    from './tabs/profile/setting/SettingView';
import LicenseView    from './tabs/profile/setting/LicenseView';

import PushNotificationView from './tabs/profile/setting/PushNotificationView'
import ImageQualityView from './tabs/profile/setting/ImageQualityView'
import PrivacyPolicyView from './tabs/profile/setting/PrivacyPolicyView';

import { addNavigationHelpers, StackNavigator } from "react-navigation";

export const AppNavigator = StackNavigator(
  {
    Login: { screen: LoginScreen }
  },
  {
    mode: "card",
    headerMode: "screen"
  }
);

const AppWithNavigationState = ({ dispatch, nav }) =>
  <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />;

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  isLoggedIn: state.user.isLoggedIn,
  tab: state.navigation.tab,
  nav: state.navigation
});

const mapDispatchToProps = dispatch => ({
  switchTab: (tab) => dispatch(switchTab(tab))
});

export default connect(mapStateToProps, mapDispatchToProps)(AppWithNavigationState);
