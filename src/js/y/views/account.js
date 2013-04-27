Y.Views.Account = Y.View.extend({
  el: "#content",
  
   events: {
    'click a': 'link'
  }, 

  pageName: "account",
  pageHash : "account", 
  
  initialize: function () {
    // $.ui.setTitle("PROFIL");	
    Y.GUI.header.title(i18n.t('account.title'));

    this.accountViewTemplate = Y.Templates.get('account');
    this.clubid = Y.User.getClub();
    this.owner = Y.User.getPlayer();
    
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
	  owner : this.owner,
      clubid: this.clubid
    }));

	$('a').i18n();
    
  },
  
  

  onClose: function () {
    this.undelegateEvents();
  }
});