var TeamModel = Backbone.Model.extend({
  urlRoot : function () { return Y.Conf.get("api.url.teams"); },

  mode : '',
  
  defaults : {
    name : "",
    sport : "tennis",
    profile : {},    
    club : "",    
    players: [],
    substitutes : [],
    captain: {},
    captainSubstitute: {},
    coach: {},
    competition : true
  },  

  sync : function(method, model, options) {
    // allowing playerid & token overload.
    var that = this;
    var playerid = options.playerid || this.get('id') || '';
    var token = options.token || this.get('token') || '';
      
    if (method === 'create' && this.get('id') === undefined) {
    
      var dataSend = {        
        sport: "tennis",
        name: this.get('name'),
        club: this.get('club'),
        players: this.get('players'),
        substitutes: this.get('substitutes'),
        captain: this.get('captain')
      };
      
      console.log(dataSend);

      return Backbone.ajax({
        dataType : 'json',
        url : Y.Conf.get("api.url.teams")+ '?playerid=' + options.playerid + '&token=' + options.token,
        type : 'POST',
        data : dataSend,
        // WHYYYYY ?????
		success: function (data) {
          that.set(data);
          if (options && options.success) {
            options.success(data);
          }
        },
        error: function (message) {
          if (options && options.error)
            options.error(message);
        }
      });

    }
    else if (method === 'update' && this.get('id') !== undefined) {
     
      var dataSend = {
        id : this.get('id'),        
        sport: "tennis",
        name: this.get('name'),
        club: this.get('club'),
        players: this.get('players'),
        substitutes: this.get('substitutes'),
        captain: this.get('captain')
      };
      
      console.log(dataSend);

      return Backbone.ajax({
        dataType : 'json',
        url : Y.Conf.get("api.url.teams") + this.get('id') + '/?playerid=' + options.playerid + '&token=' + options.token,
        type : 'POST',
        data : dataSend,
        // WHYYYYY ?????
		success: function (data) {
          that.set(data);
          if (options && options.success) {
            options.success(data);
          }
        },
        error: function (message) {
          if (options && options.error)
            options.error(message);
        }
      });      
      
    }    
    else {
      model.url = Y.Conf.get("api.url.teams")+this.id;
      return Backbone.sync(method, model, options);
    }

  }


});
