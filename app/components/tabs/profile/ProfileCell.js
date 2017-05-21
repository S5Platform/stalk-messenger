import React, { Component } from 'React';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet
} from 'react-native';

import { S5Icon } from 's5-components';

export default class ProfileCell extends Component {

  static propTypes = {
    onPress: React.PropTypes.func.isRequired,
    label: React.PropTypes.string.isRequired,
    text: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
       <TouchableHighlight onPress={this.props.onPress}
          style={styles.container}
          underlayColor='transparent'>
          <View style={styles.wrap}>
            <Text style={styles.label}>
              {this.props.label}
            </Text>
            <Text style={styles.text}>
              {this.props.text}
            </Text>
            <S5Icon name={'arrow-forward'} color={'gray'} style={styles.arrow}/>
          </View>
        </TouchableHighlight>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 20,
    alignSelf: 'stretch',
  },
  wrap: {
    flexDirection: 'column',
  },
  label: {
    fontSize: 16
  },
  text: {
    color:'#3b6bb2'
  },
  arrow: {
    position: 'absolute',
    top: 0,
    right: 0,
    opacity: 0.2
  }
});
