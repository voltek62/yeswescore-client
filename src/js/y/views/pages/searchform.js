Y.Views.Pages.SearchForm = Y.View.extend({
  el:"#content",
    
  events: {
    'keyup #club': 'updateList',
    "click #searchgeo":"update",
    "click #searchmyclub":"update", 
    "click #searchplayerfollowed":"update",        
    'click #club_choice' : 'displayClub',
    'click #linkprofil' : 'goProfil'
  },
  
  pageName: "searchForm",
  pageHash : "search/form",  
    
  clubs:null,
  useSearch:null,
  
  shareTimeout: null,    

  myinitialize:function() {
    Y.GUI.header.title(i18n.t('search.title')); 
    
    this.useSearch=0;
    
    this.templates = {
      page:  Y.Templates.get('page-searchform')
    };    
    
    this.owner = Y.User.getPlayer();    
    this.token = this.owner.get('token');
    this.playerid = this.owner.get('id');
    this.render();
  },
  
  update: function (event) {
    var $checkbox = $("#"+event.currentTarget.id+" span");
    if ($checkbox.hasClass('disabled'))
      return; // checkox disabled => nothing.
    if (event.currentTarget.id === 'searchmyclub' ||
        event.currentTarget.id === 'searchgeo' ||
        event.currentTarget.id === 'searchplayerfollowed') {
      // toggle option.
      if ($checkbox.hasClass('checked'))
        Y.User.setSearchOptions({filters: []});
      else
        Y.User.setSearchOptions({filters: [event.currentTarget.id]});
    }
    this.render();
  },
       
  goProfil: function() {
    Y.Router.navigate('players/form/search', {trigger: true});    
  },
  
  //render the content into div of view
  render: function() {
    var gps_state = "";

    if (Y.Geolocation.longitude!==null && Y.Geolocation.latitude!==null)  
    {
      long = Math.floor(Y.Geolocation.longitude*10000)/10000;
      lat = Math.floor(Y.Geolocation.latitude*10000)/10000;
      gps_state = long+","+lat;
    }
    else {
      gps_state = i18n.t('search.gpsoff');
    }
    
    var clubname='';
    if (this.owner.get('club') !== undefined && this.owner.get('club').name !== '') {
      clubname = this.owner.get('club').name;
    }    
    
    this.$el.html(this.templates.page({gps:gps_state,clubname:clubname})).i18n();
    
    $(".filters a[data-filter*='match-']").removeClass('select');
    
    var filters = Y.User.getSearchOptions().filters;
    if (filters.indexOf('searchgeo')!==-1) {
      $('#searchgeo span').addClass('checked');      
    } 
    if (filters.indexOf('searchmyclub')!==-1) {
      $('#searchmyclub span').addClass('checked');
    }
    if (filters.indexOf('searchplayerfollowed')!==-1) {
      $('#searchplayerfollowed span').addClass('checked');
    }
   
     if (Y.Geolocation.longitude===null || Y.Geolocation.latitude===null) {
      $('#searchgeo span').removeClass('checked');
      $("#searchgeo span").addClass("disabled");  
    }

    if (this.owner.get('club') !== undefined ) {
      if (this.owner.get('club').name === '') {
        $('#searchmyclub span').removeClass('checked');
        $("#searchmyclub span").addClass("disabled"); 
      }
    } else {
      $('#searchmyclub span').removeClass('checked');  
      $("#searchmyclub span").addClass("disabled");     
    }
  },

  onClose: function(){
    if (this.shareTimeout) {
      window.clearTimeout(this.shareTimeout);
      this.shareTimeout = null;
    }    
  }
});