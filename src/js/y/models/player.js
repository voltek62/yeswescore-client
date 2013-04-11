var PlayerModel = Backbone.Model.extend({
  urlRoot: Y.Conf.get("api.url.players"),

  mode: '',

  defaults: {
    name: "",
    nickname: "",
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

  login: function (mail, password) {

    return $.ajax({
      dataType: 'json',
      url: Y.Conf.get("api.url.auth"),
      type: 'POST',
      data: {
        email: { address: mail },
        uncryptedPassword: password
      },
      success: function (data) {

        throw "FIXME: do not call GUI & use Y.User.* api";
        /*
        console.log('data result Login', data);

        // Display Results
        // TODO : prevoir code erreur
        if (data.id !== undefined) {
          $('span.success').html('Login OK ' + data.id).show();

          //window.localStorage.setItem("Y.Cache.Player", JSON.stringify(data));

          //players = new PlayersCollection('me');
          //players.create(data);

        } else
          $('span.success').html('Erreur').show();

        // FIXME : on redirige sur la page moncompte
        */
      }
    });

  },

  read: function () {


  },

  newpass: function (mail) {

    console.log('On demande un newpass');

    return $.ajax({
      dataType: 'json',
      url: Y.Conf.get("api.url.auth") + "resetPassword/",
      type: 'POST',
      data: {
        email: { address: mail }
      },
      success: function (data) {

        console.log('data result Reset Password', data);

        // Display Results
        // TODO : prevoir code erreur


        $('span.success').html(' ' + data.message + ' Attention, le mail qui rappelle votre mot de passe peut arriver dans le spam.').show();


      }
    });

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
            options.success(model, data, options);
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
        nickname: (this.get('nickname') || ''),
        name: (this.get('name') || ''),
        email: { address: (this.get('email') || '') },
        rank: (this.get('rank') || ''),
        idlicense: (this.get('idlicense') || ''),
        language: Y.language,
        games: [],
        token: (this.get('token') || ''),
        location: {
          currentPos: [(this.get('latitude') || 0), (this.get('longitude') || 0), ]
        }
      };

      // si mot de passe defini
      if (this.get('password') !== '') {
        dataSend.uncryptedPassword = this.get('password');
      }
      // si club non nul
      if (this.get('clubid') !== '') {
        dataSend.club = {
          id: (this.get('clubid') || undefined)
        };
      }

      console.log('Update Player', dataSend);

      return $.ajax({
        dataType: 'json',
        url: Y.Conf.get("api.url.players") + (this.get('playerid') || '')
            + '/?playerid=' + (this.get('playerid') || '') + '&token='
            + (this.get('token') || ''),
        type: 'POST',
        data: dataSend
      });
    }
    else {
      model.url = Y.Conf.get("api.url.players") + this.id;
      //console.log('model.url : ', model.url);

      return Backbone.sync(method, model, options);

    }



  }

});
