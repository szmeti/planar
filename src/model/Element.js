/* global Element: true */
var Element = (function () {

  function checkPropertyAccess(graph, element, propertyKey, disabledFilters) {
    var filterPredicates = graph.getPropertyFilters(element, disabledFilters);

    for (var i = 0; i < filterPredicates.length; i++) {
      if (!filterPredicates[i].isVisible(element, propertyKey)) {
        return false;
      }
    }

    return true;
  }

  return {

    initProperties: function (graph) {
      this.properties = [];
      this.graph = graph;
    },

    setProperty: function (key, value) {
      utils.checkExists('Property key', key);
      utils.checkExists('Property value', value);
      utils.checkNotEmpty('Property key', key);

      if (checkPropertyAccess(this.graph, this, key, Array.prototype.splice.call(arguments, 2))) {
        this.setPropertyUnfiltered(key, value);
      }
    },

    setPropertyUnfiltered: function (key, value) {
      utils.checkExists('Property key', key);
      utils.checkExists('Property value', value);
      utils.checkNotEmpty('Property key', key);

      var oldValue = this.properties[key];
      this.properties[key] = value;
      this.graph.indexManager.updateKeyIndexValue(key, value, oldValue, this);
      this.graph.trigger('propertyUpdated', this, key, value, oldValue);
    },

    getProperty: function (key) {
      if (checkPropertyAccess(this.graph, this, key, Array.prototype.splice.call(arguments, 1))) {
        return this.getPropertyUnfiltered(key);
      } else {
        return null;
      }
    },

    getPropertyUnfiltered: function (key) {
      return utils.isUndefined(this.properties[key]) ? null : this.properties[key];
    },

    getPropertyKeys: function () {
      var keys = [];

      for (var key in this.properties) {
        if (this.properties.hasOwnProperty(key) && checkPropertyAccess(this.graph, this, key, Array.prototype.slice.call(arguments))) {
          keys.push(key);
        }
      }

      return keys;
    },

    getPropertyKeysUnfiltered: function () {
      return utils.keys(this.properties);
    },

    removeProperty: function (key) {
      if (checkPropertyAccess(this.graph, this, key, Array.prototype.splice.call(arguments, 1))) {
        return this.removePropertyUnfiltered(key);
      } else {
        return null;
      }
    },

    removePropertyUnfiltered: function (key) {
      var value = this.getProperty(key);
      delete this.properties[key];
      this.graph.indexManager.removeKeyIndexValue(key, value, this);
      this.graph.trigger('propertyRemoved', this, key, value);
      return value;
    },

    copyPropertiesTo: function (to) {
      var propertyKeys = this.getPropertyKeys();
      for (var i = 0; i < propertyKeys.length; i++) {
        var key = propertyKeys[i];
        var value = this.getProperty(key);
        to.setProperty(key, value);
      }
    },

    getId: function () {
      return this.id;
    },

    getGraph: function () {
      return this.graph;
    }

  };

}());
