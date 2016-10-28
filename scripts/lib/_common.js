
import Parse from 'parse/node';

exports.getUserId = function (username) {
  return new Promise( (resolve, reject) => {
    new Parse.Query(Parse.User)
      .equalTo("username", username)
      .first()
      .then(
        (currentUser) => {

          if(currentUser) {
            resolve(currentUser.id);
          } else {
            console.log('['+username + '] was not existed.');
            reject('');
          }

        },
        (err) => { console.error(error); reject(err); }
      );
  });
};

exports.notNullValue = function(value, fakerValue) {
  return value? value: fakerValue;
};
