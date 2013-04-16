var StreamsCollection = Backbone.Collection.extend({
  model: StreamModel, 
  		
  mode: 'default',
  gameid:'', 
  	
  query: '',
 	
  initialize: function (param) {
  		this.changeSort("date");
  				
  		//console.log('constructeur avec ',param);
		this.gameid = param.id;
  },
	  
  url:function() {
     
     // http://api.yeswescore.com/v1/games/511d31971ad3857d0a0000f8/stream/
	//console.log('StreamModel default '+Y.Conf.get("api.url.games")+this.gameid+"/stream/");
    return Y.Conf.get("api.url.games")+this.gameid+"/stream/";
     
  },
	
  comparator: function (property) {
    return selectedStrategy.apply(Game.get(property));
  },
    
  strategies: {
      date: function (item) { return [item.get("dates.creation")]; }
  },
    
  changeSort: function (sortProperty) {
      this.comparator = this.strategies[sortProperty];
  }
	
});
