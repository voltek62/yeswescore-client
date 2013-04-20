var StreamsCollection = Backbone.Collection.extend({
  model: StreamModel, 
  mode: 'default',
  gameid:'', 
  query: '',
 	
  initialize: function (streamItems, options) {
		this.gameid = options.gameid;
  },

  url: function() {
    if (this.length > 0) {
      var lastid = this.at(0).id;
      return Y.Conf.get("api.url.games")+this.gameid+"/stream/?lastid="+lastid;
    }
    return Y.Conf.get("api.url.games")+this.gameid+"/stream/"; 
  },
	
  comparator: function (item) {
    return new Date(item.get("dates.creation")).getTime();
  }
});
