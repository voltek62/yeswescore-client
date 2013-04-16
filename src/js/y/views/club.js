Y.Views.Club = Y.View.extend({
  el : "#content",

  events : {
    'click a#listPlayer': "listPlayer",
    'click a#lastResult': "lastResult",  
    'click #followButton' : 'follow'
  },

  pageName: "club",
  pageHash : "clubs/",
  
  initialize : function() {
  
  	Y.GUI.header.title("CLUB");
  
    this.clubViewTemplate = Y.Templates.get('club');

    this.club = new ClubModel({
      id : this.id
    });
    this.club.fetch();

    // this.render();
    this.club.on('sync', this.render, this);
  },

  follow : function() {
    this.clubsfollow = new ClubsCollection('follow');
    this.clubsfollow.create(this.club);
  },

  // render the content into div of view
  render : function() {
    this.$el.html(this.clubViewTemplate({
      club : this.club.toJSON()
    }));

    return this;
  },
  
  listPlayer : function(elmt) {
 
    console.log('listPlayer ',elmt.currentTarget.href); 
    var ref = elmt.currentTarget.href;
    //console.log('listPlayer '+ref);
	Y.Router.navigate(ref, {trigger: true}); 
	   
  },
    
  lastResult : function(elmt) {
  
    console.log('lastResult ',elmt.currentTarget.href);     
    var ref = elmt.currentTarget.href;
    //console.log('lastResult '+ref);
	Y.Router.navigate(ref, {trigger: true});
	    
  },   

  onClose : function() {
    this.undelegateEvents();
    this.club.off("sync", this.render, this);
    // this.$el.off('pagebeforeshow');
  }
});