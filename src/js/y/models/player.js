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

           window.localStorage.setItem("Y.Cache.Player",JSON.stringify(data));

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
          language : window.navigator.language,
          location : {
            currentPos : [ (this.get('latitude') || 0),(this.get('longitude') || 0), ]
          },
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
            window.localStorage.setItem("Y.Cache.Player", JSON.stringify(data));
            
            Y.Conf.set("playerid", data.id, { permanent: true })
            
          } else
            console.log('Erreur Creation User par defaut');
        },
        error : function(xhr, ajaxOptions, thrownError) {
        
        	console.log('erro rcreate Player',xhr);
        
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
        language : window.navigator.language,
        games : [],
        token : (this.get('token') || ''),
        location : {
          currentPos : [ (this.get('latitude') || 0),(this.get('longitude') || 0), ]
        },
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

      console.log('Update Player', dataSend);

      return $.ajax({
        dataType : 'json',
        url : Y.Conf.get("api.url.players") + (this.get('playerid') || '')
            + '/?playerid=' + (this.get('playerid') || '') + '&token='
            + (this.get('token') || ''),
        type : 'POST',
        data : dataSend,
        success : function(data) {

          console.log('Update Player Result', data);

          // Display Results //TODO : prevoir code erreur
          $('span.success').html('MAJ OK ' + data.id).show();

          if (data.id !== undefined) {

            // On met à jour le local storage
			console.log('On stocke dans le localStorage');
            window.localStorage.removeItem("Y.Cache.Player");
            window.localStorage.setItem("Y.Cache.Player", JSON.stringify(data));
          }
          else
			console.log('Erreur : On stocke pas dans le localStorage');          
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
