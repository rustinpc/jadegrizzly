// prevent jshint errors on global variables
/* global Players: true, Photos: true, Captions: true, Games: true */

Players = new Meteor.Collection('players');
Photos = new Meteor.Collection('photos');
Captions = new Meteor.Collection('captions');
Games = new Meteor.Collection('games');

var playerID = '';

//generate playerID
(function() {
  var count = 10;
  while (count > 0) {
    playerID += Math.floor(Math.random() * 10);
    count -= 1;
  }
})();

Session.set('currentPlayerID', playerID);

Template.input.helpers({
  photos: function() {
    var game = Games.findOne();
    if (game) {
      var photoID = game.photoID;
      return Photos.findOne({photoID: photoID});
    }
    return null;
  }
});

Template.input.events({
  'submit .new-caption': function(event) {
    var caption = event.target.caption.value;
    var name = event.target.name.value;

    var playerObj = {
      playerID: playerID,
      name: name
    };

    //insert player into the Player collection
    Meteor.call('playersInsert', playerObj);

    //insert new caption into the Caption collection
    Meteor.call('captionsInsert', caption, playerID);

    //reset caption input field
    event.target.caption.value = '';
    event.target.name.value = '';

    //disable ability to resubmit
    $('input').prop('disabled', true);
    $('textarea').prop('disabled', true);
    $('button').prop('disabled', true);
    $('button').html('Please wait');
    $('div.input').append('<p class="wait">Waiting for all submissions...</p>');

    // Prevent default form submit
    return false;
  }
});
