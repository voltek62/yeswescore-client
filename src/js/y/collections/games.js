var GamesCollection = Backbone.Collection.extend({
  	 
	model:GameModel, 
	
	searchOption:[],
	//searchOptionParam:'',	
	sortOption:'',
	query:'',
	pos: null,
	club:'',
	player:'',
	
	initialize: function (param) {	
		this.changeSort("city");		
	},
	
		  
  url:function() {
    var url='';

    if (this.searchOption.indexOf('player') !== -1 && this.player!=='' ) {      
      // /v1/players/:id/games/  <=> cette url liste tous les matchs dans lequel un player joue / a jou�
	    // /v1/players/:id/games/?owned=true <=> cette url liste tous les matchs qu'un player poss�de (qu'il a cr��)
      url = Y.Conf.get("api.url.players") + this.player + "/games/?owned=true";
    }
    else 
      url =  Y.Conf.get("api.url.games");
      
    if (url === Y.Conf.get("api.url.games") ) 
    	url += "?";
    else
    	url += "&";      
    
    if (this.searchOption.indexOf('club') !== -1 && this.club!=='') {
      url += "club=" + this.club; 
      url += "&"; 
    }
    
    if (url === Y.Conf.get("api.url.games")  ) 
    	url += "?";
    
    if (this.searchOption.indexOf('geo') !== -1 && this.pos !==null) { 
     if (this.pos[1]!==null && this.pos[0]!==null)   
      url +=  "distance=50&latitude="+this.pos[1]+"&longitude="+this.pos[0];
      url += "&";
    }        

    if (url === Y.Conf.get("api.url.games") ) 
    	url += "?";
    
	  if (this.query!=="" && this.searchOption.indexOf('player') !== -1 ) {
		  url +="q="+this.query+"";
		  url += "&";
	  };
    
    if (url === Y.Conf.get("api.url.games") ) 
    	url += "?";
    	    
    if (this.sortOption==='ongoing')
      url += "status=ongoing&";
    else if (this.sortOption==='finished')
      url += "status=finished&";
    else if (this.sortOption==='created')
      url += "status=created&";
    
	  url += "sort=-dates.start,-dates.expected";   
     
    return url;
  },

  // FIXME: dependances.
  // @param options { filters: [ "a", "b"], sort: "aa" }
  setSearchOptions: function (options) {
    // filtres
    if (options.filters.indexOf('searchmyclub') !== -1) {
      var clubid = Y.User.getClub();
      if (clubid) {
        this.addSearch('club'); 
        this.setClub(clubid);
      } else {
        // FIXME: ne pas retirer cette option dans set
        this.removeSearch('searchmyclub');        
      }
	  }
    if (options.filters.indexOf('searchgeo') !== -1) {
      // FIXME: dependances
      if (Y.Geolocation.longitude !== null && Y.Geolocation.latitude !== null ) {
        this.setPos([Y.Geolocation.longitude, Y.Geolocation.latitude]);
        this.addSearch('geo');  
      } else {
        this.removeSearch('searchgeo');
      }
    }
    // tri
    if (options.sort)
      this.setSort(options.sort);
  },

  setSort: function (sorts) {
    this.sortOption = sorts;
  },


  setFilter: function (filters) {
    this.filterOption = filters;
  },
  
  removeSearch:function(m) {
    if (this.searchOption!==undefined) {      	  
      if (this.searchOption.indexOf(m) !== -1) {
        this.searchOption.splice(this.searchOption.indexOf(m), 1);
      }
    }
  },
  
  addSearch:function(m) {
    //this.searchOption=m;
    
     if (this.searchOption!==undefined) {      	  
        if (this.searchOption.indexOf(m) === -1) {
           this.searchOption.push(m);      
       }        
      }
      else {
         this.searchOption = [m];
      }   
  },

  setQuery:function (q) {
    this.query=q;
  },

  setPlayer:function (p) {
    this.player=p;
  },  
  
  setPos:function(pos) {
    this.pos = pos;
  },  
  
  setClub:function(club) {
    this.club = club;
  }, 	
    
  comparator: function (property) {
    return selectedStrategy.apply(Game.get(property));
  },
    
  strategies: {
    city: function (item) { return [item.get("city")]; }, 
    status: function (item) { return [item.get("status")]; },
    player: function (item) { return [item.get("teams[0].players[0].name"),item.get("teams[1].players[0].name")]; }
  },
    
  changeSort: function (sortProperty) {
      this.comparator = this.strategies[sortProperty];
  }
});
