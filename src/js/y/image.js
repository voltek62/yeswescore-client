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

    // this function resize a dataUrl image
    //
    // /!\ The original image is replaced.
    //
    // @param object     { dataUri: ... }
    // @param function   callback(err, dataUri)
    resize: function (image, callback) {
      var img = new Image();
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

        // resizing using canvas
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);
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