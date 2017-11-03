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

import { loadFollows, removeFollow, I18N } from 's5-action';
import { S5Icon, S5Header, S5SwipeListView, S5TextInput, S5Colors, S5NavBarButton } from 's5-components';
import { connect } from 'react-redux';

class FollowsMain extends Component {

  static propTypes = {
    follows:  React.PropTypes.object.isRequired,
    removeFollow: React.PropTypes.func.isRequired, // dispatch from actions
  };

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let headerRight = (
      <S5NavBarButton
        style={{ flex:1, marginRight: 15 }}
        color={S5Colors.primaryText}
        actions={[{ key: 'SearchUserView',  icon: 'person-add' }]}
        onPress={params.handlePress ? params.handlePress : () => null} />
    );
    return { headerRight };
  };

  state = {
    listViewData: this.props.follows.list || [],
    filter: '',
  };

  componentDidMount() {
    // We can only set the function after the component has been initialized
    this.props.navigation.setParams({ handlePress: this._onPressHeader });
  }

  _onPressHeader = (name) => {

    var navigate;
    if( this.props.navigation ){
      navigate = this.props.navigation.navigate;
    }
    var route = {};

    if( navigate ){
      navigate(name);
    } else {
      this.props.navigator.push({name});
    }
  }

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

  _onRowPress =(type, user) => {

    var navigate;
    if( this.props.navigation ){
      navigate = this.props.navigation.navigate;
    }
    var route = {};

    if( type == 'ChatView' ){
      route = { name: type, users: [user] };
    } else {
      route = { name: type, user:user };
    }

    if( navigate ){
      navigate(type,route);
    } else {
      this.props.navigator.push(route);
    }
  }

  _renderRow = (user) => {
    return (
      <FollowCell
        key={user.id}
        user={user}
        onPress={() => this._onRowPress('ChatView', user) }
        onProfilePress={() => this._onRowPress('UserView', user) }
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
          placeholder={I18N('friend.txtSearch')}
          value={this.state.filter}
          autoCapitalize="none"
          onChangeText={ text => this.setState({filter: text}) }
          inputStyle={{
            paddingLeft: 10
          }}
        />

        {this.state.listViewData.filter(filter).length == 0 ? (

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FCFF' }}>
            <Text style={{ color: S5Colors.accent, fontSize: 17, textAlign: 'center', margin: 10 }}>
              {I18N('friend.txtInfo1')}
              <S5Icon name={'person-add'} size={24} color={S5Colors.accent} />
              {I18N('friend.txtInfo2')}
            </Text>
          </View>

        ) : (

        <S5SwipeListView
          ref="listView"
          data={ this.state.listViewData.filter(filter) }
          renderRow={ this._renderRow }
          renderHiddenRow={ (data, secId, rowId, rowMap) => (
            <View style={styles.rowBack}>
              <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={ () => this._deleteRow(secId, rowId, rowMap) }>
                <Text style={styles.backTextWhite}>I18N('friend.btnDelete')</Text>
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

  }

}



const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		flex: 1
	},
	backTextWhite: {
		color: S5Colors.background
	},
	rowBack: {
		alignItems: 'center',
		backgroundColor: S5Colors.background,
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
