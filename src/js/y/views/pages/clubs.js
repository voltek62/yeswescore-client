Y.Views.Pages.Clubs = Y.View.extend({
  el:"#content",
  
  events: {
    "keyup input#search-clubs": "searchOnKeyClub",
    //"blur input#search-basic": "searchOnBlur",      
    "click div.ui-block-a": "chooseClub",
    "click div.ui-block-b": "chooseClub",
    "click div.ui-block-c": "followClub" 
  },

  listview:"#listClubsView",  
  
  pageName: "clubList",
  pageHash : "clubs/list",
  // one by one
  following: false,
  dataid:"",
  datafollow:"",  

  myinitialize:function(param) {
  
    // saving parameter
    this.param = param || {};    

    //header      
    if (this.param.mode === 'follow')    
      Y.GUI.header.title(i18n.t('clubfollow.title')); 
    else
      Y.GUI.header.title(i18n.t('clublist.title'));  

    // loading templates.
    this.templates = {
      list      : Y.Templates.get('list-club'),
      page      : Y.Templates.get('page-clubs'),
      error     : Y.Templates.get('module-error'),
      usesearch : Y.Templates.get('module-use-search'),      
      ongoing   : Y.Templates.get('module-ongoing') 
    };
    
    this.render();
       
    var clubs = Y.Conf.get("owner.clubs.followed");
    if (typeof clubs !== "undefined")
      this.clubs_follow = clubs;   
    else
       this.clubs_follow = [];    
    this.myid = Y.User.getPlayer().get('id');
    this.mytoken = Y.User.getPlayer().get('token'); 
    	
    //load clubs via localstorage
    if (this.param.mode === 'follow') {       
	  if (clubs!==undefined) {
	    this.clubLast = clubs[clubs.length-1];
	    this.collection = new ClubsCollection();
	    var that = this;
	    var i = clubs.length;
	      
	    if (clubs.length<1) {
	      $(this.listview).html(this.templates.list({
	        clubs:[]
	        , query:' '
	        , clubs_follow : this.clubs_follow
	      })).i18n();
	    }
	      
	    this.syncClub = function (club) {
	      that.collection.add(club);
	      i--;
	      //si dernier element du tableau
	      if (that.clubLast === club.get('id')) {        
	        $(that.listview).html(that.templates.list({
	          clubs:that.collection.toJSON()
	          , query:' '
	          , clubs_follow : this.clubs_follow
	        })).i18n();
	      }
	    };
	    
	    this.clubs = [];
	    clubs.forEach(function (clubid,index) {
	      var club = new ClubModel({id : clubid});
	      club.once("sync", this.syncClub, this);
	      club.fetch().fail(function (xhrResult, error) {
	        if (clubs.indexOf(clubid) !== -1) {
	          clubs.splice(clubs.indexOf(clubid), 1);
	          //On retire le club qui n'existe plus  
	          Y.Conf.set("owner.clubs.followed", clubs, { permanent: true });
	            
	          if (clubs.length<1) {
	            $(that.listview).html(that.templates.list({
	              clubs:[]
	              , query:' '
	              , clubs_follow : this.clubs_follow
	            })).i18n();
	            
	          
	          } else 
	            this.clubLast = clubs[clubs.length-1];
	        
	        }
	      });
	      
	      this.clubs[index] = club;
	      
	    },this);
	  }
	  else {
	    $(this.listview).html(this.templates.list({
	      clubs:[]
	      , query:' '
	      , clubs_follow : this.clubs_follow
	    })).i18n();
	    
	  }
    }
    else {
      this.clubs = new ClubsCollection();
      this.clubs.once('sync', this.renderList, this);           
      this.clubs.fetch();   
    }
    
  },
  
  chooseClub : function(elmt) { 
    var href= $(elmt.currentTarget).data('href');

    if (href) {
      var route = href;
      Y.Router.navigate(route, {trigger: true}); 
    }  
  },  
  

  searchOnKeyClub: function (event) {

    if(event.keyCode == 13){
      // the user has pressed on ENTER
      this.inputModeOff();  
      this.searchClubs();
    }
    return this;
  },

  searchClubs:function() {
    
    var q = $("#search-clubs").val();
    $(this.listview).html(this.templates.error());
    $('p').i18n();
    this.clubs = new ClubsCollection();
    this.clubs.setMode('search',q);
    this.clubs.fetch().done($.proxy(function () {
      if (this.clubs.toJSON().length === 0) {
        $(this.listview).html(this.templates.error());
      }
      else
        $(this.listview).html(this.templates.list({ 
          clubs: this.clubs.toJSON()
          , query: q
          , clubs_follow : this.clubs_follow           
        }));
      
      $(this.listview).i18n();
    }, this));
    return this;
  },

  //render the content into div of view
  render: function(){
    this.$el.html(this.templates.page({})).i18n(); 
    return this;
  },

  renderList: function(query) {
    $(this.listview).html(this.templates.list({
      clubs:this.collection.toJSON()
      , query:' '
      , clubs_follow : this.clubs_follow    
    }));

    return this;
  },
  
  followClub: function(elmt) {
  
    this.dataid = $(elmt.currentTarget).data('clubid');
    this.datafollow = $(elmt.currentTarget).data('follow');
    
    if (this.following)
      return;   
    
    var that = this;
         
    if (this.datafollow === true) {
    
      console.log('datafollow true');

      if (this.clubs_follow !== undefined)
      {
        if (this.clubs_follow.indexOf(this.dataid) !== -1) {
          //On retire l'elmt
          this.clubs_follow.splice(this.clubs_follow.indexOf(this.dataid), 1);
          Y.Conf.set("owner.clubs.followed", this.clubs_follow, { permanent: true });

		  //change text
		  $('.ui-block-c[data-clubid='+this.dataid+']>span.form-button').html(i18n.t('clublist.follow'));
		  $('.ui-block-c[data-clubid='+this.dataid+']').data('follow',false);          
        }
      }
	  /*
	  FIX if we save following clubs on mongo
	  this.following = true;
	  Backbone.ajax({
        dataType: 'json',
		url: Y.Conf.get("api.url.clubs") +this.myid+"/following/?playerid="+this.myid+"&token="+this.mytoken+"&_method=delete",
		type: 'POST',
		data: {
		  id: this.dataid
		},
		success: function (data) {
		that.following = false;
		      
		//On supprime l'id
		if (that.clubs_follow !== undefined)
		{
		  if (that.clubs_follow.indexOf(that.dataid) !== -1) {
		  //On retire l'elmt
		    that.clubs_follow.splice(that.clubs_follow.indexOf(that.dataid), 1);
		    var data = {id: that.myid, following: that.clubs_follow };
		    Y.User.updatePlayer(data);
		  }
		}
		    
		//change text
		$('.ui-block-c[data-clubid='+that.dataid+']>span.form-button').html(i18n.t('message.follow'));
		$('.ui-block-c[data-clubid='+that.dataid+']').data('follow',false);
		      
		},
		error: function (err) {
		  that.following = false;
		  //that.displayError(i18n.t('message.error'));
		  console.log(i18n.t('message.error'));
		}
	  });
      */      
      
    } else {  
        console.log('datafollow false');
        
	    if (this.clubs_follow !== undefined)
	    {
	      if (this.clubs_follow.indexOf(this.id) === -1) {
	        this.clubs_follow.push(this.dataid);
	        Y.Conf.set("owner.clubs.followed", this.clubs_follow, { permanent: true });
	      }
	    }
	    else
	      Y.Conf.set("owner.clubs.followed", [this.dataid]);
	      
		//change text
		$('.ui-block-c[data-clubid='+this.dataid+']>span.form-button').html(i18n.t('clublist.nofollow'));
		$('.ui-block-c[data-clubid='+this.dataid+']').data('follow',true);   	              
    }  
  
  },   

  onClose: function() {
    this.undelegateEvents();
    
    if (this.param.mode === 'follow') {        
      if (this.clubs!==undefined) {
        this.clubs.forEach(function (club) {
          club.off("sync", this.syncClub, this);
        }, this);
      }
    }
    else {
      this.clubs.off('sync', this.renderList, this);  
    }         
  }
  
});