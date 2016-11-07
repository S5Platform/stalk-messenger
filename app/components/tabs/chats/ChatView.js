/**
 *
 * @flow
 */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Alert
} from 'react-native';

import { connect } from 'react-redux';
import { switchTab, loadMessages, setLatestMessage, uploadImage, createChat, MESSAGE_SIZE } from 's5-action';
import { S5Header, S5Alert, S5Drawer, S5Icon, S5ChatBox } from 's5-components';

import ControlPanel from './ControlPanel';

import SocketIO from 'react-native-socketio';

import { leaveChat } from 's5-action';

class ChatView extends Component {

  static propTypes = {
    chat: React.PropTypes.object,
    user: React.PropTypes.object.isRequired,
    users: React.PropTypes.array,
    navigator: React.PropTypes.object.isRequired,
    setLatestMessage: React.PropTypes.func.isRequired,
    loadMessages: React.PropTypes.func.isRequired,
    switchTab: React.PropTypes.func.isRequired,
    createChat: React.PropTypes.func.isRequired,
  };

  constructor(props) {

    super(props);

    this.state = {
      messages:     [],
      loadEarlier:  false,
      lastLoadedAt: null,
      isTyping:     null,
      connected:    false,
      node:         {},
    };
  }

  componentWillMount() {

    var chat = {};

    // 1명과 1:1 시도인 경우, 이미 Chat List 에 있는지 확인해야 함 !
    if(!this.props.chat && this.props.users && this.props.users.length == 1) {
      chat = { users: this.props.users };

      for(var i=0, l = this.props.chats.list.length; i < l; i++){
        var obj = this.props.chats.list[i];
        if(obj.uid && obj.uid == this.props.users[0].id){
          chat = obj;
          break;
        }
      }

    } else {
      chat = this.props.chat ? this.props.chat : { users: this.props.users };
    }

    this.setState({ chat });
  }

  componentDidMount() {

    let channelId = this.state.chat.channelId;

    console.log('******** CHAT DATA *********** \n',this.state.chat);

    if(channelId) {

      // Load Messages from session-server
      this.props.loadMessages(this.state.chat).then(
        (result) => {

          if(result.messages.length > 0) {

            this.setState({
              messages: result.messages,
              loadEarlier: result.messages.length == MESSAGE_SIZE ? true : false,
              lastLoadedAt: result.messages[ result.messages.length - 1 ].createdAt,
            });

            var latest = result.messages[0].text;
            if(result.messages[0].image){
              latest = '@image';
            }

            // set latest message !
            this.props.setLatestMessage(channelId, latest);

          }

          this.connectChannelSocket(result.node, channelId);

        },
        (error) => {
          console.warn(error);
          this.refs['alert'].alert('error', 'Error', 'an error occured, please try again late');
        }
      );
    }

  }

  connectChannelSocket = (node, channelId, callback) => {

    this.setState({
      node: node
    });

    this.disconnectChannelSocket();

    let self = this;

    console.log('** Connect Channel Server ** \n', node.url, {
      nsp: '/channel',
      forceWebsockets: true,
      forceNew: true,
      connectParams: {
        A: node.app,
        S: node.name,
        C: channelId,
        U: this.props.user.id,
        // D: Device ID !! ???
      }
    });

    this.socket = new SocketIO(node.url, {
      nsp: '/channel',
      forceWebsockets: true,
      forceNew: true,
      connectParams: {
        A: node.app,
        S: node.name,
        C: channelId,
        U: this.props.user.id,
        // D: Device ID !! ???
      }
    });

    this.socket.on('connect', () => { // SOCKET CONNECTION EVENT
      this.setState({ connected: true }, () => {
        if(callback) callback();
      });
    });

    this.socket.on('error', () => { // SOCKET CONNECTION EVENT
      this.setState({ connected: false });
    });

    this.socket.on('connect_error', (err) => { // XPUSH CONNECT ERROR EVENT
      console.warn(err);
    });

    this.socket.on('_event', (data) => { // XPUSH EVENT
      if(data[0].event == 'DISCONNECT') {
        console.log('[EVENT] "'+ data[0].U +'" was disconnected // @ TODO must implement ! ', data[0]);
      } else if(data[0].event == 'CONNECTION') {
        if( data[0].U != self.props.user.id) {
          console.log('[EVENT] "'+ data[0].U +'" was connected // @ TODO must implement !  ', data[0]);
        }
      }
    });

    this.socket.on('message', (message) => { // MESSAGED RECEIVED
      console.log('[MESSAGE] ', message);
      self.setState((previousState) => {

        // set latest message !
        var latest = message[0].text;
        if(message[0].image){
          latest = '@image';
        }
        self.props.setLatestMessage(self.state.chat.channelId, latest);

        return { messages: this.refs.ChatBox.append(previousState.messages, message) };
      });
    });

    //this.socket.onAny((event) => {
    //  console.log('[LOGGING]', event);
    //});

    this.socket.on('sent', (data) => { // after sent a messeage.
      console.log('[SENT] // @ TODO must implement !! ', data);
    });

    this.socket.connect();

  }

  componentWillUnmount() {
    this.disconnectChannelSocket();
  }

  disconnectChannelSocket = () => {
      if(this.socket) {
        console.log('DISCONNECT');
        this.socket.disconnect();
      }
  }

  _closeControlPanel = (action) => {
    var self = this;
    this._drawer.close();
    if( action ){
      if( action.openSelectUserView){
        this.props.navigator.push({name: 'SelectUserView', chat:this.state.chat, callback:this._addUserCallback});

      } else if( action.leaveChat && self.state.chat && self.state.chat.id ){

        Alert.alert(
          'Alert Title',
          'Do you want leave?',
          [
            {text: 'Leave', onPress: () => self.leaveChat(self.state.chat.id)},
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
          ]
        )
      }
    }
  }

  createChat = (callback) => {
    if( this.socket ){
      callback();
      return;
    }

    this.props.createChat(this.state.chat.users).then(
      (result) => {

        console.log('CREATED CHAT!!!', result);

        this.setState({ chat: result.chat });
        var self = this;
        this.connectChannelSocket(result.node, result.chat.channelId, () => {
          callback();
        });
      },
      (error)=> {
        console.log('ERROR....>', error);
        // TODO Channel 데이터는 생성했지만, Channel 서버를 할당받지 못한 상태 (Channel 서버가 실행되어 있지 않은 경우) 처리 필요.
        this.refs['alert'].alert('error', 'Error', 'an error occured, please try again late');
      });
  }

  leaveChat = (chatId) => {
    this.props.leaveChat(chatId).then(() => {
      this.props.navigator.pop();
    });
  }

  _addUserCallback = (type, data) => {
    if( type =='A' ){
      this.setState( {chat:data} );
      this.props.navigator.pop();
    } else if ( type =='C' ){
      // 신규생성
      this.props.navigator.pop();
      this.props.navigator.replace({ name: 'ChatView', users:data });
    }
  }

  _onLoadEarlier = () => {

    // Load Message earlier messages from session-server.
    this.props.loadMessages(this.state.chat, this.state.lastLoadedAt).then( (result) => {

      if(result.messages.length > 0) {
        this.setState((previousState) => {

          return {
            messages: this.refs.ChatBox.prepend(previousState.messages, result.messages),
            loadEarlier: result.messages.length == MESSAGE_SIZE ? true : false,
            lastLoadedAt: result.messages[ result.messages.length - 1 ].createdAt,
          };
        });
      }

    });
  }

  _onSend = (messages = []) => {
    if ( (this.socket && this.state.connected) || !this.state.chat.channelId ){
      this.sendMesage(messages[0]);
    }
  }

  sendMesage = (message) => {

    console.log(message);

    message.createdAt = Date.now();

    if( this.socket ) {
      this.socket.emit('send', {NM:'message', DT: message});
    } else {
      var self = this;
      this.createChat(function(){
       self.socket.emit('send', {NM:'message', DT: message });
      });
    }

  }

  _onSelectImage = (response) => {

    var self = this;

    self.createChat(function(){
      var data = {
        C : self.state.chat.channelId,
        U : self.props.user.id,
        imgBase64 : response.data
      };

      uploadImage(data, function(err, result){

        if( self.state.connected ) {
          var message = {
            image: result,
            user: { _id: self.props.user.id },
            createdAt: new Date(),
            _id: 'temp-id-' + Math.round(Math.random() * 1000000)
          };

          self.sendMesage(message);

        }

      });
    });

  }

  render() {
    return (
      <View style={styles.container}>
      <S5Drawer
        type="overlay"
        content={<ControlPanel closeDrawer={this._closeControlPanel} users={this.state.chat.users} navigator={this.props.navigator} />}
        ref={(ref) => this._drawer = ref}
        tapToClose={true}
        openDrawerOffset={0.2} // 20% gap on the right side of drawer
        side="right"
        panCloseMask={0.2}
        closedDrawerOffset={-3}
        styles={{main: {shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 15}}}
        tweenHandler={(ratio) => ({
          main: { opacity:(2-ratio)/2 }
        })}
        >

          <S5Header
            title="Chat"
            style={{backgroundColor: '#224488'}}
            leftItem={[ {icon: 'arrow-back'} ]}
            rightItem={[ {icon: 'menu'} ]}
            onPress={ (name) => {
              if( name == 'menu') return this._drawer.open();
              this.props.switchTab();
              return this.props.navigator.pop();
            }}
          />

          <S5ChatBox
            ref={ 'ChatBox' }
            user={ this.props.user }
            messages={ this.state.messages }
            onSend={ this._onSend }
            loadEarlier={ this.state.loadEarlier }
            onLoadEarlier={ this._onLoadEarlier }
            onSelectImage={ this._onSelectImage }

            enabled={ this.state.connected || !this.state.chat.channelId }
            reconnecting={ this.socket && this.socket.isConnected && !this.state.connected }
          />
        </S5Drawer>

        <S5Alert ref={'alert'} />

      </View>
    );
  }
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		flex: 1
	},
});

function select(store) {
  return {
    user: store.user,
    chats: store.chats,
  };
}

function actions(dispatch) {
  return {
    switchTab: () => dispatch(switchTab(1)), // to 'chats' tab
    loadMessages: (chat, date) => dispatch(loadMessages(chat, date)),
    setLatestMessage: (channelId, text) =>  dispatch(setLatestMessage(channelId, text)),
    createChat: (users) => dispatch(createChat(users)),
    leaveChat: (chatId) => dispatch(leaveChat(chatId))
  };
}

module.exports = connect(select, actions)(ChatView);
