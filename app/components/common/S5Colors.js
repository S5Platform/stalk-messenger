/*
 * @flow
 */

'use strict';

const COLORS = {
  'PRIMARY_TEXT': 'rgba(0, 0, 0, 1.0)',
  'SECONDARY_TEXT': 'rgba(0, 0, 0, 0.54)',
  'HIGHLIGHT_TEXT': 'rgba(255, 255, 255, 0.8)',
  'DISABLE_TEXT': 'rgba(0, 0, 0, 0.38)',
  'HINT_TEXT': 'rgba(0, 0, 0, 0.38)',
  'PRIMARY': '#3E50B4',
  'PRIMARY_DARK': '#303F9F',
  'ACCENT': '#FF3F80',
  'BACKGROUND': '#F5FCFF',
};

function colorForProfile(str, count = 1) {
  if( !str || str == '' ){
    str = "A";
  }
  let index = str.charCodeAt(0);
  const hue = Math.round(460 * index / (count+10));

  return `hsl(${hue}, 74%, 65%)`;
}

module.exports = {
  primaryText: COLORS.PRIMARY_TEXT,
  secondaryText: COLORS.SECONDARY_TEXT,
  highlightText: COLORS.HIGHLIGHT_TEXT,
  disableText: COLORS.DISABLE_TEXT,
  hintText: COLORS.HINT_TEXT,
  primary: COLORS.PRIMARY,
  primaryDark: COLORS.PRIMARY_DARK,
  accent: COLORS.ACCENT,
  background: COLORS.BACKGROUND,
  colorForProfile,
};
