import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
} from 'react-native';

import { S5Icon } from 's5-components';

export default class TouchableItem extends Component {

  static propTypes = {
    iconSize: React.PropTypes.number,
    onPress: React.PropTypes.func,
    text: React.PropTypes.string,
    style: View.propTypes.style,
    textStyle: Text.propTypes.style,
    borderStyle: View.propTypes.style,
    showArrow: React.PropTypes.bool,
  }

  static defaultProps = {
    iconSize: 25,
    showArrow: false,
  }

  render() {
    const { iconSize, onPress, text, textStyle, style, borderStyle, showArrow} = this.props;

    return (
      <TouchableHighlight style={{alignSelf:'stretch', height: 48}} onPress={() => onPress()}>
        <View style={[styles.container, style, borderStyle]}>
          <Text style={[styles.text, textStyle]}>{text}</Text>
          {showArrow && (<S5Icon name='arrow-forward' size={iconSize}/>)}
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection:'row',
    backgroundColor:'white',
    alignItems:'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  text: {
    fontSize: 16,
    color: 'black'
  }
});
