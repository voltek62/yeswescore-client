Y.Views.PlayerForm = Y.View.extend({
  el:"#content",
    
  events: {
    'click #savePlayer':'add',
    'click #getPhoto' : 'getPhoto',
    'keyup #club': 'updateList',
    'click #club_choice' : 'displayClub'
  },
  
  listview:"#suggestions",

  pageName: "playerForm",
  pageHash : "players/form",  
    
  clubs:null,
  useSearch:0,	     
  mode:'',

  myinitialize:function(obj) { 
    this.useSearch = 0;	
    this.mode = obj.mode;
  
	  //header
    Y.GUI.header.title(i18n.t('playerform.title')); 
  
    // loading templates.
    this.templates = {
      layout: Y.Templates.get('empty'),
      playerform:  Y.Templates.get('playerForm'),
      clublist: Y.Templates.get('clubListAutoComplete')
    };
    
    this.player = Y.User.getPlayer();
    this.clubid = this.player.get('club').id;
    this.player.once("sync", this.renderPlayer, this);	
    this.player.fetch();
    
    //$('#content').addClass('blue-screen background');
	Y.GUI.addBlueBackground();
	
    // we render immediatly
    this.render();
  },
  
  autocompleteClubs: function (input, callback) {
    if (input.indexOf('  ')!==-1 || input.length<= 1 )
      callback('empty');		
    
    Backbone.ajax({
      url: Y.Conf.get("api.url.autocomplete.clubs"),
      type: 'GET',
      dataType : 'json',
      data: { q: input }
    }).done(function (clubs) {
      if (clubs && _.isArray(clubs) && clubs.length>0) {
        callback(null, clubs.splice(0, 3).map(function (p) { p.text = p.name; return p; }));
      } else {
        callback(null, []);
      }
    }).fail(function (xhr, error) { 
      callback(error);
    });
  },

  autocompleteChoose: function (data) {
    if (data && data.name) {
      this.$("#club").val(data.name);
      this.clubid = data.id;
      this.$('club_error').html('');      
    }
  },
    
  /*  
  
  displayClub: function(li) {
    selectedId = $('#club_choice:checked').val();
    selectedName = $('#club_choice:checked').next('label').text();
    	
    $('#club').val(selectedName);
    //FIXME : differencier idclub et fftid
    $('#clubid').val(selectedId); 
    $('club_error').html('');
    	
   
    	
    $(this.listview).html('');
  },  
  
  updateList: function (event) {
    var q = $("#club").val();
   	
    this.clubs = new ClubsCollection();108
    this.clubs.setMode('search',q);
    if (q.length>2) {
      this.useSearch=1;
      this.clubs.fetch();
      this.clubs.on( 'sync', this.renderList, this );
    }

  },
  
  */
  
  render: function () {
    // empty page.
	  this.$el.html(this.templates.layout());
    this.$(".container").addClass(this.mode);
	  return this;
  },
  
  renderList: function () {
    var q = $("#club").val();  	
	  $(this.listview).html(this.templates.clublist({clubs:this.clubs.toJSON(), query:q}));
  },
  
  add: function (event) {
    var name = $('#name').val()
      , rank = $('#rank').val().replace(/ /g, "")
      , playerid = this.playerid
      , token = this.token
      , club = $('#club').val()
      , clubid = this.clubid
      , idlicence = $('#idlicence').val()
      , player = null;
      
    //On cache toutes les erreurs 
    $("div.success").hide();

    if (checkRank(rank) && rank.length>0) {
	    $('.rank_error').html(i18n.t('message.bad_rank')+' !').show();
      $('#rank').val('');        
      return false;	   
    };
    
    if (name.length==0) {
	    $('.name_error').html(i18n.t('message.empty_name')+' !').show();      
      return false;	   
    };
    
    if (checkName(name) && name.length>0) {
	    $('.name_error').html(i18n.t('message.bad_name')+' !').show();
      $('#name').val('');        
      return false;	   
    };

    if (checkLicence(idlicence) && idlicence.length>0) {
	    $('.idlicence_error').html(i18n.t('message.bad_licence')+' !').show();
      $('#idlicence').val('');        
      return false;	   
    };

    if (checkName(club) && club.length>0) {
	    $('.club_error').html(i18n.t('message.bad_name')+' !').show();
      $('#club').val('');        
      return false;	   
    };
    
    var that = this;
    var player = Y.User.getPlayer();
    player.set('name', name);
    player.set('rank', rank);
    player.set('idlicence', idlicence);
    player.set('club', club);
    player.set('clubid', clubid);

	  //FIXME :  add control error
    player.save().done(function (result) {
      $('div.success').css({display:"block"});
      $('div.success').html(i18n.t('message.updateok')).show();
		  $('div.success').i18n();
		  Y.User.setPlayer(new PlayerModel(result));
		  if (that.mode === 'first') {
		    Y.Router.navigate("games/add", {trigger: true});  	   
		  }
		  else if (that.mode === 'search') {
		    Y.Router.navigate("search/form", {trigger: true});  	   
		  }		  
		  else {
		    Y.Router.navigate("account", {trigger: true});
    	}
    });
   
    return false;
  },     
    

  //render the content into div of view
  renderPlayer: function(){
    player = this.player.toJSON();
        
    var dataDisplay = {
	      name:player.name
	    , rank:player.rank
	    , idlicence:player.idlicense
	    , playerid:this.playerid
	    , token:this.token
    };
      
    if (player.club!== undefined) {    
      dataDisplay.club = player.club.name;
      dataDisplay.idclub = player.club.id;      	
    }
    
    this.$el.html(this.templates.playerform({data : dataDisplay}));

    this.$(".container").addClass(this.mode);

	this.$el.i18n();

    return this;
  },
  
 
  createImage: function(src) {
    var deferred = $.Deferred();
    var img = new Image();

    img.onload = function() {
        deferred.resolve(img);
    };
    img.src = src;
    return deferred.promise();
  },
  
    /*
     * Draw the image object on a new canvas and half the size of the canvas
     * until the darget size has been reached
     * Afterwards put the base64 data into the target image
     */
    resize : function (image) {
        mainCanvas = document.createElement("canvas");
        mainCanvas.width = 50;
        mainCanvas.height = 50;
        var ctx = mainCanvas.getContext("2d");
        
        var img=document.getElementById("smallImage");
        ctx.drawImage(img, 0, 0, mainCanvas.width, mainCanvas.height);
		//ctx.drawImage(img,10,10);
        
        //size = 50;
        //while (mainCanvas.width > size) {
        //  mainCanvas = this.halfSize(mainCanvas);
        //}
        $('#resizedImage').attr('src', mainCanvas.toDataURL("image/jpeg"));
    },

    /*
     * Draw initial canvas on new canvas and half it's size
     */
    halfSize : function (i) {
        var canvas = document.createElement("canvas");
        canvas.width = i.width / 2;
        canvas.height = i.height / 2;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(i, 0, 0, canvas.width, canvas.height);
        return canvas;
    },
     
  getPhoto: function(){
  
    var that = this;
  	Cordova.Camera.capturePhoto(function (img) {
	  
	  //"data:image/jpeg;base64," + 
      var src = "data:image/jpeg;base64," + img;
      $('#smallImage').attr("src", src);
      $('#smallImage').attr("width", "100");  
      $('#smallImage').attr("height", "56");      
	  that.resize(src);


      var client = new Dropbox.Client({key: 'ih29psalnsrenj6'});

      // Try to finish OAuth authorization.
	  client.authenticate({interactive: false}, function (error) {
	    if (error) {
		  alert('Authentication error: ' + error);
		}
	  });
		
	  if (client.isAuthenticated()) {
	    // Client is authenticated. Display UI.
	    console.log('dropbox authentificated');
	  }
	  else
	    console.log('dropbox not authentificated');
	    
	    
 
        	  
  	});
  
  },  

  onClose: function(){
    this.undelegateEvents();
    
    Y.GUI.delBlueBackground(); 
    
    this.player.off("sync", this.renderPlayer, this);	
    if (this.useSearch===1) this.clubs.off( "sync", this.renderList, this );
  }
});