(function (Y, undefined) {
  /*#ifdef STRICT*/
  "use strict";
  /*#endif*/

  var View = Backbone.View.extend({
    inputModeOn: function () {
      Y.GUI.inputMode(true);
      return true;
    },

    inputModeOff: function () {
      Y.GUI.inputMode(false);
      return true;
    }
  });

  Y.View = View;
})(Y);