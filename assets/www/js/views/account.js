var AccountView = Backbone.View.extend({
  el : "#index",

  events : {
    'vclick #debug' : 'debug'
  },

  initialize : function() {
    
    this.accountViewTemplate = Y.Templates.get('accountViewTemplate');
    
    this.Owner = JSON.tryParse(window.localStorage.getItem("Y.Cache.Player"));

    console.log('DEV Time init',new Date().getTime());
    
    
    this.render();
  },

  debug : function() {
    console.log('synchro');
    //players = new PlayersCollection('me');
    //players.storage.sync.push();

    //players = new PlayersCollection();
    //players.storage.sync.push();

    // games = new GamesCollection();
    // games.storage.sync.push();
  },

  // render the content into div of view
  render : function() {
    
    console.log('DEV Time render Begin',new Date().getTime());

    $(this.el).html(this.accountViewTemplate({
      Owner : this.Owner
    }));

    $(this.el).trigger('pagecreate');

    // this.$el.html(this.accountViewTemplate(),{Owner:Owner});
    // $.mobile.hidePageLoadingMsg();
    // this.$el.trigger('pagecreate');
    
    console.log('DEV Time render End',new Date().getTime());
    
    return this;
  },

  onClose : function() {
    this.undelegateEvents();
  }
});