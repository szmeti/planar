/* global Graph: true */
var Graph = (function () {

  function Graph(container, engine) {
    this.vertices = {};
    this.edges = {};
    this.indexManager = new IndexManager(this);

    if (utils.exists(container) && utils.exists(engine)) {
      this.renderer = new Renderer(this, container, engine);
      this.renderer.init();
    }
  }

  utils.mixin(Graph.prototype, EventEmitter);

  utils.mixin(Graph.prototype, {

    addVertex: function (id) {
      if (utils.isUndefined(id) || id === null) {
        id = utils.generateId();
        while (this.getVertex(id) !== null) {
          id = utils.generateId();
        }
      }

      var vertex = this.getVertex(id);
      if (vertex) {
        throw {
          message: 'Vertex already exists with the given ID'
        };
      } else {
        vertex = new Vertex(id, this);
      }

      this.vertices[id] = vertex;
      this.trigger('vertexAdded', vertex);

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
        this.trigger('vertexRemoved', storedVertex);
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

      if (this.edges[id]) {
        throw {
          message: 'Edge already exists with the given ID'
        };
      } else {
        this.edges[id] = edge;
      }

      outVertex.outEdges[edge.id] = edge;
      inVertex.inEdges[edge.id] = edge;

      this.trigger('edgeAdded', edge);

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
          this.trigger('edgeRemoved', edge);
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
    },

    render: function () {
      this.renderer.render();
    }

  });

  return Graph;

}());
