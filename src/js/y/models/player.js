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
    gender:"",
    token: "",
    updated_at: new Date()
  },

  initialize: function () {

  },

  read: function () {


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

  sync: function (method, model, options) {
    // allowing playerid & token overload.
    var that = this;
    var playerid = options.playerid || this.get('id') || '';
    var token = options.token || this.get('token') || '';
    //
    if (method === 'create' && this.get('id') === undefined) {
      var dataSend = {
        id: (this.get('id') || ''),
        language: Y.language,
        location : {},
        push : {},
        club: (this.get('club') || '')  
      };
      
      if (Y.Geolocation.longitude!==null && Y.Geolocation.latitude!==null)
        dataSend.location.currentPos = [Y.Geolocation.longitude, Y.Geolocation.latitude];
      
      if (this.get('pushplatform'))
        dataSend.push.platform = this.get('pushplatform'); 
      if (this.get('pushtoken'))
        dataSend.push.token = this.get('pushtoken');   
        
      console.log('dataSend',dataSend);        
      
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

      if (Y.Geolocation.longitude!==null && Y.Geolocation.latitude!==null)
        dataSend.location.currentPos = [Y.Geolocation.longitude, Y.Geolocation.latitude];

      if (this.get('uncryptedPassword'))
        dataSend.uncryptedPassword = this.get('uncryptedPassword');
        
      if (this.get('dates').birth)
        dataSend.dates.birth = this.get('dates').birth;      

      if (this.get('push').platform)
        dataSend.push.platform = this.get('push').platform; 
      if (this.get('push').token)
        dataSend.push.token = this.get('push').token;               
      
      // si club non nul
      if (typeof this.get('clubid') === "string" && this.get('clubid') !== '' && this.get('club') !== '' ) {
        dataSend.club = {
          id: (this.get('clubid') || undefined)
        };
        //On met en cache le numero de club
        Y.User.setClub(this.get('clubid'));
      } else {
      	Y.User.removeClub();
      	 dataSend.club = {
          id: undefined,
          name : ''
        };
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
