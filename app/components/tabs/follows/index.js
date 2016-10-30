/**
 *
 * @flow
 */

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
	TouchableOpacity,
} from 'react-native';

import FollowCell from './FollowCell';

import { loadFollows, removeFollow } from 's5-action';
import { S5Icon, S5Header, S5SwipeListView, S5TextInput } from 's5-components';
import { connect } from 'react-redux';

class FollowsMain extends Component {

  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    follows:  React.PropTypes.object.isRequired,
    removeFollow: React.PropTypes.func.isRequired, // dispatch from actions
  };

  state = {
    listViewData: this.props.follows.list || [],
    filter: '',
  };

  componentWillReceiveProps(nextProps) {

    if (nextProps.follows.list !== this.props.follows.list) {
      var self = this;

      // TODO : reder가 안되는 경우가 있는데, 이건 SwipeListView 의 문제인 것 같아요..
      this.setState({
        listViewData: nextProps.follows.list
      });

      setTimeout(function(){
        self.setState({ filter: '' });
      }, 100 );
    }

  }

	_deleteRow(secId, rowId, rowMap) {
		rowMap[`${secId}${rowId}`].closeRow();
    this.props.removeFollow(rowId);
	}

  _renderRow = (user) => {
    return (
      <FollowCell
        key={user.id}
        user={user}
        onPress={() => this.props.navigator.push({ name: 'ChatView', users: [user] }) }
        onProfilePress={() => this.props.navigator.push({ name: 'UserView', user }) }
      />
    );
  }

  render() {

    const filterText = this.state.filter || '';
    const filterRegex = new RegExp(String(filterText), 'i');
    const filter = (user) => filterRegex.test(user.nickName);

    return (
      <View style={styles.container}>
        <S5TextInput
          placeholder={' Search...'}
          value={this.state.filter}
          autoCapitalize="none"
          onChangeText={ text => this.setState({filter: text}) }
          inputStyle={{
            paddingLeft: 10
          }}
        />

        {this.state.listViewData.filter(filter).length == 0 ? (

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FCFF' }}>
            <Text style={{ color:'#000000', fontSize: 20, textAlign: 'center', margin: 10 }}>
              {'You can search your friends, simple tap on the '}
              <S5Icon name={'search'} size={25} color={'#000000'} />
              {' icon in the top right corner.'}
            </Text>
          </View>

        ) : (

        <S5SwipeListView
          ref="listView"
          data={ this.state.listViewData.filter(filter) }
          renderRow={ this._renderRow }
          renderHiddenRow={ (data, secId, rowId, rowMap) => (
            <View style={styles.rowBack}>
              <Text>Left</Text>
              <View style={[styles.backRightBtn, styles.backRightBtnLeft]}>
                <Text style={styles.backTextWhite}>Right</Text>
              </View>
              <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={ () => this._deleteRow(secId, rowId, rowMap) }>
                <Text style={styles.backTextWhite}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          enableEmptySections={true}
          sectionKey="nickName"
          autoSection={true}
          leftOpenValue={75}
          rightOpenValue={-150}
          removeClippedSubviews={false}
        />

        )}

      </View>
    );



/*
    if( this.state.listViewData.filter(filter).length == 0 ) {
      return (
        <View style={styles.container}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FCFF' }}>
            <Text style={{ color:'#000000', fontSize: 20, textAlign: 'center', margin: 10 }}>
              {'You can search your friends, simple tap on the '}
              <S5Icon name={'search'} size={25} color={'#000000'} />
              {' icon in the top right corner.'}
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <S5TextInput
            placeholder={' Search...'}
            value={this.state.filter}
            autoCapitalize="none"
            onChangeText={ text => this.setState({filter: text}) }
            inputStyle={{
              paddingLeft: 10
            }}
          />
          <S5SwipeListView
            ref="listView"
            data={ this.state.listViewData.filter(filter) }
            renderRow={ this._renderRow }
            renderHiddenRow={ (data, secId, rowId, rowMap) => (
              <View style={styles.rowBack}>
                <Text>Left</Text>
                <View style={[styles.backRightBtn, styles.backRightBtnLeft]}>
                  <Text style={styles.backTextWhite}>Right</Text>
                </View>
                <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={ () => this._deleteRow(secId, rowId, rowMap) }>
                  <Text style={styles.backTextWhite}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
            enableEmptySections={true}
            sectionKey="nickName"
            autoSection={true}
            leftOpenValue={75}
            rightOpenValue={-150}
            removeClippedSubviews={false}
          />
        </View>
      );
    } */

  }

}



const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		flex: 1
	},
	backTextWhite: {
		color: '#FFF'
	},
	rowBack: {
		alignItems: 'center',
		backgroundColor: '#DDD',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingLeft: 15,
	},
	backRightBtn: {
		alignItems: 'center',
		bottom: 0,
		justifyContent: 'center',
		position: 'absolute',
		top: 0,
		width: 75
	},
	backRightBtnLeft: {
		backgroundColor: 'blue',
		right: 75
	},
	backRightBtnRight: {
		backgroundColor: 'red',
		right: 0
	},
});

function select(store) {
  return {
    follows: store.follows,
  };
}

function actions(dispatch) {
  return {
    loadFollows: () => dispatch(loadFollows()), // @ TODO not used !!
    removeFollow: (rowId) => dispatch(removeFollow(rowId)),
  };
}

module.exports = connect(select, actions)(FollowsMain);
