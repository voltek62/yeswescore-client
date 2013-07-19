var FileModel = Backbone.Model.extend({
  urlRoot : Y.Conf.get("api.url.files"),

  mode : '',

  data: null,
  
  defaults : {
    owner: null,
    dates : {
      creation: null
    },
    path: "",
    mimeType: "image/jpeg",
    bytes: 0,
    metadata: {}
  },

  initialize: function() {
    this.urlRoot = Y.Conf.get("api.url.files");
  },

  sync: function(method, model, options) {
    var that = this;
    var player = Y.User.getPlayer();
    if (method === 'create') {
      return Backbone.ajax({
        type: 'POST',
        url : Y.Conf.get("api.url.files")+"?mimeType=image/jpeg&playerid="+player.get('id')+"&token="+player.get("token"),
        data: { data: this.data }
      }).always(function () { that.data = null; });
    }
    return Backbone.sync(method, model, options);
  }
});
