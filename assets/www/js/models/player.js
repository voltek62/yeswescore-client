var PlayerModel = Backbone.Model.extend({
  urlRoot : Y.Conf.get("api.url.players"),

  mode : '',

  defaults : {
    name : "",
    nickname : "",
    rank : "NC",
    type : "default",
    games : [],
    club : {
      id : "",
      name : ""
    },
    dates : {
      update : "",
      creation : new Date()
    },
    language : window.navigator.language,
    location : {
      currentPos : [ 0, 0 ]
    },
    updated_at : new Date()
  },

  initialize : function() {

  },

  login : function(mail, password) {

    return $.ajax({
      dataType : 'json',
      url : Y.Conf.get("api.url.auth"),
      type : 'POST',
      data : {
        email : {address : mail},
        uncryptedPassword : password
      },
      success : function(data) {

        console.log('data result Login', data);

        // Display Results
        // TODO : prevoir code erreur
        if (data.id !== undefined) {
          $('span.success').html('Login OK ' + data.id).show();

           window.localStorage.setItem("Owner",JSON.stringify(data));

           //players = new PlayersCollection('me');
           //players.create(data);

        } else
          $('span.success').html('Erreur').show();

        // FIXME : on redirige sur la page moncompte

      }
    });

  },
  
  
  newpass : function(mail) {
    
    console.log('On demande un newpass');

    return $.ajax({
      dataType : 'json',
      url : Y.Conf.get("api.url.auth")+"resetPassword/",
      type : 'POST',
      data : {
        email : {address : mail}
      },
      success : function(data) {

        console.log('data result Reset Password', data);

        // Display Results
        // TODO : prevoir code erreur
        
        
          $('span.success').html(' ' + data.message+' Attention, le mail qui rappelle votre mot de passe peut arriver dans le spam.').show();
       
        
      }
    });

  },  

  sync : function(method, model, options) {

    console.log('Player sync:' + method + " playerid:"+this.get('playerid')+" id:"+this.id);

    if (method==='create' && this.get('playerid') === undefined) {

      return $.ajax({
        dataType : 'json',
        url : Y.Conf.get("api.url.players"),
        type : 'POST',
        data : {
          nickname : (this.get('nickname') || ''),
          name : (this.get('name') || ''),
          rank : (this.get('rank') || ''),
          email : (this.get('email') || ''),
          uncryptedPassword : (this.get('password') || ''),
          club : (this.get('club') || '')
        },
        success : function(data) {

          console.log('Create Player', data);

          // Display Results
          // TODO : prevoir code erreur
          if (data.id !== null)
            $('span.success').html('Enregistrement OK ' + data.id).show();
          else
            $('span.success').html('Erreur').show();

          // FIXME : recup id et token = player ok
          // On fixe dans localStorage
          if (data.token !== null) {
            data.password = '';
            window.localStorage.setItem("Owner", JSON.stringify(data));
          } else
            console.log('Erreur Creation User par defaut');
        },
        error : function(xhr, ajaxOptions, thrownError) {
        }
      });

    }
    // Update
    else if ( this.get('playerid') !== undefined ){

		
      var dataSend = {
        id : (this.get('playerid') || ''),
        nickname : (this.get('nickname') || ''),
        name : (this.get('name') || ''),
        email : {address : (this.get('email') || '')},
        rank : (this.get('rank') || ''),
        idlicense : (this.get('idlicense') || ''),
        games : [],
        token : (this.get('token') || '')
      };

      // si mot de passe defini
      if (this.get('password') !== '') {
        dataSend.uncryptedPassword = this.get('password');
      }
      // si club non nul
      if (this.get('clubid') !== '') {
        dataSend.club = {
          id : (this.get('clubid') || undefined)
        };
      }

      //console.log('dataSend', dataSend);

      return $.ajax({
        dataType : 'json',
        url : Y.Conf.get("api.url.players") + (this.get('playerid') || '')
            + '/?playerid=' + (this.get('playerid') || '') + '&token='
            + (this.get('token') || ''),
        type : 'POST',
        data : dataSend,
        success : function(data) {

          console.log('Update Player', data);

          // Display Results //TODO : prevoir code erreur
          $('span.success').html('MAJ OK ' + data.id).show();

          if (data.id !== undefined) {

            // On met à jour le local storage

            window.localStorage.removeItem("Owner");
            window.localStorage.setItem("Owner", JSON.stringify(data));
          }
        }
      });
      
      

    }
    else {
    	model.url = Y.Conf.get("api.url.players")+this.id;
	    console.log('model.url : ',model.url);
	    
	    return Backbone.sync(method, model, options);
    
    }



  }

});
