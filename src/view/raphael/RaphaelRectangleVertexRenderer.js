/* global RaphaelRectangleVertexRenderer: true */
var RaphaelRectangleVertexRenderer = (function () {

  return {

    init: function (vertex, paper) {
      vertex.ui.element = paper.rect(0, 0, 60, 40, 10);
    },

    render: function (vertex) {
      vertex.ui.element.attr(vertex.ui.position);
    }

  };

}());