import React, { Component } from 'react';

import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback
} from 'react-native';

var window = Dimensions.get('window');

var styles = StyleSheet.create({
  outerCircle: {
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2 / window.scale,
    borderRadius: 10,
    backgroundColor: 'transparent'
  },
  innerCircle: {
    height: 16,
    width: 16,
    borderRadius: 8
  }
});

class Circle extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var { color, isSelected, selectedColor, circlesStyle, size } = this.props;

    let innerCircle;
    let appliedColor;

    var outerSize = size ? size : styles.outerCircle.width;
    var innerSize = size ? (size - 8) : styles.innerCircle.width;

    if (isSelected) {
      appliedColor = selectedColor;
      innerCircle = <View style={[styles.innerCircle, { backgroundColor: appliedColor }, {width:innerSize,height:innerSize,borderRadius:innerSize/2}]}/>;
    } else {
      appliedColor = color;
      innerCircle = null;
    }

    return (
      <View style={{ padding: 5 }}>
        <View style={[styles.outerCircle, { borderColor: appliedColor }, {width:outerSize,height:outerSize,borderRadius:outerSize/2}]}>
          {innerCircle}
        </View>
      </View>
    );
  }
}

Circle.propTypes = {
  color: React.PropTypes.string,
  selectedColor: React.PropTypes.string,
  isSelected: React.PropTypes.bool
};

Circle.defaultProps = {
  isSelected: false
};

class S5Radio extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedIndex: -1 }
  }

  _onSelect(index) {
    var { onSelect } = this.props;
    this.setState({
      selectedIndex: index
    });
    onSelect(index);
  }

  render() {
    var { selectedIndex } = this.state;
    var {color, selectedColor, circlesStyle, size, fontSize, optionStyle} = this.props;
    var targetIndex = selectedIndex !== -1? selectedIndex : this.props.defaultSelect;

    var children = React.Children.map(this.props.children, (child, index) => {
      if (child.type === Option) {
        return React.cloneElement(child, {
          onPress: () => this._onSelect(index),
          isSelected: index == targetIndex,
          color: color,
          selectedColor: selectedColor,
          circlesStyle: circlesStyle,
          size: size,
          fontSize: fontSize,
          direction:this.props.direction,
          optionStyle: optionStyle
        });
      }

      return child;
    });

    var direction = 'column';
    if( this.props.direction ){
      direction = this.props.direction;
    }

    return (
      <View style={{flexDirection:direction}}>
        {children}
      </View>
    );
  }
}

S5Radio.propTypes = {
  onSelect: React.PropTypes.func.isRequired,
  defaultSelect: React.PropTypes.number
};

S5Radio.defaultProps = {
  defaultSelect: -1
};

class Option extends Component {
  constructor(props) {
    super(props);
  }

  _renderChildren() {

    var { children, isSelected, color, selectedColor, size, fontSize } = this.props;

    var thisFontColor = isSelected ? selectedColor : color;
    var thisFontSize = fontSize ? fontSize : size * 0.6;

    return (
      <View style={{ flex: 1,'justifyContent':'center' }}>
        <Text style={{justifyContent:'center',color:thisFontColor,fontSize:thisFontSize,fontWeight:'bold'}}>
        {children}
        </Text>
      </View>
    )
  }

  render() {
    var { onPress, isSelected, color, selectedColor, children, size, direction, optionStyle} = this.props;

    var directionStyle = {};
    if( direction == 'row' ){
      directionStyle = {flex:1};
    }

    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={[{flexDirection: 'row'},directionStyle, optionStyle]}>
          <Circle color={color} selectedColor={selectedColor} isSelected={isSelected} size={size}/>
          {this._renderChildren()}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

Option.propTypes = {
  onPress: React.PropTypes.func,
  isSelected: React.PropTypes.bool,
  color: React.PropTypes.string,
  selectedColor: React.PropTypes.string
};

S5Radio.Option = Option;
module.exports = S5Radio;
