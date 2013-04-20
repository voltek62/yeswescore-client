var StreamsCollection = Backbone.Collection.extend({
  model: StreamModel, 
  		
  mode: 'default',
  gameid:'', 
  	
  query: '',
 	
  initialize: function (streamItems, options) {
    this.changeSort("date");
		this.gameid = options.gameid;
  },

  url: function() {
    if (this.length > 0) {
      console.log('taille de la collection: ' + this.length);
      var lastid = this.at(0).id;
      console.log('dernier id: ' + lastid);
      // return Y.Conf.get("api.url.games")+this.gameid+"/stream/?lastid="+lastid;
    }
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
