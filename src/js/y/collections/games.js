var GamesCollection = Backbone.Collection.extend({
  	 
	model:GameModel, 
	
	mode:'default',
	sortMode:'',
	pos: null,
	
	initialize: function (param) {	
		this.changeSort("city");		

		//if (param==='follow')
		//	this.storage = new Offline.Storage('gamesfollow', this);		

	},
	
		  
  url:function() {
    // console.log('mode de games',this.mode); 	
    //console.log('sort de games',this.sortMode); 	
        
    var url='';
    
    if (this.mode === 'clubid') 
      url = Y.Conf.get("api.url.clubs") + "" + this.query + "/games/";    
    else if (this.mode === 'club') 
      url =  Y.Conf.get("api.url.games");
    else if (this.mode === 'player') 
      url = Y.Conf.get("api.url.games") + "?q=" + this.query;
    else if (this.mode === 'me') {      
      // /v1/players/:id/games/  <=> cette url liste tous les matchs dans lequel un player joue / a joué
	    // /v1/players/:id/games/?owned=true <=> cette url liste tous les matchs qu'un player possède (qu'il a créé)
      url = Y.Conf.get("api.url.players") + this.query + "/games/";
    }
    else if (this.mode === 'geolocation' && this.pos !==null) { 
      url =  Y.Conf.get("api.url.games") + "?distance=30&latitude="+this.pos[1]+"&longitude="+this.pos[0];
    }
    else 
      url =  Y.Conf.get("api.url.games");	
    
    if (this.sortMode==='date')
      url = url  + "?sort=-dates.start";   
       		
    if (this.sortMode==='location')
      url = url  + "?sort=location.city";    	    

	//FIXME : trie par club
    if (this.sortMode==='club')
      url = url  + "";    	
         	          
    //console.log('sortMode',this.sortMode);
    //console.log('URL',url);
    //console.log('sortMode',this.sortMode);
        
    return url;
  },

  setSort:function(s) {  	
  	//console.log('On passe sortMode sur '+s);
    this.sortMode=s;
  },
  
  setMode:function(m, q) {
    this.mode=m;
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
  //	return _(this.models.filter(function(c) { return _.include(ids, Game.id); }));
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

