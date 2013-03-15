//FIXME:si connection revient on update le tout via 
// Game.syncDirtyAndDestroyed(); 

var GameModel = Backbone.Model.extend({

  // storeName : "game",

  urlRoot : Y.Conf.get("api.url.games"),

  initialize : function() {

    this.updated_at = new Date();

  },

  setSets : function(s) {
    this.sets = s;
  },

  defaults : {
    sport : "tennis",
    status : "ongoing",
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

    console.log('method sync Model Game', method);

    if (method === 'create' && this.get('playerid') !== undefined) {

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

      var object = {
        teams : [ {
          id : null,
          players : [ team1_json ]
        }, {
          id : null,
          players : [ team2_json ]
        } ],
        options : {
          type : 'singles',
          subtype : (this.get('subtype') || 'A'),
          sets : '',
          score : '',
          court : (this.get('court') || ''),
          surface : (this.get('surface') || ''),
          tour : (this.get('tour') || '')
        },
        location : {
          country : (this.get('country') || ''),
          city : (this.get('city') || ''),
          pos : [ appConfig.longitude, appConfig.latitude ]
        }
      };

      console.log('tmp Game POST', JSON.stringify(object));

      return $.ajax({
        dataType : 'json',
        url : Y.Conf.get("api.url.games") + '?playerid=' + (this.get('playerid') || '')
            + '&token=' + (this.get('token') || ''),
        type : 'POST',
        data : object,
        success : function(result) {
          console.log('data result Game', result);
          // FIXME : on redirige sur //si offline id , si online sid
          window.location.href = '#games/' + result.id;
        },
        error : function(result) {
          // si erreur on stocke dans localstorage console.log('error
          // Game',result);

        }
      });

    } else if (method === 'update' && this.get('playerid') !== undefined) {

      return $.ajax({
        dataType : 'json',
        url : Y.Conf.get("api.url.games") + '?playerid=' + (this.get('playerid') || '')
            + '&token=' + (this.get('token') || ''),
        type : 'POST',
        data : {

          options : {
            sets : (this.get('sets') || '')
          }
        },
        success : function(result) {

          console.log('data update Game', result);

        }

      });

    } else {
      
      
      console.log('GameModel default '+Y.Conf.get("api.url.games")+this.id);
      
      //var params = _.extend({ type: 'GET', dataType: 'json', url: Y.Conf.get("api.url.games")+this.id, processData:false }, options); 
      //return $.ajax(params);
      model.url = Y.Conf.get("api.url.games")+this.id+"?stream=true";

      return Backbone.sync(method, model, options);
    }
  }

});
