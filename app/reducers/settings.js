import { UPDATE_SETTINGS, RESET_SETTINGS. } from 's5-action';

const initialState = {
	preview:false,
	imagePreview:false,
};

function settings(state = initialState, action) {

	if (action.type === UPDATE_SETTINGS) {
		state[action.key] = action.value;
		return { ...state };
	} else if (action.type === RESET_SETTINGS || action.type === LOGGED_OUT ){
		return initialState;
	}

	return state;

}

module.exports = settings;