import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image
} from 'react-native';

import { connect } from 'react-redux';
import { S5Header, S5TextInput, S5Icon } from 's5-components';
import { updateUser } from 's5-action';

class ProfileForm extends Component {


  constructor(props) {
    super(props);

    var params = this.props.navigation && this.props.navigation.state.params || this.props;

    if( params ){
      this.state = {
        key : params.field,
        value : this.props.user[params.field],
        title : params.title,
        placeholder: 'Please input ' + params.title,
        validLength: params.validLength
      }
    }

  }

  componentDidMount() {
    this.refs['textinput'].focus();
  }

  _onChangeText = (text) => {
    if( this.state.validLength && text.length > this.state.validLength ){
      return;
    }
    this.setState({value: text});
  }

  _renderIcon = () => {
    return (
      <S5Icon
        name={'close-circle'}
        size={20}
        color={'#808080'}
        onPress={ () => this.setState({value: ''}) }  />
    )
  }

  _renderValidation = () => {
    if( this.state.validLength && this.state.validLength > 0 ){
      return(
        <Text style={styles.helper}>
          {this.state.value.length}/{this.state.validLength}
        </Text>
      )
    }
  }

  saveProfile = () => {
    var data = {};
    data[this.state.key] = this.state.value;
    this.props.dispatch(updateUser(data));
    if( this.props.navigation ){
      this.props.navigation.goBack(null);
    } else {
      this.props.navigator.pop();
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <S5Header
          title={this.state.title}
          style={{backgroundColor: '#224488'}}
          leftItem={[ {icon: 'arrow-back'} ]}
          rightItem={[ {icon: 'checkmark-circle-outline'} ]}
          onPress={ (name) => {
            if( name == 'checkmark-circle-outline') return this.saveProfile();
            if( this.props.navigation ){
              return this.props.navigation.goBack(null);
            } else {
              return this.props.navigator.pop();
            }
          }}
        />

        <S5TextInput
          ref="textinput"
          label={this.state.placeholder}
          style={styles.textinput}
          placeholder={this.state.placeholder}
          value={this.state.value}
          onChangeText={ this._onChangeText }
          renderContainerIcon={ this._renderIcon }
          renderRightLabel={ this._renderValidation }
        />
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  helper:{
    position: 'absolute',
    right:0,
    fontSize:14,
  },
  textinput: {
    margin: 10,
  },
});

function select(store) {
  return {
    user: store.user
  };
}

module.exports = connect(select)(ProfileForm);
