(function (Y, undefined) {
  /*#ifdef STRICT*/
  "use strict";
  /*#endif*/

  var DB = new Y.DB("Y.Cache.");

  var player = null;
  var playerIdConfKey = 'player.id';
  var playerTokenConfKey = 'player.token';
  var playerClubIdConfKey = 'player.club.id';
  
  var User = {
    // @return PlayerModel/null   Player
    getPlayer: function () {
      if (player)
        return player;
      var unserializedPlayer = DB.readJSON("Player");
      if (unserializedPlayer) {
        // fixme: another way of doing serialize/unserialize ?
        player = new PlayerModel();
        player.set(unserializedPlayer);
        return player;
      }
      // FIXME: should we really do this...
      // REDIRECT ON INDEX (to create a new player...)
      return null;
    },

    //
    // Workflow:
    //  - 1: search player in memory
    //  - 2: if not found => search player in localStorage
    //  - 3: if not found => search player id in Conf & read player.
    //
    // @param function callback    callback(err, player)
    // @return void.
    getPlayerAsync: function (callback) {
      if (player) {
        callback(null, player);
        return;
      }
      // reading from localStorage (synchrone api)
      var unserializedPlayer = DB.readJSON("Player");
      if (unserializedPlayer) {
        // fixme: another way of doing serialize/unserialize ?
        player = new PlayerModel();
        player.set(unserializedPlayer);
        callback(null, player);
        return;
      }
      // have we got a player id in conf ?
      var playerId = Y.Conf.get(playerIdConfKey);
      var playerToken = Y.Conf.get(playerTokenConfKey);
      if (!playerId || !playerToken) {
        callback(new Error("no player"));
        return;
      }
      // reading player
      player = new PlayerModel({
        playerid: playerId
      , token: playerToken
      });
      player.fetch({
        success: function () {
          // saving it in DB
          DB.saveJSON("Player", player);
          //
          callback(null, player);
        }
      });
    },

	setClub: function (clubid) {	
      Y.Conf.set(playerClubIdConfKey, clubid, { permanent: true });		
	},
	
	getClub: function () {	
      return Y.Conf.get(playerClubIdConfKey);		
	},	

    setPlayer: function (player) {
      assert(player instanceof PlayerModel);
      assert(player.get('id') !== undefined);
      assert(player.get('token') !== undefined);

      // saving in memory
      player = player;
      // saving in local storage for future session
      DB.saveJSON("Player", player);
      // saving playerid in file (permanent)
      Y.Conf.set(playerIdConfKey, player.get('id'), { permanent: true });
      Y.Conf.set(playerTokenConfKey, player.get('token'), { permanent: true });
    },

    createPlayerAsync: function (callback) {
      var that = this;
      player = new PlayerModel({});
      player.save({}, {
        success: function () {
          // saving it.
          that.setPlayer(player);
          // answer
          callback(null, player);
        },
        error: function (e) { callback(e); }
      });
    }
  };

  Y.User = User;
})(Y);