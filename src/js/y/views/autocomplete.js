Y.Views.Autocomplete = Y.View.extend({
  el: "#autocomplete",

  proposals: null, /* @see y/autocomplete.js */

  events: {
    // Hack. mousedown is triggered before blur in the GUI.
    'mousedown .proposal': 'selected',
    'mousedown .autocomplete-club': 'selected',
    'mousedown .autocomplete-player': 'selected'    
  },

  initialize: function () { 
  
    this.templates = {
      player:  Y.Templates.get('autocomplete-player'),
      club  :  Y.Templates.get('autocomplete-club')      
    };
  
  },
  render: function () { },

  autocomplete: null,

  setProposals: function (autocomplete, proposals, mode) {
    assert(autocomplete instanceof Y.Autocomplete);
    assert(_.isArray(proposals));

    // refs.
    this.autocomplete = autocomplete;
    this.proposals = proposals;
    // empty GUI.
    this.$el.empty();
    
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
      
      if (mode==="player") {
      
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
      
		this.$el
		.append(this.templates.player(object));       
              
      }     
      else if (mode==="club") {

        var object = {
          id        : proposal.id
          , number  : i
          , picture : Y.Conf.get("gui.image.placeholder.profil")
          , name    : proposal.name || ''          
        }; 
        
        if (proposal.hasOwnProperty('location'))
          object.city = proposal.location.city;
        else
          object.city = '';        

		this.$el
		.append(this.templates.club(object));           
              
      }
      else
		this.$el.append($('<div class="proposal" data-index="'+ i +'">')
        .html(text));
            
    }, this);
  },

  // FIXME:
  // This function should be inlined in setProposals
  //  but we will not have fast-click (no backbone touch ...)
  //  so we prefer to leave it outside, until we can speed up any clicks.
  //  BUT, this actualy leads to memory managment tricks
  //    autocompleteObj must unregister itself from this class, when disposed.
  selected: function (e) {

    var index = $(e.target).attr('data-index');
    if (this.autocomplete)
      this.autocomplete.trigger("selected", this.proposals[index]);       
      
  }
});