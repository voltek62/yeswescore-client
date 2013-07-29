Y.Views.PlayerList = Y.View.extend({
  el : "#content",

  events : {
    "keyup input#search-basic": "searchOnKey",  
    "blur input#search-basic": "searchOnBlur",
    "click div.ui-block-a": "choosePlayer",
    "click div.ui-block-b": "choosePlayer",
    "click div.ui-block-c": "followPlayer"
  },

  listview : "#listPlayersView",

  pageName: "playerList",
  pageHash : "players/list", 

  initialize : function() {
  
	//header    
    Y.GUI.header.title(i18n.t('playerlist.title')); 
  
    // loading templates.
    this.templates = {
      playerlist:  Y.Templates.get('playerList'),
      playersearch: Y.Templates.get('playerListSearch'),
      error: Y.Templates.get('error'),
      ongoing: Y.Templates.get('ongoing')
    };
        
    //this.playerListViewTemplate = Y.Templates.get('playerList');
    //this.playerSearchTemplate = Y.Templates.get('players');
    
    // we render immediatly
    this.render();  
    
    var players = Y.User.getPlayer().get('following');
    this.players_follow = players;      
    this.myid = Y.User.getPlayer().get('id');
    this.mytoken = Y.User.getPlayer().get('token'); 

	// renderList
    if (this.id !== 'null') {
      this.players = new PlayersCollection();
      this.players.setMode('club', this.id);
      this.players.once('sync', this.renderList, this);
            
      this.players.fetch();

    }
    
  },

  choosePlayer : function(elmt) { 
    var href= $(elmt.currentTarget).data('href');

    if (href) {
      var route = href;
      Y.Router.navigate(route, {trigger: true}); 
    }	
  },  

  searchOnKey: function (event) {
    if(event.keyCode == 13){
      // the user has pressed on ENTER
      this.searchPlayers();
    }
    return this;
  },

  searchOnBlur: function (event) {
    this.searchPlayers();
    return this;
  },   

  searchPlayers:function() {
    var q = $("#search-basic").val();
    $(this.listview).html(this.templates.error()); 
    this.players = new PlayersCollection();   	  
    this.players.setMode('search',q);
    this.players.fetch().done($.proxy(function () { 
      
      //$(this.listview).html(this.templates.playerlist({players:this.playersfollow.toJSON(), query:q}));
      if (this.players.toJSON().length === 0) {
        $(this.listview).html(this.templates.error());
      }
      else
        $(this.listview).html(this.templates.playerlist({ players: this.players.toJSON(), query: q, players_follow : this.players_follow }));
    	
      $(this.listview).i18n();
            
      
    }, this));
    
    this.$el.i18n();
    
    return this;
  },

  // render the content into div of view
  render : function() {
    this.$el.html(this.templates.playersearch({}));
	this.$el.i18n();
    return this;
  },

  renderList : function(query) {
    $(this.listview).html(this.templates.playerlist({
      players : this.players.toJSON()
      , query : ' '
      , players_follow : this.players_follow
    }));

    return this;
  },

  followPlayer: function(elmt) {
  
  	//on ne peut pas se suivre
  	//console.log('currenttarget ',$(elmt.currentTarget).data('playerid'));
  	this.dataid = $(elmt.currentTarget).data('playerid');
  	this.datafollow = $(elmt.currentTarget).data('follow');
  	  	  	
    if (this.myid === this.dataid) return;
    
    if (this.following)
      return;   
    
    var that = this;
         
    if (this.datafollow === true) {
    
     console.log('datafollow true');

      this.following = true;
	  Backbone.ajax({
        dataType: 'json',
        url: Y.Conf.get("api.url.players") +this.myid+"/following/?playerid="+this.myid+"&token="+this.mytoken+"&_method=delete",
        type: 'POST',
        data: {
          id: this.dataid
        },
        success: function (data) {
          that.following = false;
          
          //On supprime l'id
	      if (that.players_follow !== undefined)
	      {
	        if (that.players_follow.indexOf(that.dataid) !== -1) {
	        //On retire l'elmt
	          that.players_follow.splice(that.players_follow.indexOf(that.dataid), 1);
	          var data = {id: that.myid, following: that.players_follow };
              Y.User.updatePlayer(data);
	        }
	      }
	      
	      //change text
	      $('.ui-block-c[data-playerid='+that.dataid+']>span.form-button').html(i18n.t('message.follow'));
	      $('.ui-block-c[data-playerid='+that.dataid+']').data('follow',false);
	      //$('.ui-block-c[data-playerid='+that.dataid+']>span.form-button').attr('data-follow','false');	      	      
          
        },
        error: function (err) {
          that.following = false;
          //that.displayError(i18n.t('message.error'));
          console.log(i18n.t('message.error'));
        }
      });       
      

    } else {
   
   	   console.log('datafollow false');
   
       navigator.notification.confirm(
        i18n.t('message.pushmessage'),  // message
        function(buttonIndex){
            that.followPlayerConfirm(buttonIndex, that);
        },         // callback
        i18n.t('message.pushtitle'),            // title
        i18n.t('message.pushno')+','+i18n.t('message.pushyes')                  // buttonName
	   );
	   
    }	
  
  },   
  
  followPlayerConfirm : function(buttonIndex, that){
    if (buttonIndex==1) {	    

      that.following = true;
	  
	  Backbone.ajax({
        dataType: 'json',
        url: Y.Conf.get("api.url.players") +that.myid+"/following/?playerid="+that.myid+"&token="+that.mytoken,
        type: 'POST',
        data: {
          id: that.dataid
        },
        success: function (data) {
          that.following = false;

		  //On ajoute l'id
		  if (that.players_follow !== undefined)
          {
            if (that.players_follow.indexOf(that.dataid) === -1) {     
              that.players_follow.push(that.dataid);
              var data = {id: that.myid, following: that.players_follow };
              Y.User.updatePlayer(data); 
            }
          }
          else {
            var data = {id: that.myid, following: [that.dataid] };            
            Y.User.updatePlayer(data); 
          }
          
	      //change text
	      $('.ui-block-c[data-playerid='+that.dataid+']>span.form-button').html(i18n.t('message.nofollow'));
	      //change attribute data-follow
	      $('.ui-block-c[data-playerid='+that.dataid+']').data('follow',true); 
	      //$('.ui-block-c[data-playerid='+that.dataid+']>span.form-button').attr('data-follow','true');
	      		  
        },
        error: function (err) {
          that.following = false;
          //that.displayError(i18n.t('message.error'));
          console.log(i18n.t('message.error'));
        }
      });          

            
    }
  },  


  onClose : function() {
    this.undelegateEvents();

    this.players.off('sync', this.renderList, this);
  }
});
