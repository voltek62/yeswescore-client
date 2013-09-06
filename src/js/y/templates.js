(function (Y) {
  /*#ifdef STRICT*/
  "use strict";
  /*#endif*/

  Y.Templates = {
    // Hash of preloaded templates for the app
    templates : {
      HTML: { /* name: "HTML" */ },
      compiled: { /* name: compiled */ }
    },

    // Load all the templates Async
    loadAsync: function (callback) {
      // searching scripts nodes
      var nodes = document.querySelectorAll("script[type=text\\/template]");
      // foreach script node, get the html.
      var html = this.templates.HTML;
      _(nodes).forEach(function (node) {
        // save the template
        var templateId = node.getAttribute('id');
        html[templateId] = node.innerHTML;
        // optim: remove the script from the dom.
        node.parentNode.removeChild(node);
      });
      /*#ifdef NOCONCAT*/
      if (true) {
        
        // dev environment, loading template using $.get()
        // pas trouvé mieux pour l'instant...
        var templates = [
          "autocomplete-club",
          "autocomplete-player",
          "datepicker-game-android",
          "datepicker-game",
          "datepicker-player-android",
          "datepicker-player",
          "list-club",
          "list-game",
          "list-notification",
          "list-player",
          "list-player-team",  
          "list-player-team-li",                    
          "list-player-notification",
          "list-team",
          "module-comments-comment",
          "module-comments-score",
          "module-empty",
          "module-error",
          "module-game-input",		  
          "module-game-scoreboard-3sets-simple",
          "module-game-scoreboard-5sets-simple",
          "module-game-scoreboard-3sets-double",
          "module-game-scoreboard-5sets-double",          
          "module-game-select",
          "module-ongoing",
          "module-use-search",          
          "page-about",
          "page-account",
          "page-add",
          "page-club",
          "page-clubadd",
          "page-clubs",
          "page-game",
          "page-gameadd",
          "page-gamecomments",
          "page-gameend",
          "page-gameform-simple",
          "page-gameform-double",		  
          "page-games",
          "page-help",
          "page-index",
          "page-notification",
          "page-player",
          "page-playerforget",
          "page-playerform",
          "page-players",
          "page-players-push",          
          "page-playersignin",
          "page-searchform",
          "page-teams",          
          "page-team",
          "page-teamform",          
          "page-teamadd",
          "page-teamcomments",          
          "wizard-welcome",
          "wizard-profil",
          "wizard-step3"
        ];
        var timeoutid = setTimeout(function () {
           var harvestedTemplates = _.keys(html);
           var missingTemplates = _.filter(templates, function (t) {
             return harvestedTemplates.indexOf(t) === -1;
           });
           throw "cannot load some template.. "+missingTemplates.join(",");
        }, 2000);
        var i = 0;
        templates.forEach(function (template) {
          $.get("templates/"+template+".html", function (text) {
            html[template] = text;
            i++;
            if (i == templates.length)
            {
              clearTimeout(timeoutid);
              callback();
            }
          });
        });
      } else {
      /*#endif*/

        // production environment
        // we have finished.
        callback();

      /*#ifdef NOCONCAT*/
      }
      /*#endif*/
    },

    // Get template by name from hash of preloaded templates
    get: function (templateId) {
      var html = this.templates.HTML
        , compiled = this.templates.compiled;
      if (typeof html[templateId] === "undefined")
        throw "unknown template "+templateId+" ; have you included the template in y/templates.js#loadAsync() ?";
      if (typeof compiled[templateId] === "undefined")
        compiled[templateId] = _.template(html[templateId]);
      return compiled[templateId];
    }
  };
})(Y);
