/*
 * overriding Y.Conf parameters
 */
Y.Conf.set("api.url.auth", [API_BASE_URL] + "/v1/auth/");
Y.Conf.set("api.url.bootstrap", [API_BASE_URL] + "/bootstrap/conf.json?version=%VERSION%");
Y.Conf.set("api.url.games", [API_BASE_URL] + "/v1/games/");
Y.Conf.set("api.url.players", [API_BASE_URL] + "/v1/players/");
Y.Conf.set("api.url.clubs", [API_BASE_URL] + "/v1/clubs/");
Y.Conf.set("api.url.stats", [API_BASE_URL] + "/v1/stats/");
Y.Conf.set("fb.url.inappbrowser.redirect", [FB_BASE_URL] + "/v1/inappbrowser/redirect.html?playerid=[playerid]&token=[token]");
Y.Conf.set("ut", 42);