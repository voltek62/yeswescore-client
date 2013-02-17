var PlayerFormView = Backbone.View.extend({
  el:"#index",
    
  events: {
    'submit form#frmAddPlayer':'add',
    'keyup #club': 'updateList',
    'click #club_choice' : 'displayClub'
  },
  
  listview:"#suggestions",
    
  clubs:null,

  initialize:function() {	
    this.playerFormTemplate = Y.Templates.get('playerFormTemplate');
    this.clubListAutoCompleteViewTemplate = Y.Templates.get('clubListAutoCompleteViewTemplate');
    	
    //this.player = new Player({id:this.Owner.id});
    //this.player.fetch(); 
    	
    this.renderPlayer();
    	
    //this.player.on( 'change', this.renderPlayer, this );  	 	
    $.mobile.hidePageLoadingMsg();
  },
  
  updateList: function (event) {
    var q = $("#club").val();

    console.log('updateList');	  
   	//Utiliser ClubListViewTemplate
    //$(this.listview).html('<li><a href="" data-transition="slide">Club 1</a></li>');    	
    this.clubs = new Clubs();
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
           

    player = new Player({
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
    //Backbone.Router.navigate('#players/add');
    return false;
  },     
    

  //render the content into div of view
  renderPlayer: function(){
    	
    Owner = JSON.parse(window.localStorage.getItem("Owner"));	
    //console.log('Owner',Owner);
      
    var dataDisplay = {
	      name:Owner.name
	    , nickname:Owner.nickname
	    , email:Owner.email
	    , rank:Owner.rank
	    , password:Owner.password
	    , idlicense:Owner.idlicense
	    , playerid:Owner.id
	    , token:Owner.token
    };
      
    if (Owner.club!== undefined) {    
      dataDisplay.club = Owner.club.name;
      dataDisplay.idclub = Owner.club.id;      	
    }
      
    //player:this.player.toJSON(),playerid:Owner.id,token:Owner.token	
    this.$el.html(this.playerFormTemplate(dataDisplay));
    this.$el.trigger('pagecreate');
    return this;
  },

  onClose: function(){
    this.undelegateEvents();
    //this.player.off("change",this.renderPlayer,this); 
  }
});