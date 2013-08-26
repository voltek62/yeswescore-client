Y.Views.Pages.TeamAdd = Y.View.extend({
  el: "#content",

  events: {
    'mousedown .button': 'addTeam',
    'keyup #club': 'updateList',
    'click #club_choice': 'displayClub'    
  },
  
  listview:"#suggestions",  

  pageName: "teamAdd",
  pageHash : "teams/add",

  clubs:null,

  myinitialize: function () {
    Y.GUI.header.title(i18n.t('teamadd.title'));

    this.page = Y.Templates.get('page-teamadd');

    this.player = Y.User.getPlayer();
    //this.clubid = this.player.get('club').id;    
	this.clubid = ''; 

    this.render();
    
    //this.startMonitoringModifications();
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

  autocompleteChoose: function (data) {
    if (data && data.name) {
      this.$("#club").val(data.name);
      this.clubid = data.id;
      this.$('club_error').html('');      
    }
  },  

  addingTeam: false,
  addTeam: function (event) {
    
    var name = $('#name').val()
      , club = $('#club').val()
      , clubid = this.clubid    
      , city = $('#city').val();
      
    if (this.addingTeam)
      return; // already sending => disabled.          
    
    this.addingTeam = true;
    
    var team = new TeamModel({
      name: name,
      club: {id: clubid},
      //On doit placer le player par défaut
      players:[{id:this.player.get('id')}],
      captain:this.player.get('id')      
    });

    var that = this;
    team.save(null, {
      playerid: this.player.get('id'),
      token: this.player.get('token')
    }).done(function(model, response){
      that.addingTeam = false; 
      Y.Router.navigate('teams/'+model.id, {trigger: true}); 
    }).fail(function (err) {
      that.$(".button").addClass("ko");
      that.shareTimeout = window.setTimeout(function () {
        that.$(".button").removeClass("ko");
        that.shareTimeout = null;
        that.$('.button').removeClass("disabled");    
      }, 4000);
      that.addingTeam = false;   
   });   
   
    return false;
  },

  render: function () {
    var player = this.player.toJSON();    
    var dataDisplay = {};
    
    //if (player.club !== undefined && player.club.id) {
    //  dataDisplay.club = player.club.name;
    //  dataDisplay.idclub = player.club.id;
    //}    
  
    this.$el.html(this.page({data : ''})).i18n();
    return this;
  }
});