Y.Views.Index = Y.View.extend({
  el: "#content",

  events: {
    "click #games-follow": "goTo",
    "click #clubs-follow": "goTo",
    "click #players-follow": "goTo"
  },


  pageName: "index",
  pageHash : "index",  
  
  initialize: function () {
    Y.GUI.header.title("ACCUEIL");

    var that = this;
    //
    this.indexViewTemplate = Y.Templates.get('index');

    //we capture config from bootstrap
    //FIXME: put a timer
    //this.config = new Config();
    //this.config.fetch();

    // we need to do 2 things 
    // - fetch games
    // - read/create the player
    // THEN
    //  render games & player.



    // second: read/create player
    var playerDeferred = $.Deferred();
    this.$el.html("please wait, loading player");
    Y.User.getPlayerAsync(function (err, player) {
      if (err) {
        // no player => creating player.
        console.log('error reading player ', err);
        // creating the player.
        Y.User.createPlayerAsync(function (err, player) {
          // FIXME: err, reject deferred
          console.log('player created', player);
          playerDeferred.resolve();
        });
        return;
      }
      playerDeferred.resolve();
    });

    // FIXME: handling error with deferreds
    $.when(
      playerDeferred
    ).done(function () {
      that.render();

    });
  },


  goTo: function (elmt) {
    if (elmt.currentTarget.href) {
      var route = elmt.currentTarget.data-input;
      console.log(route);
      Y.Router.navigate(route, {trigger: true}); 
    }
  },

  // should not take any parameters
  render: function () {
    this.$el.html(this.indexViewTemplate(), {});
    return this;
  },

  onClose: function () {
    this.undelegateEvents();
    //this.games.off("all", this.renderList, this);
  }
});