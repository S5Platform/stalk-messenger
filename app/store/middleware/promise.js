
function warn(error, next) {
  console.warn(error.message || error);
  if( error.code == 100 ) { // XMLHttpRequest failed: "Unable to connect to the Parse API"
    // TODO !!!!!
  }
  throw error; // To let the caller handle the rejection
}

module.exports = store => next => action =>
  typeof action.then === 'function'
    ? Promise.resolve(action).then(next, warn)
    : next(action);
