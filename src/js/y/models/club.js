var ClubModel = Backbone.Model.extend({
  urlRoot : function () { return Y.Conf.get("api.url.clubs"); },

  mode : '',
  
  defaults : {
    sport : "tennis",
    name : "",
    ligue : "",
    zip : "",
    outdoor : 0,
    indoor : 1,
    countPlayers : 0,
    countPlayers1AN : 0,
    countTeams : 0,
    countTeams1AN : 0,
    school : "",
    location : {
      address : "",
      city : "",
      pos : [ 0, 0 ]
    },
    dates : {
      update : "",
      creation : new Date()
    }
  },  

  //initialize : function() {
  //  this.urlRoot = function () { return Y.Conf.get("api.url.clubs"); }
  //},

  sync : function(method, model, options) {
    // allowing playerid & token overload.
    var that = this;
    var playerid = options.playerid || this.get('id') || '';
    var token = options.token || this.get('token') || '';


    if (method === 'create' && this.get('id') === undefined) {

      var dataSend = {       
          sport: "tennis",
          name: this.get('name'),
          location : {
            pos: (this.get('pos') || ''),
            address: (this.get('address') || ''),
            zip: (this.get('zip') || ''),
            city: (this.get('city') || '')
          }
         
      };

      return Backbone.ajax({
        dataType : 'json',
        url : Y.Conf.get("api.url.clubs")+ '?playerid=' + options.playerid + '&token=' + options.token,
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
      console.log("FIXME");
    }
    else {
      model.url = Y.Conf.get("api.url.clubs")+this.id;
      return Backbone.sync(method, model, options);
    }

  }


});
