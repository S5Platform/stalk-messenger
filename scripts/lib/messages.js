import Parse  from 'parse/node';
import faker  from 'faker';
import Common from './_common';
import response from './_response';

var Messages = Parse.Object.extend("Messages");
var Channels = Parse.Object.extend("Channels");


function createSampleMessage(){

}

exports.create = async function (id, object) {

  var channel = new Channels();
  channel.id = id;

  var message = new Messages();
  message.set("channel", channel);
  message.set("message", object);
  message.save()
  .then(
    (value) => { response.success(value); },
    (error) => { response.error(error); }
  );

};
