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
    console.log('url', model.url() + (this.get('gameid') || '')
        + '/stream/?playerid=' + (this.get('playerid') || '') + '&token='
        + (this.get('token') || ''));

    if (method === 'update' || method === 'create') {

      return $.ajax({
        dataType : 'json',
        url : model.url() + (this.get('gameid') || '') + '/stream/?playerid='
            + (this.get('playerid') || '') + '&token='
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

      return Backbone.sync(method, model, options);

    }

  }

});
