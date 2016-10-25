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
    return (
      <NavigationBar
        style={styles.toolbar}
        title={{ title: this.props.title || 'STALK', style: {color: S5Colors.primaryText}}}
        leftButton={
          <NavBarButton
            style={{ marginLeft: 10 }}
            onPress={ this.props.onPress }
            actions={ this.props.leftItem } />
        }
        rightButton={
          <NavBarButton
            style={{ marginRight: 10 }}
            onPress={ this.props.onPress }
            actions={ this.props.rightItem } />
        }
      />
    );
  }

}

class NavBarButton extends Component {

  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape({
      icon: PropTypes.string.isRequired,
    })),
    onPress: PropTypes.func.isRequired,
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
    height: 52,
  }
});
