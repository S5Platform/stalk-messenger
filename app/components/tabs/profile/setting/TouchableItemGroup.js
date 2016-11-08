import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import { S5Color } from 's5-components';
import TouchableItem from './TouchableItem';

export default class TouchableItemGroup extends Component {

  static propTypes = {
    title: React.PropTypes.string,
    style: View.propTypes.style,
    titleStyle: Text.propTypes.style,
  }

  static defaultProps = {
    title: null,
  }

  render() {
    const { children, style, title, titleStyle} = this.props;

    const borderStyle = {
      borderBottomWidth: 0.5,
      borderBottomColor: 'lightgray',
    }

    return (
      <View style={[style]}>
        {title && (<Text style={[styles.title, titleStyle]}>{title}</Text>)}
        <View style={[styles.container]}>
          {React.Children.map(children, (child, index) => {
            return React.cloneElement(child, {
              borderStyle: (index >= children.length-1) ? null : borderStyle,
            })
          })}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth:0.5,
    borderTopColor:'lightgray',
    borderBottomWidth:0.5,
    borderBottomColor:'lightgray',
  },
  title: {
    fontSize: 13,
    marginLeft: 15,
    marginBottom: 6,
  }
});
