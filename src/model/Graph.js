/* global Graph: true */
var Graph = (function () {

  function Graph() {
    this.vertices = {};
    this.edges = {};
    this.indexManager = new IndexManager(this);
  }

  utils.mixin(Graph.prototype, {

    addVertex: function (id) {
      if (utils.isUndefined(id) || id === null) {
        id = utils.generateId();
        while (this.getVertex(id) !== null) {
          id = utils.generateId();
        }
      }

      var vertex = this.getVertex(id);
      if (!vertex) {
        vertex = new Vertex(id, this);
      }

      this.vertices[id] = vertex;

      return vertex;
    },

    getVertex: function (id) {
      utils.checkExists('ID', id);
      return utils.isUndefined(this.vertices[id]) ? null : this.vertices[id];
    },

    removeVertex: function (vertex) {
      utils.checkExists('Vertex', vertex);

      var storedVertex = this.getVertex(vertex.id);

      if (storedVertex) {
        var id;
        for (id in storedVertex.inEdges) {
          this.removeEdge(storedVertex.inEdges[id]);
        }
        for (id in storedVertex.outEdges) {
          this.removeEdge(storedVertex.outEdges[id]);
        }

        this.indexManager.removeElement(storedVertex);
        delete this.vertices[storedVertex.id];
      }
    },

    getVertices: function (key, value) {
      if (utils.isUndefined(key) || key === null) {
        return utils.values(this.vertices);
      } else {
        return new GraphQuery(this).has(key, value).vertices();
      }
    },

    addEdge: function (id, outVertex, inVertex, label) {
      if (utils.isUndefined(id) || id === null) {
        id = utils.generateId();
        while (this.getEdge(id) !== null) {
          id = utils.generateId();
        }
      }

      var edge = new Edge(id, outVertex, inVertex, label, this);
      this.edges[id] = edge;

      outVertex.outEdges[edge.id] = edge;
      inVertex.inEdges[edge.id] = edge;

      return edge;
    },

    getEdge: function (id) {
      utils.checkExists('ID', id);
      return utils.isUndefined(this.edges[id]) ? null : this.edges[id];
    },

    removeEdge: function (edge) {
      if (edge) {
        var edgeToDelete = this.edges[edge.id];
        if (edgeToDelete) {
          this.indexManager.removeElement(edgeToDelete);
          delete this.edges[edgeToDelete.id];
          delete edgeToDelete.outVertex.outEdges[edgeToDelete.id];
          delete edgeToDelete.inVertex.inEdges[edgeToDelete.id];
        }
      }
    },

    getEdges: function (key, value) {
      if (utils.isUndefined(key) || key === null) {
        return  utils.values(this.edges);
      } else {
        return new GraphQuery(this).has(key, value).edges();
      }
    },

    forEachVertex: function (callback) {
      if (utils.isFunction(callback)) {
        for (var id in this.vertices) {
          if (callback(this.vertices[id])) {
            return;
          }
        }
      }
    },

    forEachEdge: function (callback) {
      if (utils.isFunction(callback)) {
        for (var id in this.edges) {
          if (callback(this.edges[id])) {
            return;
          }
        }
      }
    },

    query: function () {
      return new GraphQuery(this);
    },

    createIndex: function (name, type) {
      return this.indexManager.createIndex(name, type);
    },

    getIndex: function (name, type) {
      return this.indexManager.getIndex(name, type);
    },

    getIndices: function () {
      return this.indexManager.getIndices();
    },

    dropIndex: function (name) {
      this.indexManager.dropIndex(name);
    },

    createKeyIndex: function (key, type) {
      return this.indexManager.createKeyIndex(key, type);
    },

    getIndexedKeys: function (type) {
      return this.indexManager.getIndexedKeys(type);
    },

    dropKeyIndex: function (key, type) {
      this.indexManager.dropKeyIndex(key, type);
    }

  });

  return Graph;

}());
