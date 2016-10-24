/**
 *
 * @flow
 */
'use strict';

import React, {
  Component,
  PropTypes
} from 'react';

import ReactNative, {
  ListView,
  Text,
  View,
  StyleSheet,
  NativeModules
} from 'react-native';

var UIManager = NativeModules.UIManager;

import S5SwipeRow from './S5SwipeRow';
import S5SectionList from './S5SectionList';

/**
 * f that renders SwipeRows.
 */
export default class S5SwipeListView extends Component {

  constructor(props){
    super(props);
    this._rows = {};
    this.openCellId = null;
    this.sectionData = {};

    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (prev, next) => prev !== next
      })
    };

    this.scrollToSection = this.scrollToSection.bind(this);

    this.onScroll = this.onScroll.bind(this);
    this.onScrollAnimationEnd = this.onScrollAnimationEnd.bind(this);
    this.calculateScrollToY = this.calculateScrollToY.bind(this);
    this.calculateTotalHeight = this.calculateTotalHeight.bind(this);
  }

  componentDidMount() {
    var self = this;
    // push measuring into the next tick
    setTimeout(() => {
      UIManager.measure(ReactNative.findNodeHandle(this.refs.view), (x,y,w,h) => {
        this.containerHeight = h;
      });

      if( this.sectionData && Object.keys(this.sectionData).length > 0 ){
        var firstSection = Object.keys(this.sectionData)[0];
        var tag = ReactNative.findNodeHandle(this._rows[firstSection+'0']);

        if( tag && tag > 0 ){
          UIManager.measure(tag, (x, y, w, h) => {
            self.cellHeight = h;
            self.calculateTotalHeight();
          });
        }
      }
    }, 0);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data && nextProps.data !== this.props.data) {
      this.calculateTotalHeight(nextProps.data);
    }
  }

  setScrollEnabled(enable) {
    this._listView.setNativeProps({scrollEnabled: enable});
  }

  safeCloseOpenRow() {
    // if the openCellId is stale due to deleting a row this could be undefined
    if (this._rows[this.openCellId]) {
      this._rows[this.openCellId].closeRow();
    }
  }

  onRowOpen(secId, rowId, rowMap) {
    const cellIdentifier = `${secId}${rowId}`;
    if (this.openCellId && this.openCellId !== cellIdentifier) {
      this.safeCloseOpenRow();
    }
    this.openCellId = cellIdentifier;
    this.props.onRowOpen && this.props.onRowOpen(secId, rowId, rowMap);
  }

  onRowPress(id) {
    if (this.openCellId) {
      if (this.props.closeOnRowPress) {
        this.safeCloseOpenRow();
        this.openCellId = null;
      }
    }
  }

  onScroll(e) {

    var offsetY = e.nativeEvent.contentOffset.y;
    if (this.props.updateScrollState) {
      this.setState({
        offsetY
      });
    }

    if (this.openCellId) {
      if (this.props.closeOnScroll) {
        this.safeCloseOpenRow();
        this.openCellId = null;
      }
    }
    this.props.onScroll && this.props.onScroll(e);
  }

  onScrollAnimationEnd(e) {

    if (this.props.updateScrollState) {
      this.setState({
        offsetY: e.nativeEvent.contentOffset.y
      });
    }
  }

  setRefs(ref) {
    this._listView = ref;
    this.props.listViewRef && this.props.listViewRef(ref);
  }

  renderRow(rowData, secId, rowId, rowMap) {
    const Component = this.props.renderRow(rowData, secId, rowId, rowMap);
    if (!this.props.renderHiddenRow) {
      return React.cloneElement(
        Component,
        {
          ...Component.props,
          ref: row => this._rows[`${secId}${rowId}`] = row,
          onRowOpen: _ => this.onRowOpen(secId, rowId, this._rows),
          onRowClose: _ => this.props.onRowClose && this.props.onRowClose(secId, rowId, this._rows),
          onRowPress: _ => this.onRowPress(`${secId}${rowId}`),
          setScrollEnabled: enable => this.setScrollEnabled(enable)
        }
      );
    } else {

      return (
        <S5SwipeRow
          ref={row => this._rows[`${secId}${rowId}`] = row}
          onRowOpen={ _ => this.onRowOpen(secId, rowId, this._rows) }
          onRowClose={ _ => this.props.onRowClose && this.props.onRowClose(secId, rowId, this._rows) }
          onRowPress={ _ => this.onRowPress(`${secId}${rowId}`) }
          setScrollEnabled={ (enable) => this.setScrollEnabled(enable) }
          leftOpenValue={this.props.leftOpenValue}
          rightOpenValue={this.props.rightOpenValue}
          closeOnRowPress={this.props.closeOnRowPress}
          disableLeftSwipe={this.props.disableLeftSwipe}
          disableRightSwipe={this.props.disableRightSwipe}
          recalculateHiddenLayout={this.props.recalculateHiddenLayout}
          style={this.props.swipeRowStyle}
        >
          {this.props.renderHiddenRow(rowData, secId, rowId, this._rows)}
          {this.props.renderRow(rowData, secId, rowId, this._rows)}
        </S5SwipeRow>
      );
    }
  }

  scrollToSection(section) {
    var y = 0;
    this.safeCloseOpenRow();

    if (!this.props.useDynamicHeights) {
      y = this.calculateScrollToY(section);
      if( y > 0 ){
        this._listView.scrollTo({ x:0, y, animated: true });
      }
    } else {
      var tag = ReactNative.findNodeHandle(this._rows[section+'0']);

      if( tag && tag > 0 ){
        UIManager.measure(tag, (x, y, w, h) => {
          if( y > 0 ){
            this._listView.scrollTo({ x:0, y, animated: true });
          }
        });
      } else {
        y =  this.calculateScrollToY(section);
        if( y > 0 ){
          this._listView.scrollTo({ x:0, y, animated: true });
        }
      }
    }
  }

  calculateScrollToY(section){
    var y = 0;
    var headerHeight = this.props.headerHeight || 0;
    y += headerHeight;

    var cellHeight = this.props.cellHeight || this.cellHeight;
    var sectionHeaderHeight = this.props.sectionHeaderHeight || 0;
    var keys = Object.keys(this.sectionData);
    var index = keys.indexOf(section);

    var numcells = 0;
    for (var i = 0; i < index; i++) {
      numcells += this.sectionData[keys[i]].length;
    }

    sectionHeaderHeight = index * sectionHeaderHeight;
    y += numcells * cellHeight + sectionHeaderHeight;
    var maxY = this.totalHeight - this.containerHeight + headerHeight;

    if( this.totalHeight < this.containerHeight ){
      y = -1;
    } else if ( y > maxY ) {
      y = maxY;
    }

    return y;
  }

  calculateTotalHeight() {
    var data = this.sectionData || this.props.data;
    if ( Array.isArray(data) ) {
      return;
    }

    var cellHeight =  this.props.cellHeight || this.cellHeight;
    this.sectionItemCount = {};
    this.totalHeight = Object.keys(data)
      .reduce((carry, key) => {
        var itemCount = data[key].length;
        carry += itemCount * cellHeight;
        carry += (this.props.sectionHeaderHeight || 0);

        this.sectionItemCount[key] = itemCount;
        return carry;
      }, 0);
  }

  render() {
    var data = this.props.data;
    var sectionList;
    var dataSource;

    if( Array.isArray(data) && this.props.autoSection && this.props.sectionKey ){
      var sectionData = {};
      for( var inx = 0 ;inx<data.length;inx++){

        var firstCh = data[inx][this.props.sectionKey].substring(0,1).toUpperCase();
        if( !sectionData[firstCh] ){
          sectionData[firstCh] = [];
        }
        sectionData[firstCh].push( data[inx] );
      }

      data = sectionData;
      this.sectionData = sectionData;
    }

    if (Array.isArray(data)) {
      dataSource = this.state.dataSource.cloneWithRows(data);
    } else {
      sectionList = !this.props.hideSectionList ?
        <S5SectionList
          style={this.props.sectionListStyle}
          onSectionSelect={this.scrollToSection}
          sections={Object.keys(data)}
          data={data}
          getSectionListTitle={this.props.getSectionListTitle}
          component={this.props.sectionListItem}
        /> :
        null;

      dataSource = this.state.dataSource.cloneWithRowsAndSections(data);
    }

    return (
      <View ref="view" style={[styles.container, this.props.style]}>
        <ListView
          {...this.props}
          dataSource={dataSource}
          ref={ c => this.setRefs(c) }
          onScroll={ e => this.onScroll(e) }
          onScrollAnimationEnd={ e => this.onScrollAnimationEnd(e) }
          renderRow={(rowData, secId, rowId) => this.renderRow(rowData, secId, rowId, this._rows)}
        />
        {sectionList}
      </View>
    )
  }

}

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

var stylesheetProp = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.object,
]);

S5SwipeListView.propTypes = {
  /**
   * How to render a row. Should return a valid React Element.
   */
  renderRow: PropTypes.func.isRequired,
  /**
   * How to render a hidden row (renders behind the row). Should return a valid React Element.
   * This is required unless renderRow is passing a SwipeRow.
   */
  renderHiddenRow: PropTypes.func,
  /**
   * TranslateX value for opening the row to the left (positive number)
   */
  leftOpenValue: PropTypes.number,
  /**
   * TranslateX value for opening the row to the right (negative number)
   */
  rightOpenValue: PropTypes.number,
  /**
   * Should open rows be closed when the listView begins scrolling
   */
  closeOnScroll: PropTypes.bool,
  /**
   * Should open rows be closed when a row is pressed
   */
  closeOnRowPress: PropTypes.bool,
  /**
   * Disable ability to swipe rows left
   */
  disableLeftSwipe: PropTypes.bool,
  /**
   * Disable ability to swipe rows right
   */
  disableRightSwipe: PropTypes.bool,
  /**
   * Enable hidden row onLayout calculations to run always.
   *
   * By default, hidden row size calculations are only done on the first onLayout event
   * for performance reasons.
   * Passing ```true``` here will cause calculations to run on every onLayout event.
   * You may want to do this if your rows' sizes can change.
   * One case is a S5SwipeListView with rows of different heights and an options to delete rows.
   */
  recalculateHiddenLayout: PropTypes.bool,
  /**
   * Called when a swipe row is animating open
   */
  onRowOpen: PropTypes.func,
  /**
   * Called when a swipe row is animating closed
   */
  onRowClose: PropTypes.func,
  /**
   * Styles for the parent wrapper View of the SwipeRow
   */
  swipeRowStyle: PropTypes.object,
  /**
   * Called when the ListView ref is set and passes a ref to the ListView
   * e.g. listViewRef={ ref => this._swipeListViewRef = ref }
   */
  listViewRef: PropTypes.func,

  /**
   * Styles to pass to the container
   */
  style: stylesheetProp,

  /**
   * Styles to pass to the section list container
   */
  sectionListStyle: stylesheetProp
}

S5SwipeListView.defaultProps = {
  leftOpenValue: 0,
  rightOpenValue: 0,
  closeOnScroll: true,
  closeOnRowPress: true,
  disableLeftSwipe: false,
  disableRightSwipe: false,
  recalculateHiddenLayout: false
}
