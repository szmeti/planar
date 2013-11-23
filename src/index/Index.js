/* global Index: true */
var Index = (function () {

  function Index(name, type) {
    utils.checkExists('Name', name);
    utils.checkExists('Type', type);

    this.name = name;
    this.type = type;
    this.index = {};
  }

  utils.mixin(Index.prototype, {

    getIndexName: function () {
      return this.name;
    },

    getIndexType: function () {
      return this.type;
    },

    put: function (key, value, element) {
      utils.checkExists('Key', key);
      utils.checkExists('Value', value);
      utils.checkType('Element', element, this.type);
      var keyHash = this.index[key] = this.index[key] || {};
      var elements = keyHash[value] = keyHash[value] || {};
      elements[element.getId()] = element;
    },

    putAll: function (key, elements) {
      utils.checkExists('Key', key);
      utils.checkArray('Elements', elements);

      for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        utils.checkType('Element ' + i, element, this.type);
        var value = element.getProperty(key);
        if (value) {
          this.put(key, value, element);
        }
      }
    },

    get: function (key, value) {
      var keyHash = this.index[key] || {};
      var elements = keyHash[value] || {};
      return utils.values(elements);
    },

    count: function (key, value) {
      return this.get(key, value).length;
    },

    remove: function (key, value, element) {
      utils.checkType('Element', element, this.type);
      var keyHash = this.index[key];
      if (keyHash) {
        var elements = keyHash[value];
        if (elements) {
          delete elements[element.getId()];
        }
      }
    },

    removeElement: function (element) {
      utils.checkType('Element', element, this.type);
      for (var key in this.index) {
        var elements = this.index[key];
        if (elements) {
          for (var value in elements) {
            delete elements[value][element.getId()];
          }
        }
      }
    },

    removeKey: function (key) {
      delete this.index[key];
    },

    getIndexedKeys: function () {
      return utils.keys(this.index);
    },

    update: function (key, newValue, oldValue, element) {
      if (utils.indexOf(key, this.getIndexedKeys()) > -1) {
        if (!utils.isUndefined(oldValue)) {
          this.remove(key, oldValue, element);
        }
        this.put(key, newValue, element);
      }
    }

  });

  return Index;

}());
