import { UPDATE_SETTINGS } from 's5-action';

const initialState = {
  settings: {}
};

function settings(state = initialState, action) {

  if (action.type === UPDATE_SETTINGS) {
    let newData = [...state.settings];
    newData[action.key] = action.value;
    return {settings:newData};
  }

}

module.exports = settings;