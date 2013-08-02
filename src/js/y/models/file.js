var FileModel = Backbone.Model.extend({
  urlRoot : function () { return Y.Conf.get("api.url.files"); },

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

  sync: function(method, model, options) {
    var that = this;
    var player = Y.User.getPlayer();
    if (method === 'create') {
      return Backbone.ajax({
        type: 'POST',
        url : Y.Conf.get("api.url.files")+"?mimeType=image/jpeg&playerid="+player.get('id')+"&token="+player.get("token"),
        data: { data: this.data },
        // backbone could be weird...
        success : function(data) {
          if (options && options.success)
            options.success(data);
        },
        error: function (message) {
          if (options && options.error)
            options.error(message);
        }
      }).always(function () { that.data = null; });
    }
    return Backbone.sync(method, model, options);
  }
});
