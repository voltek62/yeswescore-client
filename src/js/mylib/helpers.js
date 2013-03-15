// ALL USEFUL FCTS
JSON.tryParse = function(o, undefined) {
  try {
    return JSON.parse(o);
  } catch (e) {
    return undefined;
  }
};

var assert = function () { };
// @ifdef DEV
assert = function (t) { if (!t) throw "assert false" };
// @endif