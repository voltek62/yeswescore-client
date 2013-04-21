(function (Y, undefined) {
  /*#ifdef STRICT*/
  "use strict";
  /*#endif*/

  var events = {
    'focus input': 'inputModeOn',
    'blur input': 'inputModeOff',
    'focus textarea': 'inputModeOn',
    'blur textarea': 'inputModeOff',
    'click *[data-js-call]': 'mycall'
  };

  var View = Backbone.View.extend({
    initialize: function () {
      // before anything, linking the DOM to this view.
      this.el.view = this;
      // merging this.events with events.
      this.events = _.assign(events, this.events || {});
      // proxy func call.
      return this.myinitialize.apply(this, arguments);
    },

    mycall: function (e) {
      this[$(e.currentTarget).attr("data-js-call")](e);
    },

    inputModeOn: function (e) {
      Y.GUI.inputMode(true);
      return true;
    },

    inputModeOff: function (e) {
      Y.GUI.inputMode(false);
      return true;
    },

    close : function () {
      this.inputModeOff();
      this.off();
      if (typeof this.onClose === "function")
        this.onClose();
    }
  });

  Y.View = View;
})(Y);