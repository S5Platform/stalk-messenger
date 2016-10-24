/*
 * https://github.com/mortik/react-native-floating-label-text-input/blob/master/index.js
 * @flow
*/
'use strict';

import React, { Component } from 'react';
import {
  View,
  TextInput,
  Text,
  Platform
} from 'react-native';

export default class S5TextInput extends Component {

  static propTypes = {
    borderBottomColor: React.PropTypes.string,
    focusBorderBottomColor: React.PropTypes.string,
    label: React.PropTypes.string,
    value: React.PropTypes.string,
    secureTextEntry: React.PropTypes.bool,
    placeholder: React.PropTypes.string,
    onChangeText: React.PropTypes.func,
    renderContainerIcon: React.PropTypes.func,
    renderRightLabel: React.PropTypes.func,
    onFocus: React.PropTypes.func,
    onBlur: React.PropTypes.func,
    renderLabel: React.PropTypes.func,
    style: React.PropTypes.any,
  };

  state = {
    borderBottomColor: '#7ACFC2',
  };

  constructor(props) {
    super(props);
  }

  focus() {
    if (this.s5textinput !== null) {
      this.s5textinput.focus();
    }
  }

  _onFocus() {
      let focusBorderColor = this.props.focusBorderBottomColor ? this.props.focusBorderBottomColor : '#0095d9';
      this.setState({borderBottomColor: focusBorderColor});

      if (this.props.onFocus) {
          this.props.onFocus();
      }
  }

  _onBlur() {
      let borderColor = this.props.borderBottomColor ? this.props.borderBottomColor : '#7ACFC2';
      this.setState({borderBottomColor: borderColor});

      if (this.props.onBlur) {
          this.props.onBlur();
      }
  }

  _renderContainerIcon() {
    if( this.props.renderContainerIcon ){
      return this.props.renderContainerIcon();
    }
  }

  _renderLabel() {
    if ( this.props.renderLabel ) {
      return this.props.renderLabel();
    } else if ( this.props.label ) {
      return (
        <View style={{
          marginTop: 10,
          flexDirection: 'row',
        }}>
          <Text style={{
            fontSize: 12,
            letterSpacing: 1,
            color: this.state.borderBottomColor,
            backgroundColor: 'transparent',
          }}>
            {this.props.label}
          </Text>
          {this._renderRightLabel()}
        </View>
      );
    }
  }

  _renderRightLabel() {
    if ( this.props.renderRightLabel ) {
      return this.props.renderRightLabel();
    }
  }

  render() {

    if(Platform.OS == 'android'){

      return (

        <View style={this.props.style}>

          {this._renderLabel()}

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomColor: this.state.borderBottomColor,
            borderBottomWidth: 1,
          }}>
            <TextInput
              ref={(ref) => this.s5textinput = ref}
              style={[{
                height: 43,
                flex: 1,
              }, this.props.inputStyle]}
              onChangeText={this.props.onChangeText}
              placeholder={this.props.placeholder}
              secureTextEntry={this.props.secureTextEntry}
              onFocus={() => {this._onFocus()}}
              onBlur={() => {this._onBlur()}}
              value={this.props.value}
              autoCorrect={this.props.autoCorrect}
              autoCapitalize={this.props.autoCapitalize}
              returnKeyType={this.props.returnKeyType}
              keyboardType={this.props.keyboardType}
              onSubmitEditing={this.props.onSubmitEditing}
              blurOnSubmit={this.props.blurOnSubmit}
              underlineColorAndroid='rgba(0,0,0,0)'
              />

            {this._renderContainerIcon()}

          </View>
        </View>
      );

    } else {

      return (

        <View style={this.props.style}>

          {this._renderLabel()}

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomColor: this.state.borderBottomColor,
            borderBottomWidth: 1,
          }}>
            <TextInput
              ref={(ref) => this.s5textinput = ref}
              style={[{
                height: 43,
                flex: 1,
              }, this.props.inputStyle]}
              onChangeText={this.props.onChangeText}
              placeholder={this.props.placeholder}
              secureTextEntry={this.props.secureTextEntry}
              onFocus={() => {this._onFocus()}}
              onBlur={() => {this._onBlur()}}
              value={this.props.value}
              autoCorrect={this.props.autoCorrect}
              autoCapitalize={this.props.autoCapitalize}
              returnKeyType={this.props.returnKeyType}
              keyboardType={this.props.keyboardType}
              onSubmitEditing={this.props.onSubmitEditing}
              blurOnSubmit={this.props.blurOnSubmit}
              />

            {this._renderContainerIcon()}

          </View>
        </View>
      );
    }

  }

}
