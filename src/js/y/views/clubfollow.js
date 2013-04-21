Y.Views.ClubFollow = Y.View.extend({
  el:"#content",
  
  events: {
    "blur input#search-basic": "search",
    "click li": "chooseClub"    
  },

  listview:"#listclubsView",  
  
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

	    this.collection = new clubsCollection();
	
	    var that = this;
	
	    var i = clubs.length;	
	    clubs.forEach(function (clubid) {
	
			//console.log('club',clubid);
			
			club = new ClubModel({id : clubid});
	        club.fetch();
	        club.once("sync", function () { 
	        
	          that.collection.add(this);
	          
	          i--;

	          if (i<=0) {
	    			console.log('renderList',that.collection.toJSON());    
	    			$(that.listview).html(that.templates.clublist({clubs:that.collection.toJSON(),query:' '}));  	
	          }
	        });
				
	    });
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
    //this.clubs.off("all",this.renderList,this);   
  }
});