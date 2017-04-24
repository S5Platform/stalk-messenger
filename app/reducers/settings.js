import { UPDATE_SETTINGS, RESET_SETTINGS, LOGGED_OUT } from 's5-action';

const initialState = {
	preview:true,
	imagePreview:true,
	imageQuality:'O',
	useNotification:undefined
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
