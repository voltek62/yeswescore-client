Y.Views.Player = Y.View.extend({
  el:"#content",

  events: {
    'click #followButton': 'followPlayer'
  },

  pageName: "player",
  pageHash : "players/",

  initialize: function(options) {
  
    this.pageHash += this.id; 
    
    Y.GUI.header.title("JOUEUR");	    
  
    this.playerViewTemplate = Y.Templates.get('player');

	//console.log('player init '+this.id);

    this.player = new PlayerModel({id:this.id});
    this.player.fetch(); 

    var players_follow = Y.Conf.get("owner.players.followed");
    if (players_follow !== undefined)
    {
      if (players_follow.indexOf(this.id) === -1) {
        this.follow = 'false';
      }
      else
        this.follow = 'true';          
    }
    else
      this.follow = 'false';

    //change
    this.player.on( 'sync', this.render, this );
  },

  followPlayer: function() {
  
        if (this.follow === 'true') {

          var players_follow = Y.Conf.get("owner.players.followed");
          if (players_follow !== undefined)
          {
            if (players_follow.indexOf(this.id) !== -1) {
              //On retire l'elmt
              players_follow.splice(players_follow.indexOf(this.id), 1);
              Y.Conf.set("owner.players.followed", players_follow, { permanent: true });
            }
          }
          
          $('span.success').html('Vous ne suivez plus ce joueur').show();
          $("#followButton").text("Suivre");

          this.follow = 'false';

        } else {
        
          //Via localStorage
          var players_follow = Y.Conf.get("owner.players.followed");
          if (players_follow !== undefined)
          {
            if (players_follow.indexOf(this.id) === -1) {
              players_follow.push(this.id);
              Y.Conf.set("owner.players.followed", players_follow, { permanent: true });
            }
          }
          else
            Y.Conf.set("owner.players.followed", [this.id]);

          $('span.success').html('Vous suivez ce joueur').show();
          $("#followButton").text("Ne plus suivre");

          this.follow = 'true';

        }	
  
  },    

  //render the content into div of view
  render: function(){
    console.log('render player view ',this.player.toJSON());
    
    this.$el.html(this.playerViewTemplate({
      player:this.player.toJSON(),follow:this.follow
    }));

    return this;
  },

  onClose: function(){
    this.undelegateEvents();
    this.player.off("sync",this.render,this);   
    //this.$el.off('pagebeforeshow'); 
  }
});