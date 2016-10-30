/**
 *
 * Folder 를 생성/수정하는 Form
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
  Image
} from 'react-native';

import { connect } from 'react-redux';
import { S5Header, S5TextInput, S5Icon } from 's5-components';
import { updateUser } from 's5-action';

class SettingForm extends Component {

  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    user: React.PropTypes.object.isRequired,
    field: React.PropTypes.string,
    title: React.PropTypes.string,
    validLength: React.PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.state = {};

    if( this.props.field ){
      this.state = {
        key : this.props.field,
        value : this.props.user[this.props.field],
        title : this.props.title,
        placeholder: 'Please input ' + this.props.title,
      }
    }

  }

  componentDidMount() {
    this.refs['textinput'].focus();
  }


  _onChangeText = (text) => {
    if( this.props.validLength && text.length > this.props.validLength ){
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
    if( this.props.validLength && this.props.validLength > 0 ){
      return(
        <Text style={styles.helper}>
          {this.state.value.length}/{this.props.validLength}
        </Text>
      )
    }
  }

  saveSetting = () => {
    this.props.dispatch(updateUser(this.state.key, this.state.value));
    this.props.navigator.pop();
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
            if( name == 'checkmark-circle-outline') return this.saveSetting();
            return this.props.navigator.pop();
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

module.exports = connect(select)(SettingForm);
