Y.Views.Pages.NotificationList = Y.View.extend({
  el : "#content",

  events : {
    "click li": "chooseGame"
  },

  listview : "#listNotificationView",

  pageName: "notificationList",
  pageHash : "notifications/list", 

  initialize : function() {
  
  //header    
    Y.GUI.header.title(i18n.t('notification.title')); 
  
    // loading templates.
    this.templates = {
      notificationlist   :  Y.Templates.get('list-notification'),
      page         : Y.Templates.get('page-notification')
    };
        
    //this.playerListViewTemplate = Y.Templates.get('playerList');
    //this.playerSearchTemplate = Y.Templates.get('players');
    
    // we render immediatly
    this.render();    

  // renderList
    if (this.id !== 'null') {
      this.games = new GamesCollection();     
      this.games.addSearch('me');  
      this.player = Y.User.getPlayer();
      this.playerid = this.player.id;
      this.games.setQuery(this.playerid); 
      this.games.on('sync', this.renderList, this)           
      this.games.fetch();

    }
    
  },

  chooseGame : function(elmt) { 
    var ref = elmt.currentTarget.id;
  Y.Router.navigate(ref, {trigger: true});  
  },

  

  // render the content into div of view
  render : function() {
    this.$el.html(this.templates.page({}));
    
    this.$el.i18n(); 

    return this;
  },

  renderList : function(query) {
    $(this.listview).html(this.templates.notificationlist({
      games : this.games.toJSON(),
      query : ' '
    }));
    
    this.$el.i18n(); 

    return this;
  },

  onClose : function() {
    this.undelegateEvents();

    this.games.off('sync', this.renderList, this);
  }
});
