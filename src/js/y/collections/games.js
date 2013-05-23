var GamesCollection = Backbone.Collection.extend({
  	 
	model:GameModel, 
	
	searchOption:'default',
	sortOption:'',
	pos: null,
	
	initialize: function (param) {	
		this.changeSort("city");		
	},
	
		  
  url:function() {
    // console.log('mode de games',this.searchOption); 	
    //console.log('sort de games',this.sortOption); 	
        
    var url='';
    
    if (this.searchOption === 'club' && this.query!== '') 
      //url = Y.Conf.get("api.url.clubs") + "" + this.query + "/games/";   
      url = Y.Conf.get("api.url.games") + "?club=" + this.query;     
         
    else if (this.searchOption === 'player') 
      url = Y.Conf.get("api.url.games") + "?q=" + this.query;
      
    else if (this.searchOption === 'live') 
      url = Y.Conf.get("api.url.games") + "?status=ongoing"; 
           
    else if (this.searchOption === 'me') {      
      // /v1/players/:id/games/  <=> cette url liste tous les matchs dans lequel un player joue / a jou�
	    // /v1/players/:id/games/?owned=true <=> cette url liste tous les matchs qu'un player poss�de (qu'il a cr��)
      url = Y.Conf.get("api.url.players") + this.query + "/games/?owned=true";
    }
    else if (this.searchOption === 'geolocation' && this.pos !==null) { 
      url =  Y.Conf.get("api.url.games") + "?distance=30&latitude="+this.pos[1]+"&longitude="+this.pos[0];
    }
    else 
      url =  Y.Conf.get("api.url.games");	
    
    if (this.sortOption==='date')
      url = url  + "?sort=-dates.start";         		
    else if (this.sortOption==='location')
      url = url  + "?sort=location.city";    	    
    else if (this.sortOption==='status')
      url = url  + "?sort=status";
	//FIXME : don't work
    else if (this.sortOption==='club')
      url = url  + "?sort=teams.players.club.name";    	
         	          
    console.log('sortMode',this.sortOption);
    console.log('URL',url);
    console.log('sortSearch',this.searchOption);
        
    return url;
  },

  setSort:function(s) {  	
  	//console.log('On passe sortMode sur '+s);
    this.sortOption=s;
  },
  
  setSearch:function(m, q) {
    this.searchOption=m;
    if (typeof q !== "undefined")
      this.setQuery(q); // compatibility ...
  },

  setQuery:function (q) {
    this.query=q;
  },
  
  setPos:function(pos) {
    this.pos = pos;
  },  
  
	//FIXME : if exists in localStorage, don't request
	/*
  sync: function(method, model, options) {
    
  //checkConnection();
  //console.log('etat du tel ',appConfig.networkState);
    
  console.log(' On est dans Games Collection avec '+model.url());
    
    return Backbone.sync(method, model, options); 
      
  },
  */
    
    
  /* ON AFFICHE QUE EN FCT DES IDS */
  //filterWithIds: function(ids) {
  //	return _(this.searchOptionls.filter(function(c) { return _.include(ids, Game.id); }));
//},
    
  /*
  comparator: function(item) {
    //POSSIBLE MULTI FILTER [a,b,..]
      return [item.get("city")];
    },
  */
    
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

