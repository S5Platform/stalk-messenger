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
import S5Icon from './S5Icon';

export default class S5ProfilePicture extends Component {

  static propTypes = {
    name: React.PropTypes.string,
    size: React.PropTypes.number,
    onPress: React.PropTypes.func,
    profileFileUrl: React.PropTypes.string,
    editable: React.PropTypes.bool,
    style: React.PropTypes.any,
  };

  constructor(props) {
    super(props);
  }

  onPressProfileImage() {

    if(this.props.onPress === undefined) return null;

    return this.props.onPress && this.props.onPress();
  }

  renderIcon(){

    const {size} = this.props;

    if(this.props.editable){
      return (
        <View
          style={{
            width: (size / 5 )+10,
            height: (size / 5)+10 ,
            position: 'absolute',
            top: size - ( size / 4 ),
            left: size - ( size / 4 ),
            borderRadius: (size / 5 + 10) / 2,
            alignItems: 'center',
            backgroundColor:'white'
          }} >
          <S5Icon
            name={'camera'}
            size={(size / 5 )}
            color={'#808080'}
            style={{opacity:0.5, marginTop:5}} />
        </View>
      )
    }
  }

  renderProfileCircle(){

    const {size} = this.props;

    let uri = "";
    if( this.props.profileFileUrl && this.props.profileFileUrl != null ) {
      uri = this.props.profileFileUrl;
    }

    if( uri ){
      return (
        <S5Icon
          name={'contact'}
          size={size}
          color={'#808080'}
          style={this.props.style} />
      );

    }else{

      let name = '';
      if(this.props.name) name = this.props.name.substring(0, 1);

      return (
        <View
          style={[{
            width: size,
            height: size,
            borderRadius: size / 2,
            opacity:0.8,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: S5Colors.colorForProfile(name),
          },this.props.style]}>
          <Text
            style={{
              color: '#FFFFFF',
              fontWeight: 'bold',
              fontSize: (size * 0.6),
              backgroundColor: 'rgba(0,0,0,0)',
            }}>{name}</Text>
        </View>
      );
    }

  }

  render() {
    if(this.props.onPress === undefined){
      return (
        <View>
          {this.renderProfileCircle()}
        </View>
      );
    }else{
      return (
        <TouchableHighlight onPress={this.onPressProfileImage.bind(this)} underlayColor="transparent">
          <View>
            {this.renderProfileCircle()}
            {this.renderIcon()}
          </View>
        </TouchableHighlight>
      );
    }
  }
}
