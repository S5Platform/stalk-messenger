/**
 *
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

import { connect } from 'react-redux';
import { signup, dismissKeyboard }   from 's5-action';
import { S5TextInput, S5Button, S5Icon } from 's5-components';

import KeyboardSpacer from './KeyboardSpacer';

class SignupView extends Component {

  state = {
    email: '',
    username: '',
    password: '',
    passwordChecked: '',
    message: ' ',
    bottomHeight: 200,
  };

  signup(){

    dismissKeyboard();

    this.setState({ message: ' ' });

    if(!this.state.username) {
      this.setState({ message: 'Username must be filled' });
      this.refs['username'].focus();
      return false;
    }

    if(!this.state.password) {
      this.setState({
        message: 'Password must be filled' ,
        passwordChecked: '',
      });
      this.refs['password'].focus();
      return false;
    }

    if(this.state.passwordChecked != this.state.password) {
      this.setState({
        message: 'Both passwords must be same with',
        password: '',
        passwordChecked: '',
      });
      return false;
    }

    if(!this.state.email) {
      this.setState({ message: 'Email must be filled' });
      this.refs['email'].focus();
      return false;
    }

    this.props.signup( this.state, (error) => {
      if(error.code == 202){ // 202 Account already exists for this username.
        this.setState({ message: 'Account already exists for this username.' });
      }
    });

  }

  _onPress = ()=>{
    if( this.props.navigation ){
      return this.props.navigation.goBack(null);
    } else {
      return this.props.navigator.pop();
    }    
  }

  render() {

    return (
      <View style={styles.container}>

        <TouchableHighlight
          onPress={() => this._onPress()}
          style={{
            marginRight:10,
            marginTop:10
          }}
          underlayColor="transparent">
          <View>
            <S5Icon name={'close'} color={'grey'} size={40} />
          </View>
        </TouchableHighlight>

        <View style={styles.form}>
        
          <Text style={styles.message}> {this.state.message}</Text>

          <S5TextInput
            ref="username"
            label="USERNAME"
            returnKeyType={"next"}
            style={styles.textinput}
            placeholder={''}
            value={this.state.username}
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => this.setState({bottomHeight: 100})}
            onChangeText={(text) => this.setState({username: text.toLowerCase()})}
            blurOnSubmit={false}
            onSubmitEditing={() => this.refs['password'].focus()}
          />
          <S5TextInput
            ref="password"
            label="PASSWORD"
            style={styles.textinput}
            placeholder={''}
            value={this.state.password}
            secureTextEntry={true}
            returnKeyType={"next"}
            onFocus={() => this.setState({bottomHeight: 100})}
            onChangeText={(text) => this.setState({password: text})}
            blurOnSubmit={false}
            onSubmitEditing={() => this.refs['password2'].focus()}
          />
          <S5TextInput
            ref="password2"
            label="PASSWORD ONE MORE!"
            style={styles.textinput}
            placeholder={''}
            value={this.state.passwordChecked}
            secureTextEntry={true}
            returnKeyType={"next"}
            onFocus={() => this.setState({bottomHeight: 230})}
            onChangeText={(text) => this.setState({passwordChecked: text})}
            blurOnSubmit={false}
            onSubmitEditing={() => this.refs['email'].focus()}
          />

          <S5TextInput
            ref="email"
            label="E-MAIL"
            style={styles.textinput}
            placeholder={''}
            value={this.state.email}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            returnKeyType="done"
            onFocus={() => this.setState({bottomHeight: 230})}
            onChangeText={(text) => this.setState({email: text})}
            //blurOnSubmit={false}
            //onSubmitEditing={() => this.signup()}
          />
        </View>

        <S5Button
          style={styles.signupBtn}
          caption="SIGN UP"
          onPress={this.signup.bind(this)}
        />

        <S5Button
          type="secondary"
          caption="ALREADY HAVE AN ACCOUNT ?"
          onPress={() => this._onPress()}
        />

      <KeyboardSpacer height={this.state.bottomHeight} style={{backgroundColor: '#FFFFFF'}}/>

      </View>
    );

  }

}

var styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  form: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: '#FFFFFF',
    padding: 10,
    // Image's source contains explicit size, but we want
    // it to prefer flex: 1
    width: undefined,
    height: undefined,
  },
  textinput: {
    marginTop: 10,
  },
  signupBtn: {
    marginTop: 10,
  },
  message: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 13,
    alignSelf: 'center',
  }
});


function actions(dispatch) {
  return {
    signup: (data, callback) => dispatch(signup(data, callback))
  };
}

module.exports = connect(null, actions)(SignupView);
