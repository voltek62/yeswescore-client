var PlayerModel = Backbone.Model.extend({
  urlRoot: Y.Conf.get("api.url.players"),

  mode: '',

  defaults: {
    name: "",
    rank: "NC",
    type: "default",
    games: [],
    club: {
      id: "",
      name: ""
    },
    dates: {
      update: "",
      creation: new Date()
    },
    language: Y.language,
    location: {
      currentPos: [0, 0]
    },
    token: "",
    updated_at: new Date()
  },

  initialize: function () {

  },



  read: function () {


  },



  sync: function (method, model, options) {

    console.log('Player sync:' + method + " playerid:" + this.get('playerid') + " id:" + this.id);

    if (method === 'create' && this.get('playerid') === undefined) {
      var that = this;
      return Backbone.ajax({
        dataType: 'json',
        url: Y.Conf.get("api.url.players"),
        type: 'POST',
        data: {
          language: Y.language,
          location: {
            currentPos: [Y.Geolocation.longitude, Y.Geolocation.latitude]
          },
          club: (this.get('club') || '')
        },
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
    } else if (this.get('playerid') !== undefined) {
      // Update

      var dataSend = {
        id: (this.get('playerid') || ''),
        name: (this.get('name') || ''),
        email: { address: (this.get('email') || '') },
        rank: (this.get('rank') || ''),
        idlicense: (this.get('idlicence') || ''),
        language: Y.language,
        games: [],
        token: (this.get('token') || ''),
        location: {
          currentPos: [Y.Geolocation.longitude, Y.Geolocation.latitude]
        }
      };

      // si mot de passe defini
      if (typeof this.get('password') === "string" && this.get('password') !== '') {
        dataSend.uncryptedPassword = this.get('password');
      }
      // si club non nul
      if (typeof this.get('clubid') === "string" && this.get('clubid') !== '') {
        dataSend.club = {
          id: (this.get('clubid') || undefined)
        };
        //On met en cache le numero de club
        Y.User.setClub(this.get('clubid'));
      }
      else {
      	Y.User.removeClub();
      }

      console.log('Send Player', dataSend);
      
      return Backbone.ajax({
        dataType: 'json',
        url: Y.Conf.get("api.url.players") + (this.get('playerid') || '')
            + '/?playerid=' + (this.get('playerid') || '') + '&token='
            + (this.get('token') || ''),
        type: 'POST',
        data: dataSend,
        success : function(player) {
          //MAJ cache ???
          console.log('Update Player Ok',player);
          
        }
      });
    }
    else {
      model.url = Y.Conf.get("api.url.players") + this.id;
      //console.log('model.url : ', model.url);

      return Backbone.sync(method, model, options);

    }



  }

});
