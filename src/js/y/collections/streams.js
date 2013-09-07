var StreamsCollection = Backbone.Collection.extend({
  model: StreamModel, 
  mode: 'default',
  query: '',
 	
  initialize: function (streamItems, options) {
  },

  url: function() {
  },
	
  comparator: function (item) {
    var dates = item.get("dates");
    if (dates && dates.creation)
      //return new Date(dates.creation).getTime();
      return Date.fromString(dates.creation).getTime();
    assert(false);
    return 0; // at the end of the list.
  },

  // default behaviour: remove = false.
  fetch: function (o) {
    o = o || {};
    o.remove = o.remove || false;
    return Backbone.Collection.prototype.fetch.call(this, o);
  }
});