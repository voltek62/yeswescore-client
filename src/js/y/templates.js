(function (Y) {
  "use strict";

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
          "account", "clubAdd", "clubListAutoComplete", "club", "clubList", "clubListAutoComplete", 
          "gameAdd", "gameComment","gameEnd", "gameSearch", "gameListView", "gameCommentList",
          "gameScoreBoard", "game", "index", "playerForget",
          "playerForm", "playerListAutoComplete", "playerList",
          "playerSearch", "playerSignin", "player"
        ];
        var timeoutid = setTimeout(function () { throw "cannot load some template.. "; }, 2000);
        var i = 0;
        templates.forEach(function (template) {
          console.log('harvesting template ' + "templates/"+template+".html");
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
        throw "unknown template "+templateId;
      if (typeof compiled[templateId] === "undefined")
        compiled[templateId] = _.template(html[templateId]);
      return compiled[templateId];
    }
  };
})(Y);
