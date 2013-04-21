Y.Views.Account = Y.View.extend({
  el: "#content",
  
   events: {
    'click a': 'link'
  }, 

  pageName: "account",
  pageHash : "account", 
  
  initialize: function () {
    // $.ui.setTitle("PROFIL");	
    Y.GUI.header.title("PROFIL");

    this.accountViewTemplate = Y.Templates.get('account');
    this.clubid = Y.User.getClub();
    this.Owner = Y.User.getPlayer();
    
    this.render();
    
  },
  
  link : function(elmt) {
    var ref = elmt.currentTarget.href;
	Y.Router.navigate(ref, {trigger: true});	   
  },   

  // render the content into div of view
  render: function () {
    // $.ui.setTitle("MON COMPTE");  

	$(this.el).html(this.accountViewTemplate({
	  Owner : this.Owner,
      clubid: this.clubid
    }));


    
  },
  
  

  onClose: function () {
    this.undelegateEvents();
  }
});