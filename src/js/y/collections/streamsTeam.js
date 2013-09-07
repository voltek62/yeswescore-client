var StreamsCollectionTeam = StreamsCollection.extend({
  model : StreamModelTeam,	
  
  initialize: function (streamItems, options) {
    this.teamid = options.teamid;
    this.playerid = options.playerid;
    this.token = options.token;  
  },
  

  url: function() {
 
    if (this.length > 0) {
      var lastid = this.at(0).id;
      return Y.Conf.get("api.url.teams")+this.teamid+'/stream/?lastid='+lastid+'&playerid='
            + this.playerid
            + '&token='
            + this.token;
    }
    return Y.Conf.get("api.url.teams")+this.teamid+'/stream/?limit=50&playerid='
            + this.playerid
            + '&token='
            + this.token; 
  }
  
});