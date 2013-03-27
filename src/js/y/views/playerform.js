var PlayerFormView = Backbone.View.extend({
  el:"#content",
    
  events: {
    'submit form#frmAddPlayer':'add',
    'keyup #club': 'updateList',
    'click #club_choice' : 'displayClub',
    'click input' :'hideFooter'   
  },
  
  listview:"#suggestions",

  pageName: "playerForm",
  pageHash : "players/form",  
    
  clubs:null,
     

  initialize:function() {
          
    $.ui.setBackButtonVisibility(true);
    $.ui.setBackButtonText("&lt;");
    $.ui.setTitle("MON PROFIL");
  
    this.playerFormTemplate = Y.Templates.get('playerFormTemplate');
    this.clubListAutoCompleteViewTemplate = Y.Templates.get('clubListAutoCompleteViewTemplate');
    
    this.Owner = Y.User.getPlayer();
    //this.pageHash += this.Owner.id; 
        	
    this.player = new PlayerModel({id:this.Owner.id});
    this.player.fetch(); 
    	
    this.player.on( 'change', this.renderPlayer, this );  	 	

  },
  
  
  hideFooter:function() {
  	console.log('hideFooter');
  	$.ui.toggleNavMenu(false);
  },  
  
  showFooter:function() {
  	console.log('showFooter');
  	//$.ui.toggleNavMenu(true);
  },   
  
  updateList: function (event) {
    var q = $("#club").val();

    //console.log('updateList');	  
   	//Utiliser ClubListViewTemplate
    //$(this.listview).html('<li><a href="" data-transition="slide">Club 1</a></li>');    	
    this.clubs = new ClubsCollection();
    this.clubs.setMode('search',q);
    if (q.length>2) {
      this.clubs.fetch();
      this.clubs.on( 'all', this.renderList, this );
    }
    //$(this.listview).listview('refresh');
  },
    
  renderList: function () {
    var q = $("#club").val();
    	
    console.log(this.clubs.toJSON());
    	
	  $(this.listview).html(this.clubListAutoCompleteViewTemplate({clubs:this.clubs.toJSON(), query:q}));
	  $(this.listview).listview('refresh');
  },
    
    
  displayClub: function(li) {
    selectedId = $('#club_choice:checked').val();
    selectedName = $('#club_choice:checked').next('label').text();
    	
    $('#club').val(selectedName);
    //FIXME : differencier idclub et fftid
    $('#clubid').val(selectedId); 
    $('club_error').html('');
    	
    //console.log('selected '+selectedId+' '+selectedName);
    	
    $(this.listview).html('');
    $(this.listview).listview('refresh');
  },
      
  add: function (event) {
  
    $.ui.toggleNavMenu(true);
  
    var name = $('#name').val()
      , nickname = $('#nickname').val()
      , password = $('#password').val()
      , email = $('#email').val()
      , rank = $('#rank').val()
      , playerid = $('#playerid').val()
      , token = $('#token').val()
      , club = $('#club').val()
      , clubid = $('#clubid').val()
      , idlicense = $('#idlicense').val()
      , player = null;
           

    var player = new PlayerModel({
        name: name
      , nickname: nickname
      , password: password
      , email: email
      , rank: rank                  	
      , playerid: playerid
      , idlicense:idlicense
      , token: token
      , club: club
      , clubid:clubid            
    });

    console.log('player form envoie ',player.toJSON());

    player.save();
   
    return false;
  },     
    

  //render the content into div of view
  renderPlayer: function(){
    	
    var dataDisplay = {
	      name:this.Owner.name
	    , nickname:this.Owner.nickname
	    , rank:this.Owner.rank
	    , password:this.Owner.password
	    , idlicense:this.Owner.idlicense
	    , playerid:this.Owner.id
	    , token:this.Owner.token
    };
      
    if (this.Owner.club!== undefined) {    
      dataDisplay.club = this.Owner.club.name;
      dataDisplay.idclub = this.Owner.club.id;      	
    }
    
    if (this.Owner.email!== undefined) {    
      dataDisplay.email = this.Owner.email.address;    
    }
    
    //player:this.player.toJSON(),playerid:Owner.id,token:Owner.token	
    this.$el.html(this.playerFormTemplate(dataDisplay));
    //this.$el.trigger('pagecreate');
    return this;
  },

  onClose: function(){
    this.undelegateEvents();
    this.player.off("change",this.renderPlayer,this); 
  }
});