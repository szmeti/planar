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
    this.initProperties(graph);
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

    getOtherVertex: function (vertex) {
      return this.inVertex.getId() === vertex.getId() ? this.outVertex : this.inVertex;
    },

    remove: function () {
      this.graph.removeEdge(this);
    },

    connects : function (v1, v2) {
      return (this.outVertex.id === v1.id && this.inVertex.id === v2.id) ||
        (this.outVertex.id === v2.id && this.inVertex.id === v1.id);
    }

  });

  return Edge;

}());
