(function (Y, undefined) {
  /*#ifdef STRICT*/
  "use strict";
  /*#endif*/

  var events = {
    // input mode
    'click input': 'inputModeOn',
    'blur input': 'inputModeOff',
    'focus textarea': 'inputModeOn',
    'blur textarea': 'inputModeOff',
    // helpers
    'click *[data-js-call]': 'mycall',
    // autocompletion
    'focus *[data-autocomplete]': 'autocompleteStart',
    'blur *[data-autocomplete]': 'autocompleteStopDelayed', // keep 0.5 sec on screen.
    'keyup *[data-autocomplete]': 'autocompleteCall'
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
      this.autocompleteStop();
      this.off();
      if (typeof this.onClose === "function")
        this.onClose();
    },

    // scroll helpers
    scrollTop: function () {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    },

    scrollBottom: function () {
      document.documentElement.scrollTop = 1000000;
      document.body.scrollTop = 1000000;
    },

    scrollAt: function (val) {
      // FIXME
    },

    // autocomplete helpers
    autocompleteObj: null,
    autocompleteTimeout: null,

    autocompleteStart: function (e) {
      if (this.autocompleteTimeout) {
        window.clearTimeout(this.autocompleteTimeout);
        this.autocompleteTimeout = null;
      }
      if (this.autocompleteObj) {
        this.autocompleteObj.dispose();
        this.autocompleteObj = null;
      }
      //
      var fetchFunctionName = $(e.target).attr("data-autocomplete");
      assert(typeof this[fetchFunctionName] === "function");
      this.autocompleteObj = new Y.Autocomplete();
      this.autocompleteObj.on("input.temporized", function (input) {
        // fetching data for input
        this[fetchFunctionName](input, _.bind(function (err, data) {
          // FIXME: this function will not be disposed :(
          if (err)
            return this.autocompleteObj.trigger("fetched.error", err);
          this.autocompleteObj.trigger("fetched.result", data || []);
        }, this));
      }, this);
      var selectedFunctionName = $(e.target).attr("data-autocomplete-onselected");
      if (selectedFunctionName) {
        assert(typeof this[selectedFunctionName] === "function");
        this.autocompleteObj.on("selected", function (val) {
          this[selectedFunctionName](val);
        }, this);
      }
    },

    autocompleteStopDelayed: function (now) {
      // keep on screen 0.5 sec.
      this.autocompleteTimeout = window.setTimeout(_.bind(function () {
        this.autocompleteStop(); 
        this.autocompleteTimeout = null;
      }, this), 500);
    },

    autocompleteStop: function () {
      if (this.autocompleteObj) {
        this.autocompleteObj.dispose();
        this.autocompleteObj = null;
      }
    },

    autocompleteCall: function (e) {
      if (this.autocompleteObj)
        this.autocompleteObj.trigger("input", $(e.target).val());
    }
  });

  Y.View = View;
})(Y);