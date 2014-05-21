/* global D3Engine: true */
var D3Engine = (function () {

  function D3Engine() {
  }

  utils.mixin(D3Engine.prototype, {

    init: function (container, width, height) {
      utils.checkExists('Container', container);

      this.svg = d3.select(container).
        append('svg').
        attr('width', width).
        attr('height', height);

      var link = this.svg.selectAll(".edge")
        .data(json.links)
        .enter().append("line")
        .attr("class", "link");

      var node = this.svg.selectAll(".vertex")
        .data(json.nodes)
        .enter().append("g")
        .attr("class", function (vertex) {
          var vertexType = vertex.getProperty(PROP_TYPE);
          return "vertex " + vertexType;
        });
    },

    initVertex: function (vertex) {

    },

    renderVertex: function (vertex) {

    }

  });

  return D3Engine;

}());