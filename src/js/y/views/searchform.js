Y.Views.SearchForm = Y.View.extend({
  el:"#content",
    
  events: {
  
    'click #updateSearch':'update',
    'keyup #club': 'updateList',
    "click #searchgeo":"update",
    "click #searchmyclub":"update", 
    "click #searchgamefollowed":"update",        
    'click #club_choice' : 'displayClub',
    'click #linkprofil' : ''
      
  },
  

  pageName: "searchForm",
  pageHash : "search/form",  
    
  clubs:null,
  useSearch:null,
  
  shareTimeout: null,    

  initialize:function() {

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
    this.clubid = this.owner.get('club').id;

	this.render();
  
  },
   
      
  update: function (event) {

	console.log("event: "+event.currentTarget.id);
	//console.log("state: ",event.currentTarget);	

    /*
	if (o==='geolocation') 
      $('.filters #filter-match-geo').addClass('select');
 	
 	if (o==='not') 
  	  $('.filters #filter-match-not').addClass('select'); 
 	
 	if (o==='club') 
      $('.filters #filter-match-club').addClass('select'); 
      */
      
    Y.User.setFiltersSearch(event.currentTarget.id);         

    
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
  	
    this.$el.html(this.templates.searchform({gps:gps_state}));
  
    this.$el.i18n();
    
    $(".filters a[data-filter*='match-']").removeClass('select');
    
    /*
    $("input.group1").removeAttr("disabled");
    $("input.group1").attr("disabled", true);
    */
    
    console.log('clubid',this.clubid);
    
    console.log('search',Y.User.getFiltersSearch());   
    
    var filters = Y.User.getFiltersSearch();
    
    if (filters!=undefined) {
	    if (filters.indexOf('searchgeo')!==-1) {
	      $('#searchgeo').attr('checked', true);		  
		  if (Y.Geolocation.longitude===null || Y.Geolocation.latitude===null)
		  {
		    $("#searchgeo").attr("disabled", true);  
		  }	      
	    } 
	    if (filters.indexOf('searchmyclub')!==-1) {
	      $('#searchmyclub').attr('checked', true);
	      if (this.clubid === undefined || this.clubid === '') {
            $("#searchclub").attr("disabled", true);
          }
	 	}
	    if (filters.indexOf('searchgamefollowed')!==-1) {
	      $('#searchgamefollowed').attr('checked', true);
	 	}
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