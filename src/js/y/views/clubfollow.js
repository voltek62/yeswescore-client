Y.Views.ClubFollow = Y.View.extend({
  el:"#content",
  
  events: {
    "blur input#search-basic": "search",
    "click li": "chooseClub"    
  },

  listview:"#listClubsView",  
  
  pageName: "clubFollow",
  pageHash : "clubs/follow",

  initialize:function() {

	//header      
    Y.GUI.header.title("CLUBS SUIVIS");    

    // loading templates.
    this.templates = {
      clublist:  Y.Templates.get('clubList'),
      clubs: Y.Templates.get('clubs')
    };
    

    this.render();		
       
    var clubs = Y.Conf.get("owner.clubs.followed");
    
    //console.log('clubs',clubs);
    
    if (clubs!==undefined) {

	    this.collection = new ClubsCollection();
	
	    var that = this;
	
	    var i = clubs.length;	
	    
		this.syncClub = function (club) {
		
 		  that.collection.add(club);
	      i--;

	      if (i<=0) {
	        console.log('renderList',that.collection.toJSON());    
	    	$(that.listview).html(that.templates.clublist({clubs:that.collection.toJSON(),query:' '}));  	
	      }
	          			
		};	    
	   
	    this.clubs = [];	    
	    clubs.forEach(function (clubid,index) {
		  var club = new ClubModel({id : clubid});
		  club.once("sync", this.syncClub, this);
	      club.fetch();	
	      this.clubs[index] = club;	      			
	    },this);
	 }
	 else {
	 
	   $(this.listview).html(this.templates.clublist({clubs:[],query:' '}));
	 }
     
  },
  
  chooseclub : function(elmt) { 
    var ref = elmt.currentTarget.id;
    console.log(ref);
	Y.Router.navigate(ref, {trigger: true});  
  },  
  
  search:function() {
    //FIXME if($("#search-basic").val().length>3) {
    var q = $("#search-basic").val();
    $(this.listview).empty();    	  
    this.clubs.setMode('search',q);
    this.clubs.fetch();
    $(this.listview).html(this.templates.clublist({clubs:this.clubsfollow.toJSON(), query:q}));
    //$(this.listview).listview('refresh');
    //}
    return this;
  },

  //render the content into div of view
  render: function(){
    this.$el.html(this.templates.clubs({}));

    return this;
  },

  renderList: function(query) {
    $(this.listview).html(this.templates.clublist({clubs:this.collection.toJSON(), query:' '}));

    return this;
  },

  onClose: function(){
    this.undelegateEvents();

	if (this.clubs!==undefined) {
		this.clubs.forEach(function (club) {
		   club.off("sync", this.syncClub, this);
		}, this);
	}
  }
});