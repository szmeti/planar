/* global Vertex: true */
var Vertex = (function () {
  function Vertex(id, graph) {
    this.id = id;
    this.inEdges = {};
    this.outEdges = {};
    this.graph = graph;
    this.initProperties();
  }

  utils.mixin(Vertex.prototype, Element);

  utils.mixin(Vertex.prototype, {

    getEdges: function (direction) {
      var labels = Array.prototype.slice.call(arguments, 1);
      return new VertexQuery(this).labels(labels).direction(direction).edges();
    },

    getVertices: function (direction) {
      var labels = Array.prototype.slice.call(arguments, 1);
      return new VertexQuery(this).labels(labels).direction(direction).vertices();
    },

    addEdge: function (label, inVertex) {
      return this.graph.addEdge(null, this, inVertex, label);
    },

    remove: function () {
      this.graph.removeVertex(this);
    }

  });

  return Vertex;
}());