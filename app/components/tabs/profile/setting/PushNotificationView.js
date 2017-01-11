import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ListView,
  ScrollView,
  Switch
} from 'react-native';

import { connect } from 'react-redux';
import { updateSetting } from 's5-action';

import { S5Header } from 's5-components';

import TouchableItem from './TouchableItem';
import TouchableItemGroup from './TouchableItemGroup';

class PushNotificationView extends Component {

  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
    }
  }

  _onChangeToggle = (key,value) => {
    this.props.dispatch(updateUser(key,value));
  }

  render() {
    return (
      <View style={styles.container}>

        <S5Header
          title={'Push Notification'}
          style={{backgroundColor: '#224488'}}
          leftItem={[ {icon: 'arrow-back'} ]}
          onPress={ (name) => this.props.navigator.pop() }
        />
        <ScrollView
          style={styles.contentContainer} >

         <TouchableItemGroup style={styles.groupStyle} title='Notification View'>
           <TouchableItem text='Preview' showToggle onToggle={(value) => this._onChangeToggle( 'preview',value )}/>
           <TouchableItem text='Image Preview' showToggle onToggle={(value) => this._onChangeToggle( 'imagePreview',value )}/>
         </TouchableItemGroup>
        </ScrollView>        
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  contentContainer: {
    backgroundColor: 'whitesmoke',
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 2,
  },
  groupStyle: {
    marginVertical: 8,
  },
});


function select(store) {
  return {
    settings: store.settings,
  };
}

module.exports = connect(select)(PushNotificationView);
