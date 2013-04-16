Y.Views.Account = Y.View.extend({
  el: "#content",

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

  // render the content into div of view
  render: function () {
    // $.ui.setTitle("MON COMPTE");
    
    console.log("clubid",this.clubid);
    
    console.log("1.1");    

	$(this.el).html(this.accountViewTemplate({
	  Owner : this.Owner,
      clubid: this.clubid
    }));

    console.log("1.2");
    
  },

  onClose: function () {
    this.undelegateEvents();
  }
});