Y.Views.Pages.Players = Y.View.extend({
  el : "#content",

  events : {
    "keyup input#search-basic": "searchOnKey",  
    //"blur input#search-basic": "searchOnBlur",
    "click div.ui-block-a": "choosePlayer",
    "click div.ui-block-b": "choosePlayer",
    "click div.ui-block-c": "followPlayer"
  },

  listview : "#listPlayersView",

  pageName: "playerList",
  pageHash : "players/list", 
  // one by one
  following: false,
  dataid:"",
  datafollow:"",
  
  myinitialize : function(param) {
    
    // saving parameter
    this.param = param || {};
      
    //header
    if (this.param.mode === 'follow')    
      Y.GUI.header.title(i18n.t('playerlist.titlemypushs')); 
    else
      Y.GUI.header.title(i18n.t('playerlist.title'));
      
    // loading templates.
    this.templates = {
      list            : Y.Templates.get('list-player'),
      listnotification: Y.Templates.get('list-player-notification'),
      page            : Y.Templates.get('page-players'),
      pagepush        : Y.Templates.get('page-players-push'),      
      error           : Y.Templates.get('module-error'),
      ongoing         : Y.Templates.get('module-ongoing')
    };
    
    // we render immediatly
    this.render();  
    
    var players = Y.User.getPlayer().get('following');
    this.players_follow = players;      
    
    if ( Y.User.getPlayer().get('nopush') !== undefined ) {
      this.players_nopush = Y.User.getPlayer().get('nopush');
    }
    else {
      this.players_nopush = [];
    }
    
    this.myid = Y.User.getPlayer().get('id');
    this.mytoken = Y.User.getPlayer().get('token'); 

    //load players via localstorage
    if (this.param.mode === 'follow') {
      if (players!==undefined) {
        this.playerLast = players[players.length-1];
      this.collection = new PlayersCollection();  
      var that = this;  
      var i = players.length;  
      
      if (players.length<1) {
        $(this.listview).html(this.templates.list({
          players:[]
          , query:' '
          , players_follow : this.players_follow
          , players_nopush : this.players_nopush          
          , playersImgUrl:[]
        })).i18n();              
      }      
      
      this.syncPlayer = function (player) { 
        that.collection.add(player);
        
        i--;
        that.playersImgUrl[i] = player.getImageUrlOrPlaceholder();
        //console.log(that.playersImgUrl[i]);
        
        //si dernier element du tableau
        if (that.playerLast === player.get('id')) {
          $(that.listview).html(that.templates.listnotification({
            players:that.collection.toJSON()
            , query:' '
            , players_follow : this.players_follow
            , players_nopush : this.players_nopush               
            , playersImgUrl : that.playersImgUrl 
          })).i18n();    
        }             
      };      
      
      this.players = [];
      this.playersImgUrl = [];
      
      players.forEach(function (playerid,index) {  
        var player = new PlayerModel({id : playerid});          
        player.once("sync", this.syncPlayer, this);
          
        player.fetch().fail(function (xhrResult, error) {          
          if (players.indexOf(playerid) !== -1) {
            players.splice(players.indexOf(playerid), 1);
            //On retire le joueur qui existe plus              
            //Y.Conf.set("owner.players.followed", players, { permanent: true });
            var data = {id: that.myid, following: that.players };
            Y.User.updatePlayer(data);
              
            if (players.length<1) {
              $(that.listview).html(that.templates.list({
                players:[]
                , query:' '
                , playersImgUrl:[]
              }));
              $(that.listview).i18n();              
            }
            else
              this.playerLast = players[players.length-1];      
          }
         });         

         this.players[index] = player;  
                    
     },this);
    }
    else {   
      $(this.listview).html(this.templates.list({
        players:[]
        , query:' '
        , players_follow : this.players_follow
        , players_nopush : this.players_nopush           
        , playersImgUrl:[]
      })).i18n();
    }  
  }
  else {
    // renderList
      if (this.param.clubid !== 'null') {
        this.players = new PlayersCollection();
        this.players.setMode('club', this.param.clubid);
        this.players.once('sync', this.renderList, this);           
        this.players.fetch();
      }
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
      this.inputModeOff();
      this.searchPlayers();
    }
    return this;
  },

  //searchOnBlur: function (event) {
  //  this.searchPlayers();
  //  return this;
  //},   

  searchPlayers:function() {
    var q = $("#search-basic").val();
    $(this.listview).html(this.templates.error()); 
    this.players = new PlayersCollection();       
    this.players.setMode('search',q);
    
    this.playersImgUrl = [];
    
    this.players.fetch().done($.proxy(function () {
     
      if (this.players.toJSON().length === 0) {
        $(this.listview).html(this.templates.error());
      }
      else {
        this.renderList(q);
      }}, this));
    
    this.$el.i18n();
    
    return this;
  },

  // render the content into div of view
  render : function() {
    if (this.param.mode === 'follow') {
      this.$el.html(this.templates.pagepush({})).i18n();
    }
    else {
      this.$el.html(this.templates.page({})).i18n();    
    }
    
    return this;
  },

  renderList : function(q) {

    var i = 0;
    var that = this;
    this.playersImgUrl = [];
    
    this.players.forEach(function (playerid,index) { 
      //console.log(that.players.get(playerid).toJSON());
      //console.log(that.players.get(playerid).getImageUrlOrPlaceholder());
      that.playersImgUrl[i] = that.players.get(playerid).getImageUrlOrPlaceholder();
      i++;
    });  
  
    $(this.listview).html(this.templates.list({
      players : this.players.toJSON()
      , query : q
      , players_follow : this.players_follow
      , players_nopush : this.players_nopush      
      , playersImgUrl : this.playersImgUrl
    }));
    this.$el.i18n();
    
    return this;
  },

  followPlayer: function(elmt) {
  
    this.dataid = $(elmt.currentTarget).data('playerid');
    this.datafollow = $(elmt.currentTarget).data('follow');
            
    if (this.myid === this.dataid) return;
    
    if (this.following)
      return;   
    
    var that = this;
         
    if (this.datafollow === true) {
    
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
        $('.ui-block-c[data-playerid='+that.dataid+']>span.form-button').html(i18n.t('playerlist.addpush'));
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

       navigator.notification.confirm(
        i18n.t('message.pushmessage'),  // message
        function(buttonIndex){
            that.followPlayerConfirm(buttonIndex, that);
        },         // callback
        i18n.t('message.pushtitle'),            // title
        i18n.t('message.pushyes')+','+i18n.t('message.pushno')                  // buttonName
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
        $('.ui-block-c[data-playerid='+that.dataid+']>span.form-button').html(i18n.t('playerlist.delpush'));
        //change attribute data-follow
        $('.ui-block-c[data-playerid='+that.dataid+']').data('follow',true); 
        //$('.ui-block-c[data-playerid='+that.dataid+']>span.form-button').attr('data-follow','true');
        $('.ui-block-b[data-playerid='+that.dataid+']>div.infos>div.push').html('Notification : ON');
              
        },
        error: function (err) {
          that.following = false;
          //that.displayError(i18n.t('message.error'));
          console.log(i18n.t('message.error'));
        }
      });          

            
    }
    else {
      
      if (that.players_follow !== undefined)
      {
        if (that.players_follow.indexOf(that.dataid) === -1) {     
          that.players_follow.push(that.dataid);
          that.players_nopush.push(that.dataid);
          var data = {id: that.myid, following: that.players_follow, nopush: that.players_nopush };
          Y.User.updatePlayer(data); 
        }
      }
      else {
        var data = {id: that.myid, following: [that.dataid], nopush: [that.dataid]  };            
        Y.User.updatePlayer(data); 
      }
      
      //change text
      $('.ui-block-c[data-playerid='+that.dataid+']>span.form-button').html(i18n.t('playerlist.delpush'));
      //change attribute data-follow
      $('.ui-block-c[data-playerid='+that.dataid+']').data('follow',true); 
      //$('.ui-block-c[data-playerid='+that.dataid+']>span.form-button').attr('data-follow','true');
      $('.ui-block-b[data-playerid='+that.dataid+']>div.infos>div.push').html('Notification : OFF');
    
    }
  },  


  onClose : function() {
    this.undelegateEvents();

    if (this.param.mode === 'follow') {    
      if (this.players!==undefined) {
        this.players.forEach(function (player) {
         player.off("sync", this.syncPlayer, this);
        }, this);
      }
    }
    else {
      this.players.off('sync', this.renderList, this);  
    }   
  }
  
});
