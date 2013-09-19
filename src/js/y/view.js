(function (Y, undefined) {
  /*#ifdef STRICT*/
  "use strict";
  /*#endif*/

  var events = {
    // input mode
    'blur input': 'inputModeOffDelayed', //Permet de cacher le textarea          
     /*#ifndef IOS*/
    'click input': 'inputModeOn', // we cannot use focus, bugs with device virtual keyboard :(
    'click textarea': 'inputModeOn', // we cannot use focus, bugs with device virtual keyboard :(
    'blur textarea': 'inputModeOffDelayed', 
    /*#endif*/
    // helpers
    'click *[data-js-call]': 'mycall',
    'click a[data-js-navigate]': 'navigate',

    // autocompletion   
    'click *[data-autocomplete]': 'autocompleteStart'
  };

  var View = Backbone.View.extend({
    lastInput : null,
    
    initialize: function () {
      // before anything, linking the DOM to this view.
      this.el.view = this;
      // merging this.events with events.
      this.events = _.assign(events, this.events || {});
      // might be usefull
      this.unloaded = false;
      // proxy func call.
      return this.myinitialize.apply(this, arguments);
    },

    mycall: function (e) {
      return this[$(e.currentTarget).attr("data-js-call")](e);
    },

    navigate: function (e) {
      var $a = $(e.currentTarget)
        , href = $a.attr("href")
        , disabled = $a.attr("disabled");
      
      // prevent other execution
      e.preventDefault();
      e.stopPropagation();
      //
      href = (href[0] == "#") ? href.substr(1) : href;
      if (disabled === undefined)
        Y.Router.navigate(href, {trigger: true});
      return false;
    },

    clearInputModeOffDelayed: function () {
      if (this.inputModeOffTimeout) {
        window.clearTimeout(this.inputModeOffTimeout);
        this.inputModeOffTimeout = null;
      }
    },

    inputModeOn: function (e) {
      //if input, hide subnavbar
      Y.GUI.navbar.hideSubBar();
      Y.GUI.navbar.showButton();
        
      this.lastInput = document.activeElement.id;
      this.clearInputModeOffDelayed();
      Y.GUI.inputMode(true);
      return true;
    },

    autocompleteStart: function (e) {
      var $target = $(e.target)
        , type = $target.attr("data-type")
        , callback = this[$target.attr("data-autocomplete")];

      // grabbing data
      var onselected = _.bind(function (val) {
        $target.val(val);
        this[$target.attr("data-autocomplete-onselected")](val);
      }, this);

      Y.GUI.autocomplete = new Y.Views.Autocomplete({
        type: type,
        val: $target.val(),
        callback: callback,
        onselected: onselected
      });
      Y.GUI.autocomplete.render();
    },

    inputModeOffTimeout: null,

    inputModeOffDelayed: function (e) {

      this.clearInputModeOffDelayed();
      
      var that = this;
      this.inputModeOffTimeout = window.setTimeout(function () {

        var activeElement = document.activeElement;
        if (activeElement && activeElement.nodeName.toLowerCase() === "input") {
          return; // security...
        }
        Y.GUI.inputMode(false);
      }, 100);
      return true;
    },

    inputModeOff: function (e) {
      //console.log('View.js: input mode off');
      this.clearInputModeOffDelayed();
      Y.GUI.inputMode(false);
      return true;
    },

    close : function () {
      this.undelegateEvents();
      this.unloaded = true;
      this.inputModeOff();
      this.readonly(false);
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

    readonly: function (bool) {
      Y.GUI.freeze(bool);
    }
  });

  Y.View = View;
})(Y);