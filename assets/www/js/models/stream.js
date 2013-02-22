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
    console.log('url', Y.Conf.get("api.url.games") + (this.get('gameid') || '')
        + '/stream/?playerid=' + (this.get('playerid') || '') + '&token='
        + (this.get('token') || ''));

    if (method === 'update' || method === 'create') {

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
      return Backbone.sync(method, model, options);

    }

  }

});
