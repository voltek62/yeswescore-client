var ClubView = Backbone.View.extend({
  el:"#index",

  events: {
    'vclick #followButton': 'follow'
  },

  initialize:function() {
    this.clubViewTemplate = YesWeScore.Templates.get('clubViewTemplate');
    	
    this.club = new ClubModel({id:this.id});
    this.club.fetch(); 
    	
    //this.render();
    this.club.on( 'change', this.render, this );
  },
  
  follow : function() {
      this.clubsfollow = new ClubsCollection('follow');
      this.clubsfollow.create(this.club);
  },      

  //render the content into div of view
  render: function(){
    this.$el.html(this.clubViewTemplate({ club:this.club.toJSON() }));
    
    $.mobile.hidePageLoadingMsg();      
                                    
    //Trigger jquerymobile rendering
    //var thisel=this.$el;
    //this.$el.on( 'pagebeforeshow',function(event){
    //   thisel.trigger('pagecreate');
    //});
    //return to enable chained calls
    this.$el.trigger('pagecreate');
    return this;
  },

  onClose: function(){
    this.undelegateEvents();
    this.club.off("change",this.render,this); 
    //this.$el.off('pagebeforeshow'); 
  }
});