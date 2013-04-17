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
    status : "ongoing",
    dates : {
      end : "",
      start : ""
    },   
    location : {
      country : "",
      city : "",
      pos : []
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
    },
    updated_at : new Date()
  },

  sync : function(method, model, options) {

    var team1_json = '';
    var team2_json = '';
    

    // if player exists / not exists
    if (this.get('team1_id') === '')
      team1_json = {
        name : this.get('team1'),
        rank : 'NC'
    };
    else
      team1_json = {
        id : this.get('team1_id')
    };

    if (this.get('team2_id') === '')
      team2_json = {
        name : this.get('team2'),
        rank : 'NC'
    };
    else
      team2_json = {
        id : this.get('team2_id')
    };
      
    if (method === 'create' && this.get('playerid') !== undefined) {
    
      var object = {
	    teams : [ {
	      id : null,
	      players : [ team1_json ]
	    }, {
	      id : null,
	      players : [ team2_json ]
	    } ],
	    options : {
	      type : 'singles'
	      ,subtype : (this.get('subtype') || 'A')
	      ,sets : (this.get('sets') || '0/0')
	      ,score : ''
	      ,court : (this.get('court') || '')
	      ,surface : (this.get('surface') || '')
	      ,tour : (this.get('tour') || '')
	    },
	    location : {
	      country : (this.get('country') || '')
	      ,city : (this.get('city') || '')
	      //,pos : [ appConfig.longitude, appConfig.latitude ]
	    }
	  };

      console.log('create Game', JSON.stringify(object));

      return Backbone.ajax({
        dataType : 'json',
        url : Y.Conf.get("api.url.games") + '?playerid=' + (this.get('playerid') || '')
            + '&token=' + (this.get('token') || ''),
        type : 'POST',
        data : object,
        success : function(result) {
          console.log('data success create Game', result);
          // FIXME : on redirige sur //si offline id , si online sid
          window.location.href = '#games/' + result.id;
        }

      });

    } else if (method === 'update' && this.get('playerid') !== undefined) {
    
      var object = {
	    teams : [ {
	      id : null,
	      players : [ team1_json ]
	    }, {
	      id : null,
	      players : [ team2_json ]
	    } ],
	    options : {
	      type : 'singles'
	      ,subtype : (this.get('subtype') || 'A')
	      ,sets : (this.get('sets') || '0/0')
	      ,score : ''
	      ,court : (this.get('court') || '')
	      ,surface : (this.get('surface') || '')
	      ,tour : (this.get('tour') || '')
	    },
	    location : {
	      country : (this.get('country') || '')
	      ,city : (this.get('city') || '')
	    }
	  };    
    
      var gameid = this.get('id');
    
      console.log('update Game', JSON.stringify(object));    	

      return Backbone.ajax({
        dataType : 'json',
        url : Y.Conf.get("api.url.games") + gameid + '/?playerid=' + (this.get('playerid') || '')
            + '&token=' + (this.get('token') || ''),
        type : 'POST',
        data : object,
        success : function(result) {
          console.log('data success update Game', result);
        }

      });

    } else {
      
      model.url = Y.Conf.get("api.url.games")+this.id;
      return Backbone.sync(method, model, options);
      
    }      
    
    
  }

});
