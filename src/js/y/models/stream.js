var StreamModel = Backbone.Model.extend({
  urlRoot : function () { return Y.Conf.get("api.url.games"); },

  defaults : {
    id : null,
    date : null,
    type : "comment",
    owner : null,
    data : {
      type : "",
      text : "...."
    }
  },

  comparator : function(item) {
    return -item.get("date").getTime();
  },

  sync : function(method, model, options) {

    if (method === 'update' || method === 'create') {
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
          type : this.get('type'),
          data : this.get('data')
        },
        success : function(data) {
          // put your code after the game is saved/updated.

          that.set(data);         
          if (options && options.success) {

              options.success(data);
          }          

        },
        error: function (message) {
            if (options && options.error)
              
              options.error(message);
        }        
      });

    } 

  }

});
