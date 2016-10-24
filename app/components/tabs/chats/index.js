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

import ChatCell from './ChatCell';

import { loadChats, leaveChat } from 's5-action';
import { S5Header, S5SwipeListView } from 's5-components';
import { connect } from 'react-redux';

class ChatsMain extends Component {

  static propTypes = {
    chats: React.PropTypes.object.isRequired,
    messages: React.PropTypes.object.isRequired,
    user: React.PropTypes.object,
    navigator: React.PropTypes.object.isRequired,
    leaveChat: React.PropTypes.func.isRequired,
  };

  state = {
    listViewData: []
  };

  componentDidMount(){
    this.setState({
      listViewData: this.props.chats.list
    });
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.chats.list !== this.props.chats.list) {
      this.setState({
        listViewData: nextProps.chats.list
      });
    }
  }

  _deleteRow(secId, rowId, rowMap, chatId) {

		rowMap[`${secId}${rowId}`].closeRow();
    this.props.leaveChat(chatId).then(() => {
      // TODO do something after deleting.
    });
  }

  _renderRow = (chat) => {
    return (
      <ChatCell
        key={chat.id}
        chat={chat}
        message={this.props.messages.latest[chat.channelId]}
        onPress={() => this.props.navigator.push({name: 'ChatView', chat}) }
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <S5SwipeListView
          ref="listView"
          data={this.state.listViewData}
          renderRow={ this._renderRow }
          renderHiddenRow={ (data, secId, rowId, rowMap) => (
            <View style={styles.rowBack}>
              <View style={[styles.backRightBtn, styles.backRightBtnLeft]}>
                <Text style={styles.backTextWhite}>Mark as Read</Text>
              </View>
              <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={ () => this._deleteRow(secId, rowId, rowMap, data.id) }>
                <Text style={styles.backTextWhite}>Leave</Text>
              </TouchableOpacity>
            </View>
          ) }
          enableEmptySections={true}
          rightOpenValue={-150}
          removeClippedSubviews={false}
          />
      </View>
	 );
  }

}


const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		flex: 1
	},
	standalone: {
		marginTop: 30,
		marginBottom: 30,
	},
	standaloneRowFront: {
		alignItems: 'center',
		backgroundColor: '#CCC',
		justifyContent: 'center',
		height: 50,
	},
	standaloneRowBack: {
		alignItems: 'center',
		backgroundColor: '#8BC645',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 15
	},
	backTextWhite: {
		color: '#FFF'
	},
	rowFront: {
		alignItems: 'center',
		backgroundColor: '#CCC',
		borderBottomColor: 'black',
		borderBottomWidth: 1,
		justifyContent: 'center',
		height: 50,
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
	controls: {
		alignItems: 'center',
		marginBottom: 30
	},
	switchContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginBottom: 5
	},
	switch: {
		alignItems: 'center',
		borderWidth: 1,
		borderColor: 'black',
		paddingVertical: 10,
		width: 100,
	}
});

function select(store) {
  return {
    user: store.user,
    chats: store.chats,
    messages: store.messages,
  };
}

function actions(dispatch) {
  return {
    loadChats: () => dispatch(loadChats()), // @ TODO not used !!
    leaveChat: (chatId) => dispatch(leaveChat(chatId)),
  };
}

module.exports = connect(select, actions)(ChatsMain);
