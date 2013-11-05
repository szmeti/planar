/* global Edge: true */
var Edge = (function () {

  function Edge(id, outVertex, inVertex, label, graph) {
    utils.checkExists('ID', id);
    utils.checkExists('Out vertex', outVertex);
    utils.checkExists('In vertex', inVertex);

    this.id = id;
    this.outVertex = outVertex;
    this.inVertex = inVertex;
    this.label = label;
    this.graph = graph;
    this.initProperties();
  }

  utils.mixin(Edge.prototype, Element);

  utils.mixin(Edge.prototype, {

    getLabel: function () {
      return this.label;
    },

    getInVertex: function () {
      return this.inVertex;
    },

    getOutVertex: function () {
      return this.outVertex;
    },

    getVertex: function (direction) {
      if (direction === OUT) {
        return this.outVertex;
      } else if (direction === IN) {
        return this.inVertex;
      } else {
        throw {
          message: 'Invalid direction. Must be either IN or OUT'
        };
      }
    },

    remove: function () {
      this.graph.removeEdge(this);
    }

  });

  return Edge;

}());