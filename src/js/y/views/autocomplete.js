Y.Views.Autocomplete = Y.View.extend({
  el:  "#autocomplete",
  listview : '#listautocomplete',
  
  proposals: null, /* @see y/autocomplete.js */

  events: {
    // Hack. mousedown is triggered before blur in the GUI.
    'mousedown .proposal': 'selected',
    'mousedown .autocomplete-club': 'selected',
    'mousedown .autocomplete-player': 'selected',    
    'click .button-close': 'close',
    // autocompletion
    'keyup #autocompleteinput': 'autocompleteCall'
  },

  type: "player",
  val: null,
  callback: null,
  onselected: null,

  myinitialize: function (param) {
    this.type = param.type;
    this.val = param.val;
    this.callback = param.callback;
    this.onselected = param.onselected;

    this.templates = {
      page:  Y.Templates.get('page-autocomplete'),    
      player:  Y.Templates.get('autocomplete-player'),
      club  :  Y.Templates.get('autocomplete-club')      
    };
  },

  render: function () {
    this.$el.html(this.templates.page({type:this.type}));
    $('body').addClass("autocomplete");
    $("#autocompleteinput").val(this.val);
    $("#autocompleteinput").focus();
    this.autocompleteStart();
    return this; 
  },
  
  autocompletePlayer: function (input, callback) {
    if (input.indexOf('  ')!==-1 || input.length<= 1 )
      callback('empty');    
    
    Backbone.ajax({
      url: Y.Conf.get("api.url.autocomplete.players"),
      type: 'GET',
      dataType : 'json',
      data: { q: input }
    }).done(function (players) {
      if (players && _.isArray(players) && players.length>0) {
        callback(null, players.splice(0, 3).map(function (p) {
          p.text = p.name; 
          return p; 
        }));
      } else {
        callback(null, []);
      }
    }).fail(function (xhr, error) { 
      callback(error);
    });
  },

  autocompletePlayerSelected: function (data) {
    if (data && data.name) {
      $("#team2").val(data.name);
      this.team1_id = data.id;
      $('body').removeClass("autocomplete");
      //quit -> dispose
    }
  },  

  autocomplete: null,
  
  setProposals: function (autocomplete, proposals, type, elmt) {
    assert(autocomplete instanceof Y.Autocomplete);
    assert(_.isArray(proposals));

    // refs.
    this.autocomplete = autocomplete;
    this.proposals = proposals;
    
    // empty GUI.
    this.$(this.listview).empty();
    
    // creating list of proposals
    this.proposals.forEach(function (proposal, i) {
      var text = null;
            
      if (proposal) {
        if (typeof proposal === "string")
          text = proposal;
        if (typeof proposal === "object" && proposal.text)
          text = proposal.text;
      }
      if (!text)
        return; // nothing to display.
        
      console.log('type',type);  
      
      if (type==="player") {
      
        var object = {
          id        : proposal.id
          , number  : i
          , rank    : proposal.rank || ''
          , name    : proposal.name || ''
        };       
        
        if (proposal.hasOwnProperty('club'))
          object.club = proposal.club.name;
        else
          object.club = '';
          
        if (typeof proposal.profile !== "undefined")
          if(proposal.profile.image!=="")
            object.picture = PlayerModel.getExtractImageUrl(proposal.profile.image);
          else
            object.picture = Y.Conf.get("gui.image.placeholder.profil");                
        else
          object.picture = Y.Conf.get("gui.image.placeholder.profil");      
      
        this.$(this.listview).append(this.templates.player(object));
      } else if (type==="club") {

        var object = {
            id      : proposal.id
          , number  : i
          , picture : Y.Conf.get("gui.image.placeholder.profil")
          , name    : proposal.name || ''          
        }; 
        
        if (proposal.hasOwnProperty('location'))
          object.city = proposal.location.city;
        else
          object.city = '';    
        this.$(this.listview).append(this.templates.club(object));
      }
    }, this);
  },
  

  autocompletePlayers: function (input, callback) {
    if (input.indexOf('  ')!==-1 || input.length<= 1 )
      callback('empty');    
    
    Backbone.ajax({
      url: Y.Conf.get("api.url.autocomplete.players"),
      type: 'GET',
      dataType : 'json',
      data: { q: input }
    }).done(function (players) {
      if (players && _.isArray(players) && players.length>0) {
        callback(null, players.splice(0, 3).map(function (p) {
          p.text = p.name; 
          return p; 
        }));
      } else {
        callback(null, []);
      }
    }).fail(function (xhr, error) { 
      callback(error);
    });
  },
  
  autocompleteClubs: function (input, callback) {
    if (input.indexOf('  ')!==-1 || input.length<= 1 )
      callback('empty');    
    
    // assuming the fact that changing club input => reset.
    this.clubid = ''; 
    //
    Backbone.ajax({
      url: Y.Conf.get("api.url.autocomplete.clubs"),
      type: 'GET',
      dataType : 'json',
      data: { q: input }
    }).done(function (clubs) {
      if (clubs && _.isArray(clubs) && clubs.length>0) {
        callback(null, clubs.splice(0, 3).map(function (p) { p.text = p.name; return p; }));
      } else {
        callback(null, []);
      }
    }).fail(function (xhr, error) { 
      callback(error);
    });
  },  
  
  // FIXME:
  // This function should be inlined in setProposals
  //  but we will not have fast-click (no backbone touch ...)
  //  so we prefer to leave it outside, until we can speed up any clicks.
  //  BUT, this actualy leads to memory managment tricks
  //    autocompleteObj must unregister itself from this class, when disposed.
  selected: function (e) {
    var index = $(e.target).attr('data-index');

    if (this.autocomplete) {
      this.$("#"+this.elmt).val(this.proposals[index]);    
      this.autocomplete.trigger("selected", this.proposals[index]);         
    }
  },


  // autocomplete helpers
  autocompleteObj: null,
  autocompleteTimeout: null,    

  autocompleteStart: function () {
    if (this.autocompleteTimeout) {
      window.clearTimeout(this.autocompleteTimeout);
      this.autocompleteTimeout = null;
    }
    if (this.autocompleteObj) {
      this.autocompleteObj.dispose();
      this.autocompleteObj = null;
    }

    assert(typeof this.callback === "function");
    this.autocompleteObj = new Y.Autocomplete({ type: this.type });
    this.autocompleteObj.on("input.temporized", function (input) {
      if (this.unloaded || !this.autocompleteObj) return; // prevent execution if unloaded.
      // fetching data for input
      this.callback(input, _.bind(function (err, data) {
        if (this.unloaded || !this.autocompleteObj) return;  // prevent execution if unloaded.
        // FIXME: this function will not be disposed :(
        if (err)
          return this.autocompleteObj.trigger("fetched.error", err);
        this.autocompleteObj.trigger("fetched.result", data || []);
      }, this));
    }, this);
      
    assert(typeof this.onselected === "function");
    this.autocompleteObj.on("selected", function (val) {
      this.onselected(val);
      this.close();
    }, this);
    return true;
  },

  autocompleteStopDelayed: function () {
    // keep on screen 0.5 sec.
    this.autocompleteTimeout = window.setTimeout(_.bind(function () {
      this.autocompleteStop(); 
      this.autocompleteTimeout = null;
    }, this), 500);
    return true;
  },

  autocompleteStop: function () {
    if (this.autocompleteObj) {
      this.autocompleteObj.dispose();
      this.autocompleteObj = null;
    }
    return true;
  },

  autocompleteCall: function (e) {
    if (this.autocompleteObj)
      this.autocompleteObj.trigger("input", $(e.target).val());
  },

  onClose: function () {
    this.autocompleteStop();
    $('body').removeClass("autocomplete");
  }
});