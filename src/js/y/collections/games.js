var GamesCollection = Backbone.Collection.extend({
  	 
	model:GameModel, 
	
	searchOption:'',
	searchOptionParam:'',	
	sortOption:'',
	query:'',
	pos: null,
	
	initialize: function (param) {	
		this.changeSort("city");		
	},
	
		  
  url:function() {
    
    console.log('mode de games',this.searchOption); 	
    console.log('sort de games',this.sortOption); 	
   
        
    var url='';
    
    if (this.searchOption === 'club' && this.searchOptionParam!== '') 
      //url = Y.Conf.get("api.url.clubs") + "" + this.query + "/games/";   
      url = Y.Conf.get("api.url.games") + "?club=" + this.searchOptionParam;     
         
    else if (this.searchOption === 'player') 
      url = Y.Conf.get("api.url.games") + "?q=" + this.searchOptionParam;
      
    else if (this.searchOption === 'live') 
      url = Y.Conf.get("api.url.games") + "?status=ongoing"; 
           
    else if (this.searchOption === 'me') {      
      // /v1/players/:id/games/  <=> cette url liste tous les matchs dans lequel un player joue / a jou�
	    // /v1/players/:id/games/?owned=true <=> cette url liste tous les matchs qu'un player poss�de (qu'il a cr��)
      url = Y.Conf.get("api.url.players") + this.searchOptionParam + "/games/?owned=true";
    }
    else if (this.searchOption === 'geolocation' && this.pos !==null) { 
      url =  Y.Conf.get("api.url.games") + "?distance=30&latitude="+this.pos[1]+"&longitude="+this.pos[0];
    }
    else 
      url =  Y.Conf.get("api.url.games");
      
    if (url === Y.Conf.get("api.url.games") ) 
    	url += "?";
    else
    	url += "&";  	
    	
	if (this.query!=="" && this.searchOption !== 'player') {
		url +="q="+this.query+"&";
	};
    
    if (this.sortOption==='date')
      url = url  + "sort=-dates.start";         		
    else if (this.sortOption==='location')
      url = url  + "sort=location.city";    	    
    else if (this.sortOption==='status')
      url = url  + "sort=status";
    else if (this.sortOption==='live')
      url = url  + "status=ongoing";
	//FIXME : don't work
    else if (this.sortOption==='club')
      url = url  + "sort=teams.players.club.name";    	

    console.log('URL',url);        
        
    return url;
  },

  setSort:function(s) {  	
  	//console.log('On passe sortMode sur '+s);
    this.sortOption=s;
  },
  
  setSearch:function(m, q) {
    this.searchOption=m;
    if (typeof q !== "undefined")
      this.searchOptionParam=q;
  },

  setQuery:function (q) {
    this.query=q;
  },

  
  
  setPos:function(pos) {
    this.pos = pos;
  },  
  
	
    
  comparator: function (property) {
    return selectedStrategy.apply(Game.get(property));
  },
    
  strategies: {
      city: function (item) { return [item.get("city")]; }, 
      status: function (item) { return [item.get("status")]; },
      player: function (item) { return [item.get("teams[0].players[0].name"),item.get("teams[1].players[0].name")]; },
  },
    
  changeSort: function (sortProperty) {
      this.comparator = this.strategies[sortProperty];
  }
});

