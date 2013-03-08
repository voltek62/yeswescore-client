// ALL USEFUL FCTS
JSON.tryParse = function(o) {
  try {
    return JSON.parse(o);
  } catch (e) {
    return null;
  }
};

var assert = function () { };
// @ifdef DEV
assert = function (t) { if (!t) throw "assert false" };
// @endif