Y.Views.Club = Y.View.extend({
  el : "#content",

  events : {
    'click a#listPlayer': "listPlayer",
    'click a#lastResult': "lastResult",  
    'click #followButton' : 'followClub'
  },

  pageName: "club",
  pageHash : "clubs/",
  
  initialize : function() {
  
  	Y.GUI.header.title("CLUB");
  
    this.clubViewTemplate = Y.Templates.get('club');

    this.club = new ClubModel({
      id : this.id
    });
    
    this.club.on('sync', this.render, this);    
    
    this.club.fetch();
    
    var clubs_follow = Y.Conf.get("owner.clubs.followed");
    if (clubs_follow !== undefined)
    {
      if (clubs_follow.indexOf(this.id) === -1) {
        this.follow = 'false';
      }
      else
        this.follow = 'true';          
    }
    else
      this.follow = 'false';    

  },

	followClub: function() {
  
        if (this.follow === 'true') {

          var clubs_follow = Y.Conf.get("owner.clubs.followed");
          if (clubs_follow !== undefined)
          {
            if (clubs_follow.indexOf(this.id) !== -1) {
              //On retire l'elmt
              clubs_follow.splice(clubs_follow.indexOf(this.id), 1);
              Y.Conf.set("owner.clubs.followed", clubs_follow, { permanent: true });
            }
          }
          
          $('span.success').html('Vous ne suivez plus ce club').show();
          $("#followButton").text("Suivre");
          $('#followButton').removeClass('button-selected');
          $('#followButton').addClass('button'); 

          this.follow = 'false';

        } else {
        
          //Via localStorage
          var clubs_follow = Y.Conf.get("owner.clubs.followed");
          if (clubs_follow !== undefined)
          {
            if (clubs_follow.indexOf(this.id) === -1) {
              clubs_follow.push(this.id);
              Y.Conf.set("owner.clubs.followed", clubs_follow, { permanent: true });
            }
          }
          else
            Y.Conf.set("owner.clubs.followed", [this.id]);

          $('span.success').html('Vous suivez ce club').show();
          $("#followButton").text("Ne plus suivre");
          $('#followButton').removeClass('button');
          $('#followButton').addClass('button-selected');          
          

          this.follow = 'true';

        }	
  
  },    


  // render the content into div of view
  render : function() {
  
  	console.log('club',this.club.toJSON());
  
    this.$el.html(this.clubViewTemplate({
      club : this.club.toJSON(),follow:this.follow
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