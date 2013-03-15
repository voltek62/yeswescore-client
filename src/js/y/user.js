(function (Y, undefined) {

  var DB = new Y.DB("Y.Cache.");

  var player = null;
  var playerIdConfKey = 'player.id';
  var playerTokenConfKey = 'player.token';

  var User = {
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
      player = DB.readJSON("Player");
      if (player) {
        callback(null, player);
        return;
      }
      // have we got a player id in conf ?
      var playerId = Y.Conf.get(playerIdConfKey);
      var playerToken = Y.Conf.get(playerTokenConfKey);
      if (!playerId || !token) {
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
        } .bind(this)
      });
    },

    setPlayer: function (player) {
      assert(typeof player === "object");
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
      player = new PlayerModel({});
      player.save({}, {
        success: function () {
          // saving it.
          this.setPlayer(player);
          // answer
          callback(null, player);
        }.bind(this),
        error: function (e) { callback(e); }
      });
    }
  };

  Y.User = User;
})(Y);