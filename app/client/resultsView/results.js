var getScore = function(caption) {
  return caption.upvoteCount - caption.downvoteCount;
};

var sortCaptions = function(a, b) {
  return getScore(b) - getScore(a);
};

var getWinners = function() {
  var captions = Captions.find({}).fetch();
  console.log('before sort', captions);
  captions.sort(sortCaptions);
  console.log('after sort', captions);
  return captions;
};

var getName = function(playerID) {
  var player = Players.findOne({playerID:playerID});
  return player.name;
};

Template.results.helpers({
  winner: function() {
    var winner = getWinners()[0];
    return {
      name: getName(winner.playerID),
      text: winner.text,
      score: getScore(winner)
    };
  },
  runnersUp: function() {
    var runnersUp = getWinners().slice(1, 5);
    for (var i = 0; i < runnersUp.length; i++) {
      runnersUp[i].name = getName(runnersUp[i].playerID);
    }
    return runnersUp;
  },
  photoPath: function() {
    var photo = Games.find({}).fetch();
    var photoID = photo[0].photoID;
    var photoPath = Photos.find({photoID:photoID}).fetch();
    return '/img/' + photoPath[0].path;
  }
});

Template.runnerUp.helpers({
  score: function() {
    var score = this.upvoteCount - this.downvoteCount;
    if (isNaN(score) || score < 0) {
      return 0;
    } else {
      return score;
    }
  }
});
