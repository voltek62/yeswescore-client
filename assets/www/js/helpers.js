// ALL USEFUL FCTS
JSON.tryParse = function(o) {
  try {
    return JSON.parse(o);
  } catch (e) {
    return null;
  }
};
