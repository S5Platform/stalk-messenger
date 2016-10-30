/**
 *
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  StyleSheet,
  PixelRatio
} from 'react-native';

import { S5ProfilePicture, S5Icon } from 's5-components';

export default class FollowCell extends Component {

  state = {
    checked : this.props.checked?this.props.checked:false
  };

  static propTypes = {
    user: React.PropTypes.object.isRequired,
    onProfilePress: React.PropTypes.func,
    onPress: React.PropTypes.func,
    selectable: React.PropTypes.bool,
    prefix: React.PropTypes.string,
  };

  _renderCheckbox = () => {
    if( this.props.selectable ){
      if( this.props.disabled ) {
        if( this.state.checked ){
          return (
            <View style={styles.disabledChecked}>
              <S5Icon name={'checkmark'} color={'white'} />
            </View>
          )
        } else {
          return (
            <View style={styles.disabledUnchecked}>
            </View>
          )
        }
      } else {
        if( this.state.checked ){
          return (
            <View style={styles.checked}>
              <S5Icon name={'checkmark'} color={'white'} />
            </View>
          )
        } else {
          return (
            <View style={styles.unchecked}>
            </View>
          )
        }
      }
    }
    return null;
  }

  _renderPrefix = () => {
    if( this.props.prefix ){
      return <Text style={styles.prefix}>{this.props.prefix}  </Text>
    }
    return null;
  }

  _onPress = () => {
    if( this.props.onPress && !this.props.disabled ){
      if( this.props.selectable ){
        this.props.onPress(!this.state.checked);
        if( this.state.checked ){
          this.setState( {checked:false} );
        } else {
          this.setState( {checked:true} );
        }
      } else {
        this.props.onPress(false);
      }
    }
  }

  _onProfilePress = () => {
    if( this.props.onProfilePress ){
      this.props.onProfilePress();
    } else {
      this._onPress();
    }
  }

  render() {

    var bgColorStyle = {};
    if( this.props.disabled ){
      bgColorStyle = {"backgroundColor":"#f1f1f1"};
    }

    return (
      <TouchableHighlight onPress={this._onPress} >
        <View style={[styles.container,bgColorStyle]}>
          {this._renderCheckbox()}
          <S5ProfilePicture
            key={this.props.user.id}
            name={this.props.user.nickName}
            profileFileUrl={this.props.user.profileFileUrl}
            onPress={this._onProfilePress}
            size={48}
            style={{
              margin:10
            }}
          />
          <View style={styles.detailContainer}>
            <Text style={styles.nickName}>
              {this._renderPrefix()}{this.props.user.nickName} <Text style={styles.username}> {this.props.user.username} </Text>
            </Text>
            <Text numberOfLines={1} style={styles.statusMessage}>
              {this.props.user.statusMessage}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );

  }

}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFD',
  },
  image: {
    margin:10,
  },
  detailContainer: {
    flex: 1,
    marginRight: 10,
  },
  nickName: {
    fontSize: 15,
    marginTop: 10,
    marginBottom: 5,
    color: '#000000'
  },
  username: {
    fontSize: 12,
    marginBottom: 5,
    color: '#DA552F'
  },
  prefix: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#7F91A7',
  },
  statusMessage: {
    fontSize: 12,
    marginBottom: 5,
    color: 'gray'
  },
  unchecked: {
    marginLeft: 10,
    backgroundColor:'white',
    width:30,
    height:30,
    borderRadius: 15,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#7F91A7'
  },
  checked: {
    marginLeft: 10,
    backgroundColor:'#224488',
    width:30,
    height:30,
    borderRadius: 15,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledUnchecked:{
    marginLeft: 10,
    backgroundColor:'#838585',
    width:30,
    height:30,
    borderRadius: 15,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#7F91A7'
  },
  disabledChecked:{
    marginLeft: 10,
    backgroundColor:'#838585',
    width:30,
    height:30,
    borderRadius: 15,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  }
})
