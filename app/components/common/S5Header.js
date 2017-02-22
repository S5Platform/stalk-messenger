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
          <NavBarButton
            style={{ marginLeft: 15 }}
            color={iconColor}
            onPress={ this.props.onPress }
            actions={ this.props.leftItem } />
        }
        rightButton={
          <NavBarButton
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

class NavBarButton extends Component {

  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape({
      icon: PropTypes.string.isRequired,
    })),
    onPress: PropTypes.func,
    size: PropTypes.number,
    color: PropTypes.string,
    style: PropTypes.any,
  };

  static defaultProps = {
    size: 28,
    color: S5Colors.primaryText,
    actions: [],
  };

  _updateIconSources = (props) => {

    Promise.all((props.actions || []).map((action) => {
      if (action.icon) {
        return (
            <TouchableOpacity onPress={() => props.onPress(action.key || action.icon)} key={action.key || action.icon} style={styles.btnContent}>
              <S5Icon key={action.key || action.icon} name={action.icon} size={props.size} color={props.color} style={[ props.style, {} ]} />
            </TouchableOpacity>
          );
      }
      return Promise.resolve(action);
    })).then(actions => { this.setState({ actions }) } );

  }

	constructor(props) {
		super(props);
    this.state = {actions: []};
	}

  componentWillMount() {
    this._updateIconSources(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.actions != nextProps.actions) {
      this._updateIconSources(nextProps);
    }
  }

  render() {
    return (
      <View style={{flexDirection: 'row'}}>
        {this.state.actions}
      </View>
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
