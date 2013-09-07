var StreamsCollectionGame = StreamsCollection.extend({
  model : StreamModelGame,	
  
  initialize: function (streamItems, options) {
    this.gameid = options.gameid;
  },
  
  url: function() {
    if (this.length > 0) {
      var lastid = this.at(0).id;
      return Y.Conf.get("api.url.games")+this.gameid+"/stream/?lastid="+lastid;
    }
    return Y.Conf.get("api.url.games")+this.gameid+"/stream/?limit=50"; 
  }
  
});