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
        name : "A"
      } ]
    }, {
      points : "",
      players : [ {
        name : "B"
      } ]
    } ],
    options : {
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

    var team1_json = '';
    var team2_json = '';
    
    // if player exists / not exists
    if (this.get('team1_id') === '')
      team1_json = {
        name : this.get('team1'),
        rank : this.get('rank1')
    };
    else
      team1_json = {
        id : this.get('team1_id')
    };

    if (this.get('team2_id') === '')
      team2_json = {
        name : this.get('team2'),
        rank : this.get('rank2')
    };
    else
      team2_json = {
        id : this.get('team2_id')
    };
    
	//console.log("1.1");
	
    var object = {
      teams : [ {
      id : null,
      players : [ team1_json ]
      }, {
      id : null,
      players : [ team2_json ]
      } ], 
      dates : {},      
      options : {},
      location : {}
     };

	/*
	 console.log("subtype",this.get('subtype'));
	 console.log("sets",this.get('sets'));
	 console.log("score",this.get('score'));
	 console.log("court",this.get('court'));
	 console.log("surface",this.get('surface'));
	 console.log("tour",this.get('tour'));	
	 console.log("country",this.get('country'));	
	 console.log("city",this.get('city'));	
	 */	 	  	 	 	 

	 object.options.type = "singles";	
	 	 
	 if (this.get('subtype') !== undefined)
	   if (this.get('subtype') !== "") 
	     object.options.subtype = this.get('subtype');
	   
	 if (this.get('sets') !== undefined)
       if (this.get('sets') !== "") 
         object.options.sets = this.get('sets');
       
     if (this.get('score') !== undefined)  
       if (this.get('score') !== "") 
         object.options.score = this.get('score');
     
     if (this.get('court') !== undefined)  
       if (this.get('court') !== "") 
         object.options.court = this.get('court');
       
     if (this.get('surface') !== undefined)  
       if (this.get('surface') !== "")
         object.options.surface = this.get('surface');
       
     if (this.get('tour') !== undefined)  
       if (this.get('tour') !== "") 
         object.options.tour = this.get('tour');
       
     if (this.get('country') !== undefined)  
       if (this.get('country') !== "") 
         object.location.country = this.get('country');
       
     if (this.get('city') !== undefined)  
       if (this.get('city') !== "") 
         object.location.city = this.get('city'); 

     if (this.get('start') !== undefined)  
       if (this.get('start') !== "") 
         object.dates.start = this.get('start');     
         
     if (this.get('end') !== undefined)  
       if (this.get('end') !== "") 
         object.dates.end = this.get('end');          

     if (this.get('status') !== undefined)  
       if (this.get('status') !== "") 
         object.status = this.get('status');  
         
     //console.log("1.4");          
     //,pos : [ appConfig.longitude, appConfig.latitude ]

      
    if (method === 'create' && this.get('playerid') !== undefined) {
    
      console.log('create Game', JSON.stringify(object));
	  var that = this;
		
      return Backbone.ajax({
        dataType : 'json',
        url : Y.Conf.get("api.url.games") + '?playerid=' + (this.get('playerid') || '')
            + '&token=' + (this.get('token') || ''),
        type : 'POST',
        data : object,
        success : function(data) {
          // FIXME : on redirige sur //si offline id , si online sid
          //window.location.href = '#games/' + data.id;         
          that.set(data);         
          if (options && options.success) {
              console.log('success create in backbone ajax model');
              options.success(data);
          }
          
        },
        error: function (message) {
            if (options && options.error)
              console.log('error create in backbone ajax model');              
              options.error(message);
        }

      });

    } else if (method === 'update' && this.get('playerid') !== undefined) {
        
        var gameid = this.get('id');
    
        console.log('update Game', JSON.stringify(object));    	
		var that = this;
		
        return Backbone.ajax({
          dataType : 'json',
          url : Y.Conf.get("api.url.games") + gameid + '/?playerid=' + (this.get('playerid') || '')
            + '&token=' + (this.get('token') || ''),
          type : 'POST',
          data : object,
          success: function (data) {
            that.set(data);
            if (options && options.success) {
              console.log('success update in backbone ajax model');
              options.success(data);
            }
          },
          error: function (message) {
            if (options && options.error)
              console.log('error update in backbone ajax model');              
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
    var score = this.get("options").score; 
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