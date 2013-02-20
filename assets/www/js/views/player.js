var PlayerView = Backbone.View.extend({
  el:"#index",

  events: {
    'vclick #followPlayerButton': 'followPlayer'
  },

  initialize: function(options) {
    this.playerViewTemplate = Y.Templates.get('playerViewTemplate');

	//console.log('player init '+this.id);

    this.player = new PlayerModel({id:this.id});
    this.player.fetch(); 

    //console.log('Player',this.player.toJSON());
    
    // control if player id in playersfollow
    this.playersfollow = new PlayersCollection('follow');

    result = this.playersfollow.storage.find({id:this.id});
    if (result===null) 
    	this.follow = 'false';
    else	
    	this.follow = 'true';

    //change
    this.player.on( 'change', this.render, this );
  },

  followPlayer: function() {
    if (this.follow==='true') 
    {
	    this.playersfollow = new PlayersCollection('follow');
	       
	    console.log('On ne suit plus nofollow '+this.id);
	       
	    this.playersfollow.storage.remove(this.player);
      
	    $('span.success').html('Vous ne suivez plus ce joueur').show();
	    //$('#followPlayerButton').html('Suivre ce joueur');
      $("#followButton .ui-btn-text").text("Suivre ce joueur");
	    this.follow = 'false';
    }
    else 
    {
      this.playersfollow = new PlayersCollection('follow');
      this.playersfollow.create(this.player);
      $('span.success').html('Vous suivez ce joueur').show();	
      //$('#followPlayerButton').html('Ne plus suivre ce joueur');	
      $("#followButton .ui-btn-text").text("Ne plus suivre ce joueur");
	    this.follow = 'true';
    }
		
    this.$el.trigger('pagecreate');
  },    

  //render the content into div of view
  render: function(){
    console.log('render player view ',this.player.toJSON());
    
    this.$el.html(this.playerViewTemplate({
      player:this.player.toJSON(),follow:this.follow
    }));
    $.mobile.hidePageLoadingMsg();
    this.$el.trigger('pagecreate');
    return this;
  },

  onClose: function(){
    this.undelegateEvents();
    this.player.off("change",this.render,this);   
    //this.$el.off('pagebeforeshow'); 
  }
});