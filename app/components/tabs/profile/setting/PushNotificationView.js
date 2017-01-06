import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ListView,
  ScrollView,
  Switch
} from 'react-native';

import { S5Header } from 's5-components';

import TouchableItem from './TouchableItem';
import TouchableItemGroup from './TouchableItemGroup';

export default class PushNotificationView extends Component {

  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
    }
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
           <TouchableItem text='Preview' showToggle onToggle={(value) => console.log( value )}/>
           <TouchableItem text='Image Preview' showToggle onToggle={(value) => console.log( value ) }/>
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
