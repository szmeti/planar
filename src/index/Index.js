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
    }

  });

  return Index;

}());
