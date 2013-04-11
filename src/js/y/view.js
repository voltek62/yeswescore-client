(function (Y, undefined) {
  /*#ifdef STRICT*/
  "use strict";
  /*#endif*/

  var View = Backbone.View.extend({
    inputModeOn: function () {
      Y.GUI.inputMode(true);
    },

    inputModeOff: function () {
      Y.GUI.inputMode(false);
    }
  });

  Y.View = View;
})(Y);