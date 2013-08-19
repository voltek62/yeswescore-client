(function (Y, undefined) {
  /*#ifdef STRICT*/
  "use strict";
  /*#endif*/


  /**
   * WANING: This class only works with objects
   *  to avoid any memory leaks caused by string duplication.
   */
  var MyImage = {
    // @param object     { dataUri: ... }
    addJpegDataUrlHeaders: function (image) {
      if (image.substr(0, 5) !== "data:")
        image.dataUri = "data:image/jpeg;base64," + image.dataUri; // Ouch! doest this cost a lot of memory ?
    },


    /**
    * Detecting vertical squash in loaded image.
    * Fixes a bug which squash image vertically while drawing into canvas for some images.
    * This is a bug in iOS6 devices. This function from https://github.com/stomita/ios-imagefile-megapixel
    */
    detectVerticalSquash: function(img) {
      var iw = img.naturalWidth, ih = img.naturalHeight;
      var canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = ih;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      var data = ctx.getImageData(0, 0, 1, ih).data;
      // search image edge pixel position in case it is squashed vertically.
      var sy = 0;
      var ey = ih;
      var py = ih;
      while (py > sy) {
        var alpha = data[(py - 1) * 4 + 3];
        if (alpha === 0) {
          ey = py;
        } else {
          sy = py;
        }
        py = (ey + sy) >> 1;
      }
      var ratio = (py / ih);
      return (ratio===0)?1:ratio;
    },

    // this function resize a dataUrl image
    //
    // /!\ The original image is replaced.
    //
    // @param object     { dataUri: ... }
    // @param function   callback(err, dataUri)
    resize: function (image, callback) {
      var img = new Image();
      var that = this;
      img.onload = function () {
        // now the image is loaded, we know the width & height.
        // ensure smallest side is 200px
        var width, height, maxBorderSize=200;
        if (img.width < img.height) {
          width = maxBorderSize;
          height = img.height / img.width * maxBorderSize;
        } else {
          width = img.width / img.height * maxBorderSize;
          height = maxBorderSize;
        }
        console.log('width: ' + width + ' height: '+ height + ' image w/h : ' + img.width + '/' + img.height);

        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
 
        // resizing using canvas
        if (Cordova.Device.isIOS) {
          var vertSquashRatio = that.detectVerticalSquash(img);
          ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height / vertSquashRatio);
        }
        else {
          ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);
        }
 
        image.dataUri = canvas.toDataURL("image/jpeg");
        ctx = null;    // usefull ?
        canvas = null; // usefull ?        
        // sending result
        callback(null, image);
      };
      img.onerror = function () { callback("unknown error"); };
      img.src = image.dataUri;
      delete image.dataUri; // freeing memory before onload
    }
  };
  
  Y.Image = MyImage;
})(Y);