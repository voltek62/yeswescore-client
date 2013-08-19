Y.Views.Pages.PlayerForm = Y.View.extend({
  el:"#content",
    
  events: {
    'click #savePlayer':'save',
    'click #getPhoto': 'getPhoto',
    'click #delPhoto': 'delPhoto',
    'keyup #club': 'updateList',
    'click #club_choice': 'displayClub',
    'focus .nativedatepicker' : 'nativeDate'
  },
  
  listview:"#suggestions",

  pageName: "playerForm",
  pageHash: "players/form",  
    
  clubs:null,
  useSearch:0,
  mode:'',

  myinitialize:function(obj) { 
    this.useSearch = 0;  
    this.mode = obj.mode;
  
    //header
    Y.GUI.header.title(i18n.t('playerform.title')); 
  
    // loading templates.
    this.templates = {
      playerform:  Y.Templates.get('page-playerform'),
      playerdatepickerbirth:  Y.Templates.get('datepicker-player'),  
      playerdatepickerbirthandroid:  Y.Templates.get('datepicker-player-android'),        
      clublist: Y.Templates.get('autocomplete-club')
    };
    
    // we already have the player in memory
    this.player = Y.User.getPlayer();
    this.clubid = this.player.get('club').id;
    
    Y.GUI.addBlueBackground();
  
    // we render immediatly
    this.render();

    this.startMonitoringModifications();
  },
  
  autocompleteClubs: function (input, callback) {
    if (input.indexOf('  ')!==-1 || input.length<= 1 )
      callback('empty');    
    
    // assuming the fact that changing club input => reset.
    this.clubid = ''; 
    //
    Backbone.ajax({
      url: Y.Conf.get("api.url.autocomplete.clubs"),
      type: 'GET',
      dataType : 'json',
      data: { q: input }
    }).done(function (clubs) {
      if (clubs && _.isArray(clubs) && clubs.length>0) {
        callback(null, clubs.splice(0, 3).map(function (p) { p.text = p.name; return p; }));
      } else {
        callback(null, []);
      }
    }).fail(function (xhr, error) { 
      callback(error);
    });
  },

  autocompleteChoose: function (data) {
    if (data && data.name) {
      this.$("#club").val(data.name);
      this.clubid = data.id;
      this.$('club_error').html('');      
    }
  },
  
  render: function () {
    var player = this.player.toJSON();
        
    var dataDisplay = {
        name:player.name
      , rank:player.rank
      , idlicence:player.idlicense
      , playerid:this.playerid
      , token:this.token
      , imagePlaceholder: Y.Conf.get("gui.image.placeholder.profil")
    };
      
    if (player.club !== undefined && player.club.id) {
      dataDisplay.club = player.club.name;
      dataDisplay.idclub = player.club.id;
    }
    
    this.$el.html(this.templates.playerform({data : dataDisplay})).i18n();

    this.$(".container").addClass(this.mode);

    /*
    debug android 2.2 to 2.3.6
    */
   if (Cordova.Device.isGingerbread) {
       $('#inject-datepicker').prepend(this.templates.playerdatepickerbirthandroid({}));
      // pb avec canvas toDataUrl sur android gingerbread
      // @see https://code.google.com/p/android/issues/detail?id=16829
      $(".column.picture").hide();
    } else {
      $('#inject-datepicker').prepend(this.templates.playerdatepickerbirth({}));
    }
   
    if (player.gender !== undefined) $("#gender").val(player.gender);
    if (player.dates.birth !== undefined) {  
      var dateBirth = Date.fromString(player.dates.birth);
      var month = dateBirth.getMonth() + 1;
      var date = (''+dateBirth.getFullYear())+'-'+('0'+month).slice(-2)+'-'+('0'+dateBirth.getDate()).slice(-2);       
      $('#birth').val(date);
    }

    // dynamiquement, on set l'image.
    if (this.player.hasImage()) {
      $("#image").attr("src", this.player.getImageUrl());
    }

    /*#ifndef CORDOVA*/
    // hack pour upload n'importe quelle photo pour les tests.
    var $input = $('<input type="file" id="filepicker" name="image" style="position:relative;top:-30px;left:0;width:100%;height:30px;opacity:0;"/>');
    var that = this;
    $input.on("change", function (event) {
      var reader = new FileReader();
      reader.readAsDataURL(this.files[0]);
      reader.onloadend = function (e) {
        var image = { dataUri: this.result };
        console.log('onChange', image);        
        that.onPhotoCaptured(image);
      };
    });
    this.$("#getPhoto").after($input);
    /*#endif*/

    this.updatePhotoButtonStatus();
    
    this.$el.i18n();

    return this;
  },
  
  save: function (event) {
    var name = $('#name').val()
      , rank = $('#rank').val().replace(/ /g, "")
      , playerid = this.playerid
      , token = this.token
      , club = $('#club').val()
      , clubid = this.clubid
      , birth = $('#birth').val()
      , gender = $('#gender').val()            
      , idlicence = $('#idlicence').val()
      , player = null;

    if (checkRank(rank) && rank.length>0) {
      $('.rank_error').html(i18n.t('message.bad_rank')+' !').show();
      $('#rank').val('');        
      return false;     
    };
    
    if (name.length==0) {
      $('.name_error').html(i18n.t('message.empty_name')+' !').show();      
      return false;     
    };
    
    if (checkName(name) && name.length>0) {
      $('.name_error').html(i18n.t('message.bad_name')+' !').show();
      $('#name').val('');        
      return false;     
    };

    if (checkLicence(idlicence) && idlicence.length>0) {
      $('.idlicence_error').html(i18n.t('message.bad_licence')+' !').show();
      $('#idlicence').val('');        
      return false;     
    };

    if (checkName(club) && club.length>0) {
      $('.club_error').html(i18n.t('message.bad_name')+' !').show();
      $('#club').val('');        
      return false;     
    };
    
    // on supprime tous les messages d'erreurs précédents.
    $(".label-error").hide();

    // avant de lancer l'execution, on bascule en readonly
    this.readonly(true);

    var that = this;
    var player = Y.User.getPlayer();
    player.set('name', name);
    player.set('rank', rank);
    player.set('idlicence', idlicence);
    player.set('club', club);
    player.set('clubid', clubid);
    player.get('dates').birth = birth;
    player.set('gender', gender); 

    // faut il enregistrer l'image
    var deferred = $.Deferred();
    var $image = $("#image");
    if ($image.attr("data-modified") == "true") {
      // 2 possibilité:
      //  - l'image a été modifiée
      //  - l'image a été supprimée 
      var removed = ($image.attr("src") == $image.attr("data-default-src"));
      if (removed) {
        deferred.resolve(""); // chaine vide pour reseter l'image.
      } else {
        // on fait patienter l'utilisateur pendant la sauvegarde de la photo
        $("#throbber").show();
        // on sauve la photo
        var file = new FileModel();
        file.saveImageDataURI($image.attr("src"))
            .done(function () {
              deferred.resolve(file.get('id'));
            })
            .fail(function() {
              deferred.resolve(null);
            })
            .always(function () {
              $image.attr("data-modified", "")
              $("#throbber").hide();
            });
      }
    } else {
      deferred.resolve(null);
    }

    deferred.always(function (pictureId) {
      // on associe eventuellement l'image au player.
      if (pictureId !== null)        
        player.set('profile', {image: pictureId});
      //
      player.save().always(function () {
        // on autorise l'utilisateur a remodifier la GUI.
        that.readonly(false);
        // on repopulate le club (qui peut ne pas avoir été accepté par le serveur)
        if (player.get('club') && player.get('club').id) {
          $("#club").val(player.get('club').name);
        } else {
          $("#club").val("");
        }
      }).done(function (result) {
        Y.User.setPlayer(new PlayerModel(result));
        if (that.mode === 'first') {
          Y.Router.navigate("games/add", {trigger: true});       
        }
        else if (that.mode === 'search') {
          Y.Router.navigate("search/form", {trigger: true});       
        }  else {
          // FIXME: faut il vraiment quitter cette page ?
          //Y.Router.navigate("account", {trigger: true});
        }
      });
    });

    return false;
  },
     
  getPhoto: function() {
    var that = this;
    Cordova.Camera.capturePhoto(function (err, image) {
      image.dataUri = "data:image/jpeg;base64," + image.dataUri; // WARNING. might cost a lot of memory.
      that.onPhotoCaptured(image);
    });
  },

  delPhoto: function () {
    $('#image').attr("src", $("#image").attr("data-default-src"));
    $('#image').attr("data-modified", "true");
    this.updatePhotoButtonStatus();
  },

  updatePhotoButtonStatus: function (status) {
    if ($('#image').attr("src") == $("#image").attr("data-default-src")) {
      $('#getPhoto').show();
      $('#filepicker').show();
      $('#delPhoto').hide();
    } else {
      $('#getPhoto').hide();
      $('#filepicker').hide();
      $('#delPhoto').show();
    }
  },

  onPhotoCaptured: function (image) {
    var that = this;
    Y.Image.resize(image, function (err, image) {
      if (err)
        console.log("error resizing image : " + err);
      else {
        $('#image').attr("src", image.dataUri);
        $('#image').attr("data-modified", "true");
      }
      that.updatePhotoButtonStatus();
    });
  },
  
  nativeDate: function (event) {
   var currentField = $('#'+event.currentTarget.id);  
    var myNewDate = Date.parse(currentField.val()) || new Date();
    if(typeof myNewDate === "number"){ myNewDate = new Date (myNewDate); }
    
  if (window.plugins!==undefined) {
    // Same handling for iPhone and Android
      window.plugins.datePicker.show({
        date : myNewDate,
        mode : 'date', // date or time or blank for both
        allowOldDates : false
      }, function(returnDate) {
        var dateExpected = Date.fromString(new Date(returnDate));
        var month = dateExpected.getMonth() + 1;
        var date = (''+dateExpected.getFullYear())+'-'+('0'+month).slice(-2)+'-'+('0'+dateExpected.getDate()).slice(-2);
        currentField.val(date);      
              
        // This fixes the problem you mention at the bottom of this script with it not working a second/third time around, because it is in focus.
        currentField.blur();
      });
    }
  },  

  // FIXME: tests nested avec club & dates sont unsafes.
  hasBeenModified: function () {
    var player = Y.User.getPlayer()
      , birth = '';
    
    if (player.get('dates').birth)
      birth = Date.fromString(player.get('dates').birth).toYYYYMMDD('-');
    if ($('#image').attr("data-modified") == "true")
      return true;
    return player.get('name') !== $("#name").val() ||
           player.get('rank') !== $("#rank").val() ||
           player.get('club').name !== $("#club").val() ||
           player.get('gender') !== $('#gender').val() ||
           birth !== $("#birth").val();
  },

  // @param callback function(err, canClose) { }
  canClose: function (callback) {
    // si premiere connexion, on zap
    if (this.mode === "first") 
      return callback(null, true);
    
    // si rien n'est modifié => OK
    if (!this.hasBeenModified())
      return callback(null, true);

    // autrement, on prompt l'utilisateur
    navigator.notification.confirm(
      // chrome affiche "OK" / "CANCEL"
      // cordova affichera "OUI" / "ANNULER"
      // numéro du bouton   1 / 2
      i18n.t('message.savemessage'), // message
      function(buttonIndex){
        if (buttonIndex==1) {
          callback(null, true);
        }
        else {
          callback(null, false);
        }
      },  // callback
      i18n.t('message.savetitle'), // title
      i18n.t('message.saveyes')+','+i18n.t('message.savecancel') // buttonName
    );
  },

  startMonitoringModifications: function () {
    if (this.modificationMonitoringIntervalId)
      return; // do not monitor twice.
    // if modified => button orange.
    this.modificationMonitoringIntervalId = window.setInterval(_.bind(function () {
      if (this.hasBeenModified())
        $("#savePlayer").addClass("modified");
      else
        $("#savePlayer").removeClass("modified");
    }, this), 1000);
  },

  stopMonitoringModifications: function () {
    if (this.modificationMonitoringIntervalId) {
      window.clearInterval(this.modificationMonitoringIntervalId);
      this.modificationMonitoringIntervalId = null;
    }
  },

  onClose: function() { 
    Y.GUI.delBlueBackground();

    this.stopMonitoringModifications();
  }
});