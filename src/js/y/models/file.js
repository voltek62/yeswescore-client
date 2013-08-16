var FileModel = Backbone.Model.extend({
  urlRoot : function () { return Y.Conf.get("api.url.files"); },

  mode : '',

  data: null,
  format: "binary", // binary,dataURI
  
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
  
  // high level func.
  // @param $image jquery image object
  //    WARNING, this image must have a src="data=:... format"
  saveImage: function ($image) {
    // default & safe transfer option is dataURI base64 string.
    //  but, sometimes we can transfer data in binary ~= 30%< upload
    var CanvasPrototype = window.HTMLCanvasElement &&
            window.HTMLCanvasElement.prototype;

    if (Y.Conf.get("upload.binary.enabled") && // Y.Conf.get(
        typeof CanvasPrototype.toBlob === "function") {
      // @see https://github.com/blueimp/JavaScript-Canvas-to-Blob/blob/master/js/canvas-to-blob.js
      var canvas = document.createElement("canvas");
      canvas.width = $image[0].width;
      canvas.height = $image[0].height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage($image[0], 0, 0, $image[0].width, $image[0].height);
      var that = this;
      var deferred = $.Deferred();
      this.data = new FormData();
      this.format = "binary";
      canvas.toBlob(function (blob) {
        that.data.append('file', blob);
        that.save().done(function (r) { deferred.resolve(r); });
      });
      return deferred;
    } else {
      // FIXME: checker si aucune dataURI, passer par un canvas.
      this.format = "dataURI";
      this.data = { data: $image.attr("src") };
      return this.save();
    }
  },

  sync: function(method, model, options) {
    var that = this;
    var player = Y.User.getPlayer();
    if (method === 'create') {
      var ajaxOptions = {
        type: 'POST',
        url : Y.Conf.get("api.url.files")+"?mimeType=image/jpeg&playerid="+player.get('id')+"&token="+player.get("token")+"&format="+this.format,
        // formData options
        // @see http://stackoverflow.com/questions/6974684/how-to-send-formdata-objects-with-ajax-requests-in-jquery
        data: this.data,
        // backbone could be weird...
        success : function(data) {
          if (options && options.success)
            options.success(data);
        },
        error: function (message) {
          if (options && options.error)
            options.error(message);
        }
      };
      // specific ajax options for binary content.
      if (this.format === "binary") {
        ajaxOptions.processData = false; // default is true, binary=>false,dataURI=>true
        ajaxOptions.contentType = false;
      }
      return Backbone.ajax(ajaxOptions).always(function () { that.data = null; });
    }
    return Backbone.sync(method, model, options);
  }
});
