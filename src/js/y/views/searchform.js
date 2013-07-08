Y.Views.SearchForm = Y.View.extend({
  el:"#content",
    
  events: {
  
    'click #updateSearch':'update',
    'keyup #club': 'updateList',
    "click #searchgeo":"update",
    "click #searchmyclub":"update", 
    "click #searchplayerfollowed":"update",        
    'click #club_choice' : 'displayClub',
    'click #linkprofil' : 'goProfil'
      
  },
  

  pageName: "searchForm",
  pageHash : "search/form",  
    
  clubs:null,
  useSearch:null,
  
  shareTimeout: null,    

  myinitialize:function() {

	//header
    Y.GUI.header.title(i18n.t('search.title')); 
    
    //no search
    this.useSearch=0;
  
    //this.gameFormTemplate = Y.Templates.get('gameForm');
    //this.clubListAutoCompleteViewTemplate = Y.Templates.get('clubListAutoComplete');
    
  	this.templates = {
	    searchform:  Y.Templates.get('searchForm')
	  };    
    
    this.owner = Y.User.getPlayer();    
    this.token = this.owner.get('token');
    this.playerid = this.owner.get('id');  
    //this.clubid = this.owner.get('club').id;
    
	this.render();
  
  },
   
      
  update: function (event) {
    
    if (event.currentTarget.id === 'searchmyclub' && $("#searchmyclub span").hasClass('disabled')==false) {
      $('#searchmyclub span').toggleClass('checked');
      Y.User.setFiltersSearch(event.currentTarget.id);
      
      var filters = Y.User.getFiltersSearch();
    
      if (filters.indexOf('searchgeo')!==-1) {
        $('#searchgeo span').toggleClass('checked');
        Y.User.setFiltersSearch('searchgeo'); 
      }      
    }
    
    if (event.currentTarget.id === 'searchgeo' && $("#searchgeo span").hasClass('disabled')==false) {
      $('#searchgeo span').toggleClass('checked');
      Y.User.setFiltersSearch(event.currentTarget.id);
      
      var filters = Y.User.getFiltersSearch();
    
      if (filters.indexOf('searchmyclub')!==-1) {
        $('#searchmyclub span').toggleClass('checked');
        Y.User.setFiltersSearch('searchmyclub');         
      }      
    }    

    if (event.currentTarget.id === 'searchplayerfollowed' && $("#searchplayerfollowed span").hasClass('disabled')==false) {
      $('#searchplayerfollowed span').toggleClass('checked');
      Y.User.setFiltersSearch(event.currentTarget.id);   
    }  
      
  },
       
  goProfil: function(){
    Y.Router.navigate('players/form/search', {trigger: true});  	    
  },
	
  //render the content into div of view
  render: function(){
  	
  	var gps_state = "";
    if (Y.Geolocation.longitude!==null && Y.Geolocation.latitude!==null)	
    {
  	  long = Math.floor(Y.Geolocation.longitude*10000)/10000;
  	  lat = Math.floor(Y.Geolocation.latitude*10000)/10000;
  	  
  	  gps_state = long+","+lat;
  	}
  	else {
  	  gps_state = i18n.t('search.gpsoff');
  	}
  	
  	var clubname='';
	if (this.owner.get('club') !== undefined ) {
	  if (this.owner.get('club').name !== '')
		clubname = this.owner.get('club').name;
	}  	
  	
  	
    this.$el.html(this.templates.searchform({gps:gps_state,clubname:clubname}));
  
    this.$el.i18n();
    
    $(".filters a[data-filter*='match-']").removeClass('select');
    
    var filters = Y.User.getFiltersSearch();
    
    if (filters!=undefined) {
	    if (filters.indexOf('searchgeo')!==-1) {
	      $('#searchgeo span').addClass('checked');		        
	    } 
	    if (filters.indexOf('searchmyclub')!==-1) {
	      $('#searchmyclub span').addClass('checked');
	 	}
	    if (filters.indexOf('searchplayerfollowed')!==-1) {
	      $('#searchplayerfollowed span').addClass('checked');
	 	}
 	} 	
 	
 	if (Y.Geolocation.longitude===null || Y.Geolocation.latitude===null)
	{
	  $('#searchgeo span').removeClass('checked');
	  $("#searchgeo span").addClass("disabled");  
	}	  
 
	if (this.owner.get('club') !== undefined ) {
	  if (this.owner.get('club').name === '') {
	    $('#searchmyclub span').removeClass('checked');
        $("#searchmyclub span").addClass("disabled"); 
      }
    }
    else {
	    $('#searchmyclub span').removeClass('checked');	
        $("#searchmyclub span").addClass("disabled");     
    } 	 	   
  },

  onClose: function(){
    this.undelegateEvents();
    
    if (this.shareTimeout) {
      window.clearTimeout(this.shareTimeout);
      this.shareTimeout = null;
    }    
  }
});