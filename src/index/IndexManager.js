/* global IndexManager: true */
var IndexManager = (function () {

  function IndexManager(graph) {
    utils.checkExists('Graph', graph);

    this.graph = graph;
    this.indices = {};
  }

  utils.mixin(IndexManager.prototype, {

    createIndex: function (name, type) {
      utils.checkExists('Name', name);
      utils.checkExists('Type', type);

      if (this.indices.hasOwnProperty(name)) {
        throw {
          message: 'Index already exists'
        };
      }

      var index = new Index(name, type);
      this.indices[name] = index;

      return index;
    },

    getIndex: function (name, type) {
      var index = this.indices[name];
      if (utils.isUndefined(index)) {
        return null;
      }

      utils.checkType('Type', type, index.getIndexType());

      return index;
    },

    getIndices: function () {
      return utils.values(this.indices);
    },

    dropIndex: function (name) {
      delete this.indices[name];
    },

    removeElement: function (element) {
      var indices = utils.values(this.indices);
      for (var i = 0; i < indices.length; i++) {
        var index = indices[i];
        if (utils.isOfType(element, index.getIndexType())) {
          index.removeElement(element);
        }
      }
    }

  });

  return IndexManager;

}());
