var ClubsCollection = Backbone.Collection.extend({

  model : ClubModel,

  mode : 'default',

  query : '',

  // storeName : "club",

  initialize : function(param) {

    if (param === 'follow')
      this.storage = new Offline.Storage('clubsfollow', this);

  },

  url : function() {

    if (this.mode === 'search')
      return Y.Conf.get("api.url.clubs") + 'autocomplete/?q=' + this.query;
    else
      return Y.Conf.get("api.url.clubs");

  },

  setMode : function(m, q) {
    this.mode = m;
    this.query = q;
  },

  // FIXME : if exists in localStorage, don't request
  sync : function(method, model, options) {

    return Backbone.sync(method, model, options);

  },

});
