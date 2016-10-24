
/*
 * @flow
 */

'use strict';


import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet
} from 'react-native';

import S5Paragraph from './S5Paragraph';

export default class S5EmptyRow extends Component {

  static propTypes = {
    
    title:  React.PropTypes.string,
    image: React.PropTypes.any,
    text: React.PropTypes.string.isRequired,
    children: React.PropTypes.any,
  };

 render() {
   const image = this.props.image && <Image style={styles.image} source={this.props.image} />;
   const title = this.props.title &&
     <Text style={styles.title}>{this.props.title}</Text>;

   return (
     <View style={[styles.container, this.props.style]}>
       {image}
       {title}
       <S5Paragraph style={styles.text}>
         {this.props.text}
       </S5Paragraph>
       {this.props.children}
     </View>
   );
 }
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: 'white',
   padding: 30,
   paddingTop: 75,
   alignItems: 'center',
 },
 title: {
   textAlign: 'center',
   marginBottom: 10,
 },
 image: {
   marginBottom: 10,
 },
 text: {
   textAlign: 'center',
   marginBottom: 35,
 },
});
