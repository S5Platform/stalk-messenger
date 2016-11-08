import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ListView,
} from 'react-native';

import { S5Header } from 's5-components';

const policy = require('../../../../../assets/privacyPolicy.json');

export default class PrivacyPolicyView extends Component {

  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }).cloneWithRows(policy.contents),
    }
  }


  _renderRow = (rowData, sectionID, rowID) => {
    const { title, text } = rowData;

    return (
        <View style={styles.rowContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.text}>{text}</Text>
        </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>

        <S5Header
          title={'PRIVACY POLICY'}
          style={{backgroundColor: '#224488'}}
          leftItem={[ {icon: 'arrow-back'} ]}
          onPress={ (name) => this.props.navigator.pop() }
        />

        <ListView
          style={styles.list}
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
        />

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  separator: {
    height: 0.5,
    alignSelf: 'stretch',
    backgroundColor: 'darkgray',
  },
  rowContainer: {
    padding:10,
  },
  title: {
    fontSize: 15,
    color: 'black',
  },
  text: {
    fontSize: 14,
    marginTop: 5,
    color: 'gray'
  }
});
