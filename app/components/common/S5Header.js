/**
 * @providesModule S5Header
 * @flow
 */

import React, { Component, PropTypes } from 'react';
import {
  Platform,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ToolbarAndroid,
} from 'react-native';

import NavigationBar from 'react-native-navbar';
import S5Colors from './S5Colors';
import S5Icon   from './S5Icon';
import S5NavBarButton from './S5NavBarButton';

export default class S5Header extends Component {

  static propTypes = {
    title: PropTypes.string,
    onPress: PropTypes.func,
    leftItem: PropTypes.arrayOf(PropTypes.shape({
      icon: PropTypes.string.isRequired,
    })),
    rightItem: PropTypes.arrayOf(PropTypes.shape({
      icon: PropTypes.string.isRequired,
    })),
  };

  static defaultProps = {
    leftItem: [],
    rightItem: [],
  };

  render() {

    var backgroundColor = S5Colors.primary;
    var iconColor = S5Colors.primaryText;

    if( this.props.style !== undefined && this.props.style.backgroundColor){
        backgroundColor = this.props.style.backgroundColor;
    }

    if( this.props.iconColor ){
      iconColor = this.props.iconColor;
    }

    return (
      <NavigationBar
        style={[styles.toolbar,{backgroundColor:backgroundColor}]}
        title={{
          title: this.props.title.toUpperCase() || 'STALK',
          style: styles.title
        }}
        leftButton={
          <S5NavBarButton
            style={{ marginLeft: 15 }}
            color={iconColor}
            onPress={ this.props.onPress }
            actions={ this.props.leftItem } />
        }
        rightButton={
          <S5NavBarButton
            style={{ marginRight: 15 }}
            color={iconColor}
            onPress={ this.props.onPress }
            actions={ this.props.rightItem } />
        }
        statusBar={ {
          style: 'light-content',
          tintColor: S5Colors.primaryDark,
          hidden: false,
        } }
      />
    );
  }

}

const styles = StyleSheet.create({
  btnContent: {
    justifyContent:'center'
  },
  toolbar: {
    backgroundColor: S5Colors.primary,
    height: 50,
  },
  title: {
    letterSpacing: 2,
    fontSize: 14,
    color: S5Colors.primaryText
  },
});
