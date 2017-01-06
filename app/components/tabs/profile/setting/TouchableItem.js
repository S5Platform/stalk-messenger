import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Switch
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

  constructor(props) {
    super(props);

    this.state = {
       switchOn: false
    }
  }

  static defaultProps = {
    iconSize: 25,
    showArrow: false,
  }

  _onToggle = (value) => {
    this.setState({switchOn: value});
  }  

  render() {
    const { iconSize, onPress, text, textStyle, style, borderStyle, showArrow, showToggle, value} = this.props;

    if( showToggle ){
      return (
      <View style={{alignSelf:'stretch', height: 48}}>
        <View style={[styles.container, style, borderStyle]}>
          <Text style={[styles.text, textStyle]}>{text}</Text>
          <Switch
            onValueChange={(value) => this._onToggle(value)}
            onTintColor="#000000"
            style={{marginBottom: 10}}
            thumbTintColor="#0000ff"
            value={this.state.switchOn}
            tintColor="#000000" />
        </View>
      </View>
      )
    }

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
