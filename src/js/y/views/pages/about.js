Y.Views.Pages.About = Y.View.extend({
  el: "#content",

  pageName: "about",
  pageHash : "about", 
  
  myinitialize: function () {
    Y.GUI.header.title(i18n.t('about.title'));
    this.page = Y.Templates.get('page-about');
    this.render();
  },

  render: function () {
    
    var linkapp = "http://www.yeswescore.com";
    /*#ifdef IOS*/
    linkapp = "https://itunes.apple.com/fr/app/yeswescore/id654933094?l=fr&ls=1&mt=8";
    /*#ifdef ANDROID*/
    linkapp = "https://play.google.com/store/apps/details?id=com.zenodus.client.html5"
    /*#endif*/
    /*#ifdef WP8*/
    linkapp = "http://www.windowsphone.com/fr-fr/store/app/yeswescore/1d23dd2e-55e4-4c66-a36e-d5d520113755";      
    /*#endif*/
        
    $(this.el).html(this.page({versionapp:Y.App.VERSION,linkapp:linkapp}));
    this.$(".about").i18n();

    /*#ifdef DEV*/
    var devInfos = {
      env: Y.Env.CURRENT,
      "api.url.games": Y.Conf.get("api.url.games")
    };
    var i;
    for (i in devInfos) {
      $(".dev").append("<div>"+i+":"+devInfos[i]);
    }
    /*#endif*/
  }
});