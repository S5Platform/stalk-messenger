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

import { S5Colors, S5Header, S5Icon } from 's5-components';
import { switchTab, dismissKeyboard, I18N }  from 's5-action';

import LoginScreen    from './login';
import SignupView     from './login/SignupView';

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

import ChatsView      from './tabs/chats/index';
import FollowsView    from './tabs/follows/index';
import ProfileView    from './tabs/profile/index';

import { addNavigationHelpers, StackNavigator, TabNavigator } from "react-navigation";

export const FollowsStack = StackNavigator({
  ChatsView: {
    screen: FollowsView,
    navigationOptions: {
      title: I18N('friend.title'),
    },
  },
  SelectUserView:{
    screen: SelectUserView
  }
}, {
  mode: 'card'
});

export const ChatsStack = StackNavigator({
  ChatsView: {
    screen: ChatsView,
    navigationOptions: {
      title: I18N('chat.title'),
    },
  },
  ChatView: {
    screen: ChatView
  },
  SearchUserView:{
    screen: SearchUserView
  },
  SelectUserView:{
    screen: SelectUserView
  }
}, {
  mode: 'card'
});

export const ProfileStack = StackNavigator({
  ProfileView: {
    screen: ProfileView,
    navigationOptions: {
      title: I18N('profile.title'),
    },
  },
  SettingView: {
    screen: SettingView
  },
  LicenseView: {
    screen: LicenseView
  },
  PushNotificationView: {
    screen: PushNotificationView
  },
  ImageQualityView: {
    screen: ImageQualityView
  },
  PrivacyPolicyView: {
    screen: PrivacyPolicyView
  },
  ProfileForm:{
    screen: ProfileForm
  }

}, {
  mode: 'card'
});

export const Tabs = TabNavigator({
  followTab:{
    screen: FollowsStack,
    navigationOptions: {
      tabBarLabel: I18N('friend.title'),
      tabBarIcon: ({ tintColor }) => <S5Icon name={'people'} color={tintColor} />
    },
  },
  chatTab: {
    screen: ChatsStack,
    navigationOptions: {
      tabBarLabel: I18N('chat.title'),
      tabBarIcon: ({ tintColor }) => <S5Icon name={'chatbubbles'} color={tintColor} />
    },
  },
  profileTab:{
    screen: ProfileStack,
    navigationOptions: {
      tabBarLabel: I18N('profile.title'),
      tabBarIcon: ({ tintColor }) => <S5Icon name={'person'} color={tintColor} />
    }, 
  }
},
{
  initialRouteName: 'followTab'  
});

export const AppNavigator = StackNavigator({
  Login:{
    screen: LoginScreen
  },
  SignupView: {
    screen: SignupView
  },
  TabsView: {
    screen: Tabs
  }
}, {
  mode: 'card',
  headerMode: 'none',
});

const AppWithNavigationState = ({ dispatch, nav }) =>
  <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />;

const mapStateToProps = state => ({
  isLoggedIn: state.user.isLoggedIn,
  tab: state.navigation.tab,
  nav: state.nav
});

const mapDispatchToProps = dispatch => ({
  switchTab: (tab) => dispatch(switchTab(tab))
});

export default connect(mapStateToProps)(AppWithNavigationState);
