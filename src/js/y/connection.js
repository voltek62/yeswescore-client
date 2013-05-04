(function (Y, undefined) {
  /*#ifdef STRICT*/
  "use strict";
  /*#endif*/

  var Connection = {
    ONLINE: "ONLINE",
    OFFLINE: "OFFLINE",
    NEWVERSION: "NEWVERSION",    

    status: null,

    initialize: function () {
      this.status = this.OFFLINE;
    },

    isOnline: function () {
      this.update();
      return this.status === this.ONLINE;
    },
    
    forceUpdate : function () {  
     this.status = this.NEWVERSION;     
    },
    
    setOff : function () {
       this.status = this.OFFLINE;
       this.trigger("change", [this.status]);	
    },

    setOn : function () {
       this.status = this.ONLINE;
       this.trigger("change", [this.status]);	       
    },

    update: function () {
      if (Cordova.status !== "ready")
        return;
        
      if (this.status === this.NEWVERSION) {
        this.trigger("change", [this.NEWVERSION]);	
        return;      
      }
        
      var newStatus = Cordova.Connection.isOnline() ? this.ONLINE : this.OFFLINE;
      if (this.status !== newStatus) {
        this.status = newStatus;
        this.trigger("change", [newStatus]);
      }
    }
  };

  // adding some mixin for events.
  _.extend(Connection, Backbone.Events);

  // pooling cordova to auto-update connection status
  setInterval(function () { Connection.update(); }, Y.Conf.get("pooling.connection"));

  // exporting to global scope
  Y.Connection = Connection;
})(Y);