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
    return -item.get("date").getTime();
  },

  sync : function(method, model, options) {

    console.log('method Stream', method);


    if (method === 'update' || method === 'create') {
    
    console.log('url', Y.Conf.get("api.url.games") + (this.get('gameid') || '')
        + '/stream/?playerid=' + (this.get('playerid') || '') + '&token='
        + (this.get('token') || ''));    

	  var that = this;

      return Backbone.ajax({
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
          console.log('data Stream OK', result);
          that.set(data);         
          if (options && options.success) {
              console.log('success stream create in backbone ajax model');
              options.success(data);
          }          

        },
        error: function (message) {
            if (options && options.error)
              console.log('error stream create in backbone ajax model');              
              options.error(message);
        }        
      });

    } 

  }

});
