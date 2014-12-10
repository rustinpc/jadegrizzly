/**
 * Game helper & events
 */

Template.game.helpers({
  newGame: function() {
    return Games.findOne(Session.get('currentGameId'));
  },

  events: function() {
    var q = Games.findOne(Session.get('currentGameId'));
    return q.featList;
  }
});

Template.game.events({
  'click .navigate-photos': function(evt, template){
    Router.go('/photos');
  },
  'click .navigate-events': function(evt, template){
    Router.go('/game');
  },
  'click .go-back': function(evt, template){
    Router.go('/create');
  },

  'click .logout': function(evt, template){
    console.log('Logging user out...');
    Meteor.logout(function(err) {
      Router.go('/');
    });
  }
});

/**
 * List item events.
 */

// Created on game render.
Template.gameEvent.created = function() {
  this.glyphIcon = new ReactiveVar;
  this.glyphIcon.set('glyphicon-pushpin');
};

Template.gameEvent.helpers({
  checker: function() {
    return Template.instance().glyphIcon.get();
  }
});

Template.gameEvent.events({
  'click a.event-name': function (evt, template) {
    var cameraOptions = {
      width: 800,
      height: 600
    };

    var featName = this.name;
    var glyphIcon = template.glyphIcon.get();

    MeteorCamera.getPicture(cameraOptions, function (error, data) {
      if(error) { console.log(error); }
      // INSERT URL TO DB
      Session.set('eventImage', data);
      var gameId = Session.get('currentGameId');
      var userId = Meteor.userId();

      // TODO Check if the user already has a photo for this featName, gameId and playerId
      // The unique key is featName, gameId + playerId

      Images.insert({
                      userId: userId,
                      username: Meteor.user().username,
                      gameId: gameId,
                      featName: featName,
                      "photoURL":data, // I don't know why photoURL is in quotes. I don't even know why it's called photoURL
                      voteCount: 0,
                      downVotes: [],
                      upVotes: []
                    });

      template.glyphIcon.set('glyphicon-ok');
    });
  }
});
