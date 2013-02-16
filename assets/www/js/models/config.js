var Config = Backbone.Model.extend({

  storeName : "config",

  urlRoot : appConfig.serviceConf,

  name : '',
  
  defaults : {

  },  

  initialize : function() {

  },

  sync : function(method, model, options) {

    return Backbone.sync(method, model, options);

  }


});
