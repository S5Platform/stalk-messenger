
function readable (object) {

  var result = null;
  try {
    result = object.toJSON();
  } catch (e) {
    return object;
  }
  return result;

}

exports.success = function(object) {

  console.info('\n------------------ SUCCESS');
  console.info(readable(object));
  console.info('------------------ SUCCESS\n');

};

exports.error = function(object) {

  console.info('\n------------------ ERROR');
  console.info(readable(object));
  console.info('------------------ ERROR\n');

};
