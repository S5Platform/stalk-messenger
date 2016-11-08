import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ListView,
} from 'react-native';

import { S5Header } from 's5-components';

const license = require('../../../../../assets/license.json');

export default class LicenseView extends Component {

  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }).cloneWithRows(license.licenses),
    }
  }

  _renderSeparator = (sectionID, rowID) => {
    return (
      <View key={`${sectionID}-${rowID}`} style={styles.separator}/>
    )
  }

  _renderRow = (rowData, sectionID, rowID) => {
    const { name, homepage, type } = rowData;

    return (
        <View style={styles.rowContainer}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.subtitle}>{homepage}</Text>
          <Text style={styles.subtitle}>{type}</Text>
        </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>

        <S5Header
          title={'LICENCES'}
          style={{backgroundColor: '#224488'}}
          leftItem={[ {icon: 'arrow-back'} ]}
          onPress={ (name) => this.props.navigator.pop() }
        />

        <ListView
          style={styles.list}
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderSeparator={this._renderSeparator}
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
    fontSize: 14,
    color: 'black',
  },
  subtitle: {
    fontSize: 11,
    color: 'gray'
  }
});
