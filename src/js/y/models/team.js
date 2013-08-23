var TeamModel = Backbone.Model.extend({
  urlRoot : function () { return Y.Conf.get("api.url.teams"); },

  mode : '',
  
  defaults : {
    sport : "tennis",
    name : ""
  },  

  sync : function(method, model, options) {
  
    if (method === 'create') {
      var object = {        
          sport: "tennis",
          name: this.get('name')    
      };

      return Backbone.ajax({
        dataType : 'json',
        url : Y.Conf.get("api.url.teams"),
        type : 'POST',
        data : object,
        success : function(result) {
          
          if (result.id !== null)
            $('span.success').html('Enregistrement OK ' + data.id).show();
          else
            $('span.success').html('Erreur').show();
          
        }
      });

    }
    else {
      model.url = Y.Conf.get("api.url.teams")+this.id;
      return Backbone.sync(method, model, options);
    }

  }


});
