/* global D3QueryResultVertexRenderer: true */
var D3QueryResultVertexRenderer = (function () {

  return {

    init: function (uiVertex, element) {
      var vertex = uiVertex.vertex;
      var queryVertexReference = vertex.getPropertyUnfiltered('_queryVertexReference');
      var entityType = vertex.getPropertyUnfiltered('entityType');

      var lineHeight = 25;
      var boxPadding = 10;
      var propertyKeys = vertex.getPropertyKeys();
      var numberOfLines = propertyKeys.length + 1;
      var currentHeight = -(numberOfLines * lineHeight) / 2 + lineHeight / 2;
      var boundingBoxCalculator = new BoundingBoxCalculator(boxPadding, lineHeight, numberOfLines);
      uiVertex.uiElement = element;

      var header = element.append('g').
        attr('class', 'query-result-vertex-header');

      var entityTypeLabel = header.append('text').
        attr('class', 'entity-type-label').
        attr('text-anchor', 'start').
        attr('y', currentHeight).
        text(entityType);

      var queryVertexRefLabel = header.append('text').
        attr('class', 'query-vertex-ref-label').
        attr('text-anchor', 'end').
        attr('y', currentHeight).
        text(queryVertexReference);

      var iconSize = 16;
      var zoomInIcon = header.append('use').
        attr('xlink:href', '#icon-zoomin').
        attr('y', currentHeight - iconSize + 2);

      boundingBoxCalculator.addElement(header[0][0]);

      for (var i = 0; i < propertyKeys.length; i++) {
        var propertyKey = propertyKeys[i];
        var propertyValue = vertex.getProperty(propertyKey);
        currentHeight += lineHeight;

        var propertyText = element.
          append('text').
          attr('text-anchor', 'middle').
          attr('x', 0).
          attr('y', currentHeight);

        propertyText.
          append('tspan').
          attr('class', 'property-name-label').
          text(propertyKey + ': ');

        propertyText.
          append('tspan').
          text(propertyValue);

        boundingBoxCalculator.addElement(propertyText[0][0]);
      }

      var linePadding = 5;
      var totalWidth = boundingBoxCalculator.totalWidth();
      var minWidth = header[0][0].getBBox().width + 5 * boxPadding;
      var totalHeight = boundingBoxCalculator.totalHeight();
      var dividerY = -(totalHeight / 2 - lineHeight) + linePadding;
      var leftEdge;
      var rightEdge;

      if (totalWidth > minWidth) {
        leftEdge = boundingBoxCalculator.leftEdge();
        rightEdge = boundingBoxCalculator.rightEdge();
      } else {
        totalWidth = minWidth;
        leftEdge = -totalWidth / 2;
        rightEdge = totalWidth / 2;
      }

      queryVertexRefLabel.attr('x', rightEdge - boxPadding - iconSize - 4);
      entityTypeLabel.attr('x', leftEdge + boxPadding);
      zoomInIcon.attr('x', rightEdge - boxPadding - iconSize);

      element.append('line')
        .attr('class', 'divider')
        .attr('x1', leftEdge)
        .attr('y1', dividerY)
        .attr('x2', rightEdge)
        .attr('y2', dividerY);

      element.
        insert('rect', '.query-result-vertex-header').
        attr('class', 'query-vertex-box').
        attr('rx', '4').
        attr('width', totalWidth).
        attr('height', totalHeight).
        attr('x', leftEdge).
        attr('y', boundingBoxCalculator.topEdge());
    },

    initDefs: function (defs) {
      var whiteGradient = defs.append('linearGradient')
        .attr('id', 'queryResultVertexDefaultFillScheme')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');

      whiteGradient.append('stop')
        .attr('offset', '0%')
        .attr('style', 'stop-color:#f9f9f9;stop-opacity:1');

      whiteGradient.append('stop')
        .attr('offset', '100%')
        .attr('style', 'stop-color:#edebf4;stop-opacity:1');

      var zoomInIcon = defs.append('g').
        attr('id', 'icon-zoomin');

      zoomInIcon.append('path').attr('d', 'M15.504 13.616l-3.79-3.223c-0.392-0.353-0.811-0.514-1.149-0.499 ' +
        '0.895-1.048 1.435-2.407 1.435-3.893 0-3.314-2.686-6-6-6-3.314 0-6 2.686-6 ' +
        '6 0 3.314 2.686 6 6 6 1.486 0 2.845-0.54 3.893-1.435-0.016 0.338 0.146 0.757 ' +
        '0.499 1.149l3.223 3.79c0.552 0.613 1.453 0.665 2.003 0.115s0.498-1.452-0.115-2.003zM6 ' +
        '10c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zM7 3h-2v2h-2v2h2v2h2v-2h2v-2h-2z');
    }

  };

}());