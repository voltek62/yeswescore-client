(function (Y, undefined) {
  "use strict";

  // DB: no need of any drivers
  //  localStorage is supported on android / iOS
  //  @see http://caniuse.com/#feat=namevalue-storage
  //
  // FIXME: utiliser une surcouche au localstorage qui gère le quota et 
  //    une notion de date et priorité (#44910971)
  var DB = function (prefix) {
    // in local storage, all conf keys will be prefixed "prefix"
    this.prefix = prefix || "";
  };

  DB.prototype.save = function (k, v) {
    assert(typeof k === "string");
    assert(typeof v === "string");

    window.localStorage.setItem(this.prefix + k, v);
  };

  // @return value/null if not exist.
  DB.prototype.read = function (k) {
    assert(typeof k === "string");

    return window.localStorage.getItem(this.prefix + k);
  };

  DB.prototype.remove = function (k) {
    assert(typeof k === "string");

    return window.localStorage.removeItem(k);
  };

  // 
  DB.prototype.saveJSON = function (k, v) {
    assert(typeof k === "string");
    assert(typeof v !== undefined);

    this.save(k, JSON.stringify(v));
  };

  // @return value or undefined if not exist/errors.
  DB.prototype.readJSON = function (k) {
    var v = this.read(k);
    if (v === null)
      return undefined;
    return JSON.tryParse(v);
  };

  DB.prototype.getKeys = function () {
    return _.filter(_.keys(window.localStorage), function (k) {
      return k.substr(0, this.prefix.length) == this.prefix;
    }, this);
  };

  // setting conf
  Y.DB = DB;
})(Y);
