var TeamsCollection = Backbone.Collection.extend({

  model : TeamModel,

  searchOption:[],
  mode : 'default',
  query : '',
  club : '',
  player : '',  

  initialize : function(param) {

  },

  url : function() {
    if (this.mode === 'search')
      return Y.Conf.get("api.url.teams") + 'autocomplete/?q=' + this.query+'&limit=15';
    else if (this.mode === 'club')
      return Y.Conf.get("api.url.teams") + '?clubid=' + this.query;
    else if (this.mode === 'player')
      return Y.Conf.get("api.url.teams") + '?playerid=' + this.query;            
    else
      return Y.Conf.get("api.url.teams");
  },

  setMode : function(m, q) {
    this.mode = m;
    this.query = q;
  },
  
  setClub:function(club) {
    this.club = club;
  }, 
  
  setPlayer:function (p) {
    this.player=p;
  },     

  // FIXME : if exists in localStorage, don't request
  sync : function(method, model, options) {
    return Backbone.sync(method, model, options);
  }

});
