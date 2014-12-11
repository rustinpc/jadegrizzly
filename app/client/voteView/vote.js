/* global Players: true, Photos: true, Captions: true, Games: true */
Players = new Meteor.Collection('players');
Photos = new Meteor.Collection('photos');
Captions = new Meteor.Collection('captions');
Games = new Meteor.Collection('games');

Session.set('playerID', '2k3j4v5n6n');
/**
 * Photo View Helpers  
 */

Template.vote.helpers({
  captions: function() {
    return Captions.find({});
  },
  getImage: function() {
    // console.log('getImage');
    var picId = Games.find({}).fetch();
    return Photos.findOne({photoID: picId[0].photoID});
  },
  state: function() {
    var gameState = Games.find({});
    return gameState.stateID;
  }
});

Template.vote.events({
  'change #gameState': function(evt, template) {
    var statePath = evt.target.gameState.value;
    Router.go('/' + statePath);
  }
});

var hasUpVoted = function(voterId, captionId) {
  var query = {'_id':captionId, 'upvoteUsers': { $in: [ voterId ] } };
  var voteCheck = Captions.findOne(query);
  return (voteCheck !== undefined);
};

var hasDownVoted = function(voterId, captionId) {
  var query = {'_id':captionId, 'downvoteUsers': { $in: [ voterId ] } };
  var voteCheck = Captions.findOne(query);
  return (voteCheck !== undefined);
};

var ownCaptionCheck = function(captionId) {
  var userId = Session.get('playerID');
  var caption = Captions.findOne({_id: captionId});

  return userId === caption.playerID;
};

/**
 * Helpers for each Caption
 */

 Template.onecaption.helpers({
  upStyle: function() {
    var userId = Session.get('playerID');
    return hasUpVoted(userId, this._id);
  },
  downStyle: function() {
    var userId = Session.get('playerID');
    return hasDownVoted(userId, this._id);
  }
});

Template.onecaption.events({
  'click div.upvote': function(evt, template) {
    var userId = Session.get('playerID');

    var ownCaption = ownCaptionCheck(this._id);
    if (!ownCaption) {
      var upVoteCheck = hasUpVoted(userId, this._id);
      var downVoteCheck = hasDownVoted(userId, this._id);
      if (downVoteCheck) {
        Meteor.call('captionsUpsert', this._id, {$inc: {'downvoteCount': -1}});
        Meteor.call('captionsUpsert', this._id, {$pull: {'downvoteUsers': userId}});
        console.log('removed downvote');
      } else if (!upVoteCheck) {
        console.log('upVoted');
        Meteor.call('captionsUpsert', this._id, {$inc: {'upvoteCount': 1}});
        Meteor.call('captionsUpsert', this._id, {$push: {'upvoteUsers': userId}});
      }
      else {
        console.log('prevented upvote');
      }
    } else {
      console.log('prevented upvote on own caption');
    }
  },

  'click div.downvote': function(evt, template) {
    var userId = Session.get('playerID');
    
    var ownCaption = ownCaptionCheck(this._id);
    console.log(ownCaption);
    if (!ownCaption) {
      var upVoteCheck = hasUpVoted(userId, this._id);
      var downVoteCheck = hasDownVoted(userId, this._id);
      if (upVoteCheck) {
        Meteor.call('captionsUpsert', this._id, {$inc: {'upvoteCount': -1}});
        Meteor.call('captionsUpsert', this._id, {$pull: {'upvoteUsers': userId}});
        console.log('removed upvote');
      } else if (!downVoteCheck) {
        console.log('downvoted');
        Meteor.call('captionsUpsert', this._id, {$inc: {'downvoteCount': 1}});
        Meteor.call('captionsUpsert', this._id, {$push: {'downvoteUsers': userId}});
      } else {
        console.log('prevented downvote');
      }
    } else {
      console.log('prevented downvote on own caption');
    }
  }
});
