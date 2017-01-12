import { UPDATE_SETTINGS } from 's5-action';

const initialState = {
	preview:false,
	imagePreview:false,
};

function settings(state = initialState, action) {

	if (action.type === UPDATE_SETTINGS) {
		state[action.key] = action.value;
		return { ...state };
	}

	return state;

}

module.exports = settings;