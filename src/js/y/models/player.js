var PlayerModel = Backbone.Model.extend({
  urlRoot : function () { return Y.Conf.get("api.url.players"); },  

  mode: '',

  defaults: {
    name: "",
    rank: "",
    type: "default",
    games: [],
    club: {
      id: "",
      name: ""
    },
    dates: {
      update: "",
      creation: new Date(),
      birth: ""
    },
    push: {
      platform: "",
      token: ""
    },    
    language: Y.language,
    location: {
      currentPos: [0, 0]
    },
    gender:"man",
    profile: { image: null },
    token: "",
    updated_at: new Date()
  },

  isMe: function () {
    return this.get('id') == Y.User.getPlayer().get('id');
  },

  isMine: function () {
    return this.get('owner') == Y.User.getPlayer().get('id');
  },

  isOWned: function () {
    return this.get('type') === "owned";
  },

  hasImage: function () {
    return (this.get('profile') && this.get('profile').image);
  },

  // imageUrl = [host-api]/static/files/[hashed id 2charsx5]/[id].jpeg
  // ex: foobar.com:1042/static/files/ab/cd/ef/gh/ij/abcdefghijklmnopqrstuv-abcd42.jpeg
  getImageUrl: function () {
    // Example: plic.no-ip.org:22222/static/files/6c/f3/00/a1/b1/6cf300a1b195865dbe55291546c661e651dc65ba90609028a09175a2fec0c578-51e9c0006ded17e016000003.jpeg
    if (!this.hasImage())
      return null;
    var imageId = this.get('profile').image;
    return Y.Conf.get("api.url.static.files") + imageId.substr(0, 10).match(/.{1,2}/g).join("/") + "/" + imageId + ".jpeg"; // default ext.
  },

  getImageUrlOrPlaceholder: function () {
    var imageUrl = this.getImageUrl();
    return imageUrl || Y.Conf.get("gui.image.placeholder.profil");
  },

  equalsId : function(other) {
     return other.id == this.id;
  },

  sync: function (method, model, options) {
    // allowing playerid & token overload.
    var that = this;
    var playerid = options.playerid || this.get('id') || '';
    var token = options.token || this.get('token') || '';
    
    // FIXME: supprimer la duplication de code entre la creation & l'update
    if (method === 'create' && this.get('id') === undefined) {
      var dataSend = {
        language: Y.language,
        location : {},
        push : {}
      };
      
      // FIXME: l'écriture de la geoloc doit être externe a ce fichier.
      if (Y.Geolocation.longitude!==null && Y.Geolocation.latitude!==null)
        dataSend.location.currentPos = [Y.Geolocation.longitude, Y.Geolocation.latitude];   
        
      if (this.get('push')) {
        if (typeof this.get('push').token === "string" && this.get('push').token) {
          dataSend.push.token = this.get('push').token;
        }
        if (typeof this.get('push').platform === "string" && this.get('push').platform) {
          dataSend.push.platform = this.get('push').platform; 
        }
      }
      
      return Backbone.ajax({
        dataType: 'json',
        url: Y.Conf.get("api.url.players"),
        type: 'POST',
        data:dataSend,
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
    } else if (method === 'update' && this.get('id') !== undefined) {
      // Update
      var dataSend = {
        id: (this.get('id') || ''),
        name: (this.get('name') || ''),
        email: { address: (this.get('email') || '') },
        rank: (this.get('rank') || ''),
        gender: (this.get('gender') || ''),
        idlicense: (this.get('idlicence') || ''),
        language: Y.language,
        location : {},
        push : {},
        dates : {},
        token: (this.get('token') || '')
      };

      if (this.get('profile') &&
          typeof this.get('profile').image === "string")
        dataSend.profile = { image: this.get('profile').image };

      if (Y.Geolocation.longitude!==null && Y.Geolocation.latitude!==null)
        dataSend.location.currentPos = [Y.Geolocation.longitude, Y.Geolocation.latitude];

      if (this.get('uncryptedPassword'))
        dataSend.uncryptedPassword = this.get('uncryptedPassword');
        
      if (this.get('dates').birth)
        dataSend.dates.birth = this.get('dates').birth;      
      
      if (typeof this.get('clubid') === "string") {
        if (this.get('clubid') === '') {
          dataSend.club = { id: "" };
          Y.User.removeClub();
        } else {
          dataSend.club = { id: this.get('clubid') };
          Y.User.setClub(this.get('clubid'));
        }
      }
      
      if (this.get('push') &&
          typeof this.get('push').token === "string" &&
          this.get('push').token) {
        dataSend.push.token = this.get('push').token;
      }   

      if (this.get('push') &&
          typeof this.get('push').platform === "string" &&
          this.get('push').platform) {
        dataSend.push.platform = this.get('push').platform; 
      }

      var url = Y.Conf.get("api.url.players") + this.get('id')
            + '/?playerid=' + playerid + '&token=' + token;
      return Backbone.ajax({
        dataType: 'json',
        url: url,
        type: 'POST',
        data: dataSend,
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
    } else {
      model.url = Y.Conf.get("api.url.players") + this.id;
      return Backbone.sync(method, model, options);
    }
  }
});
