var PlayersCollection = Backbone.Collection.extend({
  model: PlayerModel, 
  		
  mode: 'default',
  	
  query: '',
 	
	initialize: function (param) {
		this.changeSort("name");
		
	},
	  
  url:function() {
    if (this.mode === 'club')
      return Y.Conf.get("api.url.players")+'?club='+this.query;
    else if (this.mode === 'search'  )
      return Y.Conf.get("api.url.players")+'autocomplete/?q='+this.query+'&fields=name,rank,club.name,profile&limit=15';        
    else	
      return Y.Conf.get("api.url.players");
  },

  setMode:function(m,q) {
    this.mode=m;
    this.query=q;
  },
    
  comparator: function (property) {
    return selectedStrategy.apply(Game.get(property));
  },

  strategies : {
    name : function(item) { return [ item.get("name") ] }
  , rank : function(item) { return [ item.get("rank") ] }
  },

  changeSort : function(sortProperty) {
    this.comparator = this.strategies[sortProperty];
  }
});
