/* global Element: true */
var Element = (function () {

  return {

    initProperties: function () {
      this.properties = [];
    },

    setProperty: function (key, value) {
      utils.checkExists('Property key', key);
      utils.checkExists('Property value', value);
      utils.checkNotEmpty('Property key', key);
      this.properties[key] = value;
    },

    getProperty: function (key) {
      return utils.isUndefined(this.properties[key]) ? null : this.properties[key];
    },

    getPropertyKeys: function () {
      var keys = [];

      for (var key in this.properties) {
        keys.push(key);
      }

      return keys;
    },

    removeProperty: function (key) {
      var value = this.getProperty(key);
      delete this.properties[key];
      return value;
    },

    getId: function () {
      return this.id;
    }

  };

}());