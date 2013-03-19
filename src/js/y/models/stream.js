var StreamModel = Backbone.Model.extend({

  urlRoot : Y.Conf.get("api.url.games"),

  defaults : {
    id : null,
    date : null,
    type : "comment",
    owner : null,
    data : {
      text : "...."
    }
  },

  initialize : function() {

  },

  comparator : function(item) {
    // POSSIBLE MULTI FILTER [a,b,..]
    return -item.get("date").getTime();
  },

  sync : function(method, model, options) {

    console.log('method Stream', method);


    if (method === 'update' || method === 'create') {
    
    console.log('url', Y.Conf.get("api.url.games") + (this.get('gameid') || '')
        + '/stream/?playerid=' + (this.get('playerid') || '') + '&token='
        + (this.get('token') || ''));    

      return $.ajax({
        dataType : 'json',
        url : Y.Conf.get("api.url.games") 
        	+ (this.get('gameid') || '') 
        	+ '/stream/?playerid='
            + (this.get('playerid') || '') 
            + '&token='
            + (this.get('token') || ''),
        type : 'POST',
        data : {
          // FIXME : only comment
          type : 'comment',
          data : {
            text : (this.get('text') || '')
          }
        },
        success : function(result) {
          // put your code after the game is saved/updated.

          console.log('data Stream', result);

        }
      });

    } else {

	  // http://api.yeswescore.com/v1/games/511d31971ad3857d0a0000f8/stream/
	  console.log('StreamModel default '+Y.Conf.get("api.url.games")+this.id+"/stream/");
      model.url = Y.Conf.get("api.url.games")+this.id+"/stream/";
	  
      return Backbone.sync(method, model, options);

    }

  }

});
