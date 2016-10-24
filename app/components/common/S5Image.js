/**
 *
 * @flow
 */
'use strict';

import React, { Component } from 'React';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
} from 'react-native';

import S5Colors from './S5Colors';

export default class S5Image extends Component {

  static propTypes = {
    alt: React.PropTypes.string
  };

  constructor(props) {
    super(props);
  }

 render() {
    if( ( !this.props.source.uri || this.props.source.uri  == '' ) && this.props.alt ){

      let alt = '';
      alt = this.props.alt.substring(0, 1);

      return (
        <View
          style={[this.props.style,
            { 
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: S5Colors.colorForProfile(alt)
            }
          ]}>
          <Text
            style={{
              color: '#FFFFFF',
              fontWeight: 'bold',
              fontSize: (this.props.style.width * 0.6),
              backgroundColor: 'rgba(0,0,0,0)',
            }}>{alt}</Text>
        </View>
      );
    } else {
      return (
        <Image
          {...this.props}
        />
      );
    }
  }
}
