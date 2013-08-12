Y.Views.Pages.SearchForm = Y.View.extend({
  el:"#content",
    
  events: {
    // fake checkbox toggles
    'click #searchgeo': 'toggleCheckboxes',
    'click #searchmyclub': 'toggleCheckboxes',
    'click #searchplayerfollowed': 'toggleCheckboxes',
    // other
    'click #club_choice' : 'displayClub',
    'click #linkprofil' : 'goProfil',
    'click #save' : 'save'
  },
  
  pageName: "searchForm",
  pageHash : "search/form",  
    
  clubs:null,

  myinitialize:function() {
    Y.GUI.header.title(i18n.t('search.title'));
    
    this.templates = {
      page:  Y.Templates.get('page-searchform')
    };
    this.render();
  },
  
  // only one checkbox can be checked at a time.
  toggleCheckboxes: function (event) {
    var $checkbox = $("#"+event.currentTarget.id+" span");
    if ($checkbox.hasClass('disabled'))
      return; // checkox disabled => nothing.
    if (event.currentTarget.id === 'searchmyclub' ||
        event.currentTarget.id === 'searchgeo' ||
        event.currentTarget.id === 'searchplayerfollowed') {
      // toggle option.
      if ($checkbox.hasClass('checked'))
        $checkbox.removeClass('checked')
      else {
        $('span[role="checkbox"]').removeClass('checked');
        $checkbox.addClass('checked');
      }
    }
  },
  
  save: function (event) {
    var $checked = this.$('span.checked');
    if ($checked.length === 1) {
      Y.User.setSearchOptions({filters: [$checked.parent()[0].id]}); // FIXME: this call is risky.
    } else {
      Y.User.setSearchOptions({filters: []});
    }
    // on retourne sur games
    Y.Router.navigate("games/list", {trigger: true});
  },
       
  goProfil: function() {
    Y.Router.navigate('players/form/search', {trigger: true});    
  },
  
  //render the content into div of view
  render: function() {
    var clubname=''
      , player = Y.User.getPlayer();
    
    if (player.get('club') !== undefined && player.get('club').name !== '') {
      clubname = player.get('club').name;
    }    
    
    // html
    this.$el.html(this.templates.page({clubname:clubname})).i18n();
    
    // dynamic content
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
    
    // GPS enabled ?
    if (Y.Geolocation.longitude === null && Y.Geolocation.latitude === null)  
    {
      $('#searchgeo span').removeClass('checked');
      $("#searchgeo span").addClass("disabled");
      $("#gps").text(i18n.t('search.gpsoff'));
    } else {
      long = Math.floor(Y.Geolocation.longitude*10000)/10000;
      lat = Math.floor(Y.Geolocation.latitude*10000)/10000;
      $("#gps").text(long+","+lat);
    }
    
    // club enabled ?
    if (player.get('club') === undefined ||
        player.get('club').name === '') {
      $('#searchmyclub span').removeClass('checked');  
      $("#searchmyclub span").addClass("disabled");     
    }
  }
});