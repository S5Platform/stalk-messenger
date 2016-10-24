/*
 * @providesModule S5Icon
 * @flow
 */
 
import React, { Component } from 'react';
import { Platform } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

const S5Icon = (props) => {

  if( props.children ) {
    return (
      <Icon.Button
        name={Platform.OS === 'ios' ? 'ios-'+props.name : 'md-'+props.name}
        size={props.size || 30}
        color={props.color || 'black'}
        style={[{backgroundColor: 'transparent'}, props.style]}
        backgroundColor="transparent"
        onPress={props.onPress}
        >
        {props.children}
      </Icon.Button>
    );

  } else {
    return <Icon
      name={Platform.OS === 'ios' ? 'ios-'+props.name : 'md-'+props.name}
      size={props.size || 30}
      color={props.color || 'black'}
      style={[{backgroundColor: 'transparent'}, props.style]}
      onPress={props.onPress}
      />;

  }

};

module.exports = S5Icon;
