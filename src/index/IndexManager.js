/* global IndexManager: true */
var IndexManager = (function () {

  function IndexManager(graph) {
    utils.checkExists('Graph', graph);

    this.graph = graph;
    this.indices = {};
    this.vertexKeyIndex = new Index(name, Vertex);
    this.edgeKeyIndex = new Index(name, Edge);
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

    createKeyIndex: function (key, type) {
      if (type === Vertex) {
        return indexElementsByKey(this.vertexKeyIndex, this.graph.getVertices(), key);
      } else if (type === Edge) {
        return indexElementsByKey(this.edgeKeyIndex, this.graph.getEdges(), key);
      } else {
        throw {
          message: 'Invalid type'
        };
      }
    },

    getIndex: function (name, type) {
      var index = this.indices[name];
      if (utils.isUndefined(index)) {
        return null;
      }

      if (type !== index.getIndexType()) {
        throw {
          message: 'Invalid index type'
        };
      }

      return index;
    },

    getIndices: function () {
      return utils.values(this.indices);
    },

    getIndexedKeys: function (type) {
      return this._getKeyIndex(type).getIndexedKeys();
    },

    dropIndex: function (name) {
      delete this.indices[name];
    },

    dropKeyIndex: function (key, type) {
      this._getKeyIndex(type).removeKey(key);
    },

    removeElement: function (element) {
      var indices = utils.values(this.indices);
      for (var i = 0; i < indices.length; i++) {
        var index = indices[i];
        if (utils.isOfType(element, index.getIndexType())) {
          index.removeElement(element);
        }
      }
      this._getKeyIndex(element.constructor).removeElement(element);
    },

    updateKeyIndexValue: function(key, newValue, oldValue, element) {
      this._getKeyIndex(element.constructor).update(key, newValue, oldValue, element);
    },

    removeKeyIndexValue: function(key, oldValue, element) {
      this._getKeyIndex(element.constructor).remove(key, oldValue, element);
    },

    fetchFirstMatching: function(type, filters) {
      var keys = this.getIndexedKeys(type);

      for (var i = 0; i < filters.length; i++) {
        var filter = filters[i];
        if (filter.predicate === Compare.EQUAL && utils.indexOf(filter.key, keys) > -1) {
          return this._getKeyIndex(type).get(filter.key, filter.value);
        }
      }

      return null;
    },

    _getKeyIndex: function (type) {
      if (type === Vertex) {
        return this.vertexKeyIndex;
      } else if (type === Edge) {
        return this.edgeKeyIndex;
      } else {
        throw {
          message: 'Invalid type'
        };
      }
    }

  });

  function indexElementsByKey(index, elements, key) {
    index.removeKey(key);
    index.index[key] = {};
    index.putAll(key, elements);
    return index;
  }

  return IndexManager;

}());
