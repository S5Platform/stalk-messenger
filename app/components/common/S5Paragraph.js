/**
 *
 * @flow
 */

'use strict';

import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  Dimensions
} from 'react-native';

import S5Colors from './S5Colors';


const scale = Dimensions.get('window').width / 375;


export default class S5Paragraph extends Component {

  static propTypes = {
    style: Text.propTypes.style,
  }

  render() {
    return <Text style={[styles.p, this.props.style]} {...this.props} />;
  }

}

function normalize(size: number): number {
  return Math.round(scale * size);
}

const styles = StyleSheet.create({
  p: {
    fontSize: normalize(15),
    lineHeight: normalize(23),
    color: S5Colors.lightText,
  },
});
