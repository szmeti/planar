/* global Element: true */
var Element = (function () {

  return {

    initProperties: function (graph) {
      this.properties = [];
      this.graph = graph;
    },

    setProperty: function (key, value) {
      utils.checkExists('Property key', key);
      utils.checkExists('Property value', value);
      utils.checkNotEmpty('Property key', key);
      var oldValue = this.properties[key];
      this.properties[key] = value;
      this.graph.indexManager.updateKeyIndexValue(key, value, oldValue, this);
    },

    getProperty: function (key) {
      return utils.isUndefined(this.properties[key]) ? null : this.properties[key];
    },

    getPropertyKeys: function () {
      return utils.keys(this.properties);
    },

    removeProperty: function (key) {
      var value = this.getProperty(key);
      delete this.properties[key];
      this.graph.indexManager.removeKeyIndexValue(key, value, this);
      return value;
    },

    getId: function () {
      return this.id;
    },

    getGraph: function() {
      return this.graph;
    }

  };

}());
