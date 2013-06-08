var GameModel = Backbone.Model.extend({
  urlRoot : Y.Conf.get("api.url.games"),

  initialize : function() {
    this.updated_at = new Date();
  },

  setSets : function(s) {
    this.sets = s;
  },

  defaults : {
    owner: "",
    sport : "tennis",
    status : "",
    dates : {
      end : "",
      start : ""
    },   
    location : {
      country : "",
      city : ""
    },
    teams : [ {
      points : "",
      players : [ {
        name : ""
      } ]
    }, {
      points : "",
      players : [ {
        name : ""
      } ]
    } ],
    infos : {
      type : "singles",
      subtype : "A",
      sets : "0/0",
      score : "0/0",
      court : "",
      surface : "",
      tour : ""
    }
  },

  sync : function(method, model, options) {
    var that = this;
    var team1_json = '';
    var team2_json = '';
    
    // if player exists / not exists
    if (this.get('team1_id')) {
      team1_json = {
        id : this.get('team1_id')
      };
    } else {
      team1_json = {
        name : this.get('team1'),
        rank : this.get('rank1')
      };
    }

    if (this.get('team2_id')) {
      team2_json = {
        id : this.get('team2_id')
      };
    } else {
      team2_json = {
        name : this.get('team2'),
        rank : this.get('rank2')
      };
    }
    
    var object = {
      teams : [ {
        id : null,
        players : [ team1_json ]
      }, {
        id : null,
        players : [ team2_json ]
      } ]
      , infos : {}
      , location : {}
    };
	 
    object.infos.type = "singles";	
     if (this.get('city')) 
       object.location.city = this.get('city');
     if (this.get('start'))
       object.dates.start = this.get('start');
     if (this.get('end'))
       object.dates.end = this.get('end');
     if (this.get('status'))
       object.status = this.get('status');
    ['subtype', 'sets', 'score', 'court', 'surface',
     'tour', 'country', 'startTeam'].forEach(function (k) {
      if (this.get(k))
        object.infos[k] = this.get(k);
    }, this);
    if (Y.Geolocation.longitude!==null && Y.Geolocation.latitude!==null)      
      object.location.pos = [Y.Geolocation.longitude, Y.Geolocation.latitude];

    if (method === 'create' && options.playerid !== undefined) {
      return Backbone.ajax({
        dataType : 'json',
        url : Y.Conf.get("api.url.games") + '?playerid=' + options.playerid + '&token=' + options.token,
        type : 'POST',
        data : object,
        success : function(data) {
          // FIXME : on redirige sur //si offline id , si online sid  
          that.set(data);         
          if (options && options.success)
            options.success(data);
        },
        error: function (message) {
          if (options && options.error)
            options.error(message);
        }
      });
    } else if (method === 'update' && options.playerid !== undefined) {
      
      console.log('on met à jour game avec ', object); 
		
      return Backbone.ajax({
        dataType : 'json',
        url : Y.Conf.get("api.url.games") + this.get('id') + '/?playerid=' + options.playerid + '&token=' + options.token,
        type : 'POST',
        data : object,
        success: function (data) {
          that.set(data);
          if (options && options.success)
            options.success(data);
        },
        error: function (message) {
          if (options && options.error)
            options.error(message);
        }
      });
    } else {
      model.url = Y.Conf.get("api.url.games")+this.id;
      return Backbone.sync(method, model, options);
    }
  },

  getPlayersNamesByTeam: function (teamIndex) {
    var team = _.isArray(this.get("teams")) ? this.get("teams")[teamIndex] : null;
    if (!team)
      return "";
    return _.reduce(team.players, function (result, player) {
      return result ? result + ", " + player.name : player.name;
    }, "");
  },

  // @return 0,1, -1 if draw / null if error or non defined
  getIndexWinningTeam: function () {
    var score = this.get("infos").score; 
    if (typeof score !== "string")
      return null;
    var scoreDetails = score.split("/");
    if (scoreDetails.length !== 2)
      return null;
    var scoreTeamA = parseInt(scoreDetails[0], 10);
    var scoreTeamB = parseInt(scoreDetails[1], 10)
    if (scoreTeamA == NaN || scoreTeamB == NaN)
      return null;
    if (scoreTeamA == scoreTeamB)
      return -1; // draw
    if (scoreTeamA < scoreTeamB)
      return 1; // team B is winning
    return 0; // team A is winning
  },

  isMine: function () {
    return this.get('owner') === Y.User.getPlayer().get('id');
  },

  // @return bool
  isFinished: function () {
    switch (this.get("status")) {
      case "created":
      case "ongoing":
        return false;
      default:
        return true;
    }
  }
});