Y.Views.PlayerForm = Y.View.extend({
  el:"#content",
    
  events: {
    'click #savePlayer':'add',
    'keyup #club': 'updateList',
    'click #club_choice' : 'displayClub'
  },
  
  listview:"#suggestions",

  pageName: "playerForm",
  pageHash : "players/form",  
    
  clubs:null,
  useSearch:0,	     

  myinitialize:function() {
  
    this.player = null;  
    this.useSearch = 0;	
          
	//header
    Y.GUI.header.title(i18n.t('playerform.title')); 
  
    // loading templates.
    this.templates = {
      layout: Y.Templates.get('empty'),
      playerform:  Y.Templates.get('playerForm'),
      clublist: Y.Templates.get('clubListAutoComplete')
    };
       
    this.owner = Y.User.getPlayer();    
    this.token = this.owner.get('token');
    this.playerid = this.owner.get('id');
    this.clubid = this.owner.get('club').id;
    
    //console.log('clubid',this.clubid);
    
    // we render immediatly
    this.render();    
    
    this.player = new PlayerModel({id : this.owner.id});
    this.player.once("sync", this.renderPlayer, this);	
    this.player.fetch();
     	

  },
  
  
  updateList: function (event) {
    var q = $("#club").val();
   	
    this.clubs = new ClubsCollection();
    this.clubs.setMode('search',q);
    if (q.length>2) {
      this.useSearch=1;
      this.clubs.fetch();
      this.clubs.on( 'sync', this.renderList, this );
    }

  },
  
  
  render: function () {
    // empty page.
	  this.$el.html(this.templates.layout());
	  return this;
  },
  
    
  renderList: function () {
    var q = $("#club").val();  	
  	
	$(this.listview).html(this.templates.clublist({clubs:this.clubs.toJSON(), query:q}));

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
  },
      
  add: function (event) {
  
    //$.ui.toggleNavMenu(true);
  
    var name = $('#name').val()
      , nickname = $('#nickname').val()
      , password = $('#password').val()
      , email = $('#email').val()
      , rank = $('#rank').val()
      , playerid = this.playerid
      , token = this.token
      , club = $('#club').val()
      , clubid = this.clubid
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

	//FIXME :  control state
    player.save();
   
    return false;
  },     
    

  //render the content into div of view
  renderPlayer: function(){
    	
    player = this.player.toJSON();
    
    var dataDisplay = {
	      name:player.name
	    , nickname:player.nickname
	    , rank:player.rank
	    , password:player.password
	    , idlicense:player.idlicense
	    , playerid:this.playerid
	    , token:this.token
    };
      
    if (player.club!== undefined) {    
      dataDisplay.club = player.club.name;
      dataDisplay.idclub = player.club.id;      	
    }
    
    if (player.email!== undefined) {    
      dataDisplay.email = player.email.address;    
    }
    else 
      dataDisplay.email = '';
    

    this.$el.html(this.templates.playerform(dataDisplay));

	this.$el.i18n();

    return this;
  },

  onClose: function(){
    this.undelegateEvents();
    
    this.player.off("sync", this.renderPlayer, this);	
    if (this.useSearch===1) this.clubs.off( "sync", this.renderList, this );
  }
});