/**
 *
 * @flow
 */
'use strict';

import React, { Component } from 'React';
import {
  View,
  Text,
  TouchableHighlight,
} from 'react-native';
import S5Colors from './S5Colors';
import S5Image  from './S5Image';
import S5Icon   from './S5Icon';

export default class S5GridPicture extends Component {

  static propTypes = {
    size: React.PropTypes.number,
    images: React.PropTypes.array.isRequired,
    alts: React.PropTypes.array.isRequired,
    style: React.PropTypes.any,
  };

  constructor(props) {
    super(props);
  }

  renderImages(){
    const {size} = this.props;
    var images = this.props.images;
    var alts = this.props.alts;

    if( !alts || alts.length != images.length ){
      alts = [];
      for( var k in images ){
        alts.push( '' );
      }
    }

    if( !images ){
      return (
        <S5Icon
          name={'contact'}
          size={size}
          color={'#808080'}
          style={{flexDirection: 'row'}} />
      )
    }else if( images.length == 1 ){
      return (
        <S5Image source={{uri:images[0]}} alt={alts[0]}
          style={{width: size, height: size, borderRadius: size / 2}} />
      )
    } else if ( images.length == 2 ){
      return (
        <S5Icon
          name={'contact'}
          size={size}
          color={'#808080'}
          style={{flexDirection: 'row'}} >
          <S5Image source={{uri:images[0]}} style={{width: size/2, height: size}} alt={alts[0]}/>
          <View style={{width:1,height:size,backgroundColor:'white'}} />
          <S5Image source={{uri:images[1]}} style={{width: size/2, height: size}} alt={alts[1]} />
        </S5Icon>
      )
    } else if ( images.length == 3 ){
      return (
        <S5Icon
          name={'contact'}
          size={size}
          color={'#808080'}
          style={{flexDirection: 'row'}} >
          <S5Image source={{uri:images[0]}} style={{width: size/2, height: size}} alt={alts[0]}/>
          <View style={{width:1,height:size,backgroundColor:'white'}} />
          <View style={{width:size/2,height:size}}>
            <S5Image source={{uri:images[1]}} style={{width: size/2, height: size/2}} alt={alts[1]}/>
            <View style={{width:size/2,height:1,backgroundColor:'white'}} />
            <S5Image source={{uri:images[2]}} style={{width: size/2, height: size/2}} alt={alts[2]}/>
          </View>
        </S5Icon>
      )
    } else {
      return (
        <S5Icon
          name={'contact'}
          size={size}
          color={'#808080'}
          style={{flexDirection: 'row'}} >
          <View style={{width:size/2,height:size}}>
            <S5Image source={{uri:images[0]}} style={{width: size/2, height: size/2}} alt={alts[0]}/>
            <View style={{width:size/2,height:1,backgroundColor:'white'}} />
            <S5Image source={{uri:images[1]}} style={{width: size/2, height: size/2}} alt={alts[1]}/>
          </View>
          <View style={{width:1,height:size,backgroundColor:'white'}} />
          <View style={{width:size/2,height:size}}>
            <S5Image source={{uri:images[2]}} style={{width: size/2, height: size/2}} alt={alts[2]}/>
            <View style={{width:size/2,height:1,backgroundColor:'white'}} />
            <S5Image source={{uri:images[3]}} style={{width: size/2, height: size/2}} alt={alts[3]}/>
          </View>
        </S5Icon>
      )
    }
  }

  render() {
    const {size} = this.props;
    return (
      <View style={[{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center'},
        this.props.style]}>
        {this.renderImages()}
      </View>
    )
  }
}
