/* global VertexQuery: true */
var VertexQuery = (function () {

  function VertexQuery(vertex) {
    utils.checkExists('Vertex', vertex);
    this.initQuery();
    this.vertex = vertex;
    this.queryLabels = [];
    this.queryDirection = BOTH;
  }

  utils.mixin(VertexQuery.prototype, Query);

  utils.mixin(VertexQuery.prototype, {

    direction: function (direction) {
      utils.checkInArray('direction', direction, [IN, OUT, BOTH]);
      this.queryDirection = direction;
      return this;
    },

    labels: function () {
      this.queryLabels = utils.convertVarArgs(arguments);
      return this;
    },

    getInitialEdges: function () {
      return filterByDirection(this.queryDirection, this.vertex);
    },

    getInitialVertices: function () {
      // we return the edges here and the result extractor will extract the appropriate vertices
      return filterByDirection(this.queryDirection, this.vertex);
    },

    getBaseFilters: function () {
      return this.queryLabels.length > 0 ? [new LabelFilter(this.queryLabels)] : [];
    },

    resultExtractor: function (self) {
      return function (edge) {
        if (self.queryDirection === IN) {
          return edge.getOutVertex();
        } else if (self.queryDirection === OUT) {
          return edge.getInVertex();
        } else if (edge.getOutVertex() === self.vertex) {
          return edge.getInVertex();
        } else {
          return edge.getOutVertex();
        }
      };
    },

    count: function() {
      return this.edges().length;
    }

  });

  function filterByDirection(direction, vertex) {
    var edges = [];

    if (direction === IN) {
      edges.push(vertex.inEdges);
    } else if (direction === OUT) {
      edges.push(vertex.outEdges);
    } else {
      edges.push(vertex.inEdges);
      edges.push(vertex.outEdges);
    }

    return edges;
  }

  return VertexQuery;

}());