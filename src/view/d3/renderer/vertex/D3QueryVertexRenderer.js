/* global D3QueryVertexRenderer: true */
var D3QueryVertexRenderer = (function () {

  return {

    init: function (uiVertex, element) {
      var vertex = uiVertex.vertex;
      var filters = vertex.getProperty('filters') || [];
      var alias = vertex.getProperty('alias');

      var lineHeight = 25;
      var boxPadding = 20;
      var totalHeight = (1 + filters.length) * lineHeight;
      var currentHeight = -totalHeight / 2 + lineHeight / 2;

      var aliasText = element.append('text').
        attr('class', 'alias-label').
        attr('text-anchor', 'middle').
        attr('x', 0).
        attr('y', currentHeight).
        text(alias);

      var width = aliasText[0][0].getBBox().width;

      for (var i = 0; i < filters.length; i++) {
        var filter = filters[i];
        currentHeight += lineHeight;

        var filterText = element.
          append('text').
          attr('text-anchor', 'middle').
          attr('x', 0).
          attr('y', currentHeight).
          text(filter.propertyKey);

        width = filterText[0][0].getBBox().width > width ? filterText[0][0].getBBox().width : width;
      }

      element.
        insert('rect', '.alias-label').
        attr('class', 'query-vertex-box').
        attr('width', width + boxPadding * 2).
        attr('height', totalHeight + boxPadding * 2).
        attr('x', -width / 2 - boxPadding).
        attr('y', -totalHeight / 2 - boxPadding);
    }

  };

}());