/**
 *
 * @flow
 */

import React, { Component, PropTypes } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { TabViewAnimated, TabViewPagerPan, TabBar, TabBarTop } from 'react-native-tab-view';

import { connect }    from 'react-redux';
import { switchTab }  from 's5-action';
import { S5Colors, S5Header, S5Icon } from 's5-components';

import FollowsView    from './follows';
import ChatsView      from './chats';
import ProfileView    from './profile';

class TabsView extends Component {

  static propTypes = {
    tab: React.PropTypes.number,
    switchTab: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired,
  };

  state = {
    index: 0,
    routes: [
      { key: 'follows', icon: 'people',       title: 'FRIENDS', actions: [{ key: 'SearchUserView',  icon: 'person-add' }] },
      { key: 'chats',   icon: 'chatbubbles',  title: 'CHAT'  ,  actions: [{ key: 'SelectUserView',  icon: 'add' }] },
      { key: 'profile', icon: 'person',       title: 'PROFILE', actions: [{ key: 'SettingView',     icon: 'settings'}] },
    ],
    actions: [],
  };

  componentWillMount() {
    this._handleChangeTab(this.props.tab);
  }

  _handleChangeTab = (index) => {
    this.props.switchTab(index);
    this.setState({
      index,
      actions: this.state.routes[index].actions,
      title: this.state.routes[index].title,
    });
  };

  _renderLabel = ({ navigationState }: any) => ({ route, index }) => {
    if (Platform.OS == 'android' /* FOR ANDROID */ ) {
      return (
        <Text style={[ styles.label, {
          color:      navigationState.index === index ? S5Colors.highlightText : S5Colors.secondaryText,
          //fontWeight: navigationState.index === index ? 'bold' : 'normal',
        } ]}>
          {route.title}
        </Text>
      );

    }else{

      return (
        <View>
        <S5Icon
          name={route.icon}
          color={navigationState.index === index ? S5Colors.highlightText : S5Colors.secondaryText}
        />
        { route.key =='chats' && this.props.totalUnreadCount > 0 ? (
            <View style={styles.unreadCountWrap}>
              <Text style={styles.unreadCount}>
              {this.props.totalUnreadCount}
              </Text>
            </View>
          ) : null  }
        </View>
      );
    }

  };

  /* FOR ANDROID */
  _renderHeader = (props) => {
    return (
      <TabBarTop
        {...props}
        renderLabel={this._renderLabel(props)}
        indicatorStyle={styles.indicator}
        style={styles.tabbar}
      />
    );
  };

  /* FOR IOS */
  _renderFooter = (props) => {
    return (
      <TabBar
        {...props}
        renderLabel={this._renderLabel(props)}
        style={styles.tabbar}
      />
    );
  };

  _renderScene = ({ route }) => {
    switch (route.key) {
      case 'follows':
        return <FollowsView navigator={this.props.navigator} />;
      case 'chats':
        return <ChatsView   navigator={this.props.navigator} />;
      case 'profile':
        return <ProfileView navigator={this.props.navigator} />;
      default:
        return null;
    }
  };

  _renderPager = (props) => {
    return <TabViewPagerPan {...props} swipeEnabled={(Platform.OS == 'android' ? true : false)} />;
  };

  _onPressHeader = (name) => {
    this.props.navigator.push({name});
  }

  render() {

    return (
      <View style={styles.container}>

        <S5Header
          title={Platform.OS == 'android'? 'STALK' : this.state.title}
          rightItem={ this.state.actions }
          onPress={ this._onPressHeader }
        />

        {Platform.OS == 'android' ? /* FOR ANDROID */ (

          <TabViewAnimated
            style={styles.container}
            navigationState={this.state}
            animationEnabled={false}
            renderPager={this._renderPager}
            renderScene={this._renderScene}
            renderHeader={this._renderHeader}
            onRequestChangeTab={this._handleChangeTab}
          />

        ) : /* FOR IOS */ (

          <TabViewAnimated
            style={styles.container}
            navigationState={this.state}
            animationEnabled={false}
            renderPager={this._renderPager}
            renderScene={this._renderScene}
            renderFooter={this._renderFooter}
            onRequestChangeTab={this._handleChangeTab}
          />

        )}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: S5Colors.primaryDark,
  },
  label: {
    fontSize: 12,
    margin: 5,
  },
  indicator: {
    backgroundColor: '#ffeb3b',
  },
  unreadCountWrap:{
    position:'absolute',
    right:-5,
    backgroundColor:'#ef403b',
    width:16,
    height:16,
    borderRadius:8,
  },
  unreadCount : {
    color:'white',
    alignItems:'center',
    textAlign:'center',
    padding:0,
    backgroundColor:'transparent',
    fontSize:10
  }
});


function select(store) {
  return {
    tab: store.navigation.tab,
    totalUnreadCount: store.messages.totalUnreadCount
  };
}

function actions(dispatch) {
  return {
    switchTab: (tab) => dispatch(switchTab(tab)),
  };
}

module.exports = connect(select, actions)(TabsView);
