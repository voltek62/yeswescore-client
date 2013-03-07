// ALL USEFUL FCTS
JSON.tryParse = function(o) {
  try {
    return JSON.parse(o);
  } catch (e) {
    return null;
  }
};

var assert = function () { };
// #BEGIN_DEV
assert = function (t) { if (!t) throw "assert false" };
// #END_DEV