/* global D3QueryVertexRenderer: true */
var D3QueryVertexRenderer = (function () {

  return {

    init: function (uiVertex, element) {
      var vertex = uiVertex.vertex;
      var filters = vertex.getPropertyUnfiltered('filters') || [];
      var alias = vertex.getPropertyUnfiltered('alias');
      var entityType = vertex.getPropertyUnfiltered('entityType');

      var lineHeight = 25;
      var boxPadding = 10;
      var numberOfLines = 1 + filters.length;
      var currentHeight = -(numberOfLines * lineHeight) / 2 + lineHeight / 2;
      var boundingBoxCalculator = new BoundingBoxCalculator(boxPadding, lineHeight, numberOfLines);
      uiVertex.uiElement = element;

      var header = element.append('g').
        attr('class', 'query-vertex-header');

      var entityTypeLabel = header.append('text').
        attr('class', 'entity-type-label').
        attr('text-anchor', 'start').
        attr('y', currentHeight).
        text(entityType);

      var aliasText = header.append('text').
        attr('class', 'alias-label').
        attr('text-anchor', 'end').
        attr('y', currentHeight).
        text(alias);

      boundingBoxCalculator.addElement(header[0][0]);

      for (var i = 0; i < filters.length; i++) {
        var filter = filters[i];
        currentHeight += lineHeight;

        var propertyKey = D3QueryVertexRenderer.formatText(filter, alias, filter.propertyKey);
        var value = D3QueryVertexRenderer.formatText(filter, alias, filter.value);
        var text = D3QueryVertexRenderer.translateTextWithPredicate(filter.predicate, propertyKey, value);

        var filterText = element.
          append('text').
          attr('text-anchor', 'middle').
          attr('x', 0).
          attr('y', currentHeight).
          text(text);

        boundingBoxCalculator.addElement(filterText[0][0]);
      }

      var linePadding = 5;
      var totalWidth = boundingBoxCalculator.totalWidth();
      var minWidth = header[0][0].getBBox().width + 4 * boxPadding;
      var totalHeight = boundingBoxCalculator.totalHeight();
      var dividerY = -(totalHeight / 2 - lineHeight) + linePadding;
      var leftEdge;
      var rightEdge;

      if (totalWidth > minWidth) {
        leftEdge = boundingBoxCalculator.leftEdge();
        rightEdge = boundingBoxCalculator.rightEdge();
      } else {
        totalWidth = minWidth;
        leftEdge = boundingBoxCalculator.leftEdge() - boxPadding;
        rightEdge = boundingBoxCalculator.rightEdge() + boxPadding;
      }

      aliasText.attr('x', rightEdge - boxPadding);
      entityTypeLabel.attr('x', leftEdge + boxPadding);

      element.append('line')
        .attr('class', 'divider')
        .attr('x1', leftEdge)
        .attr('y1', dividerY)
        .attr('x2', rightEdge)
        .attr('y2', dividerY);

      element.
        insert('rect', '.query-vertex-header').
        attr('class', 'query-vertex-box').
        attr('rx', '4').
        attr('width', totalWidth).
        attr('height', totalHeight).
        attr('x', leftEdge).
        attr('y', boundingBoxCalculator.topEdge());
    },

    initDefs: function (defs) {
      var whiteGradient = defs.append('linearGradient')
        .attr('id', 'queryVertexDefaultFillScheme')
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

      var closeIcon = defs.append('symbol')
        .attr('id', 'icon-close')
        .attr('viewBox', '0 0 16 16');

      closeIcon.append('title').text('close');
      closeIcon.append('path')
        .attr('d', 'M2.343 13.657c-3.124-3.124-3.124-8.19 0-11.314 3.125-3.124 8.19-3.124 11.315 0 3.124 3.124 3.124 8.19 0 11.314-3.125 3.125-8.19 3.125-11.315 0zM12.243 3.757c-2.344-2.343-6.143-2.343-8.485 0-2.344 2.343-2.344 6.142 0 8.485 2.343 2.343 6.142 2.343 8.485 0 2.343-2.343 2.343-6.142 0-8.485zM5.879 11.536l-1.414-1.415 2.121-2.121-2.121-2.121 1.414-1.415 2.121 2.122 2.121-2.122 1.414 1.415-2.121 2.121 2.121 2.121-1.414 1.415-2.121-2.122-2.121 2.122z');
    },

    formatText: function (filter, alias, text) {
      if (filter.hasOwnProperty('referencedAlias')) {
        return alias + '.' + text;
      } else {
        return text;
      }
    },

    translateTextWithPredicate: function (predicate, propertyKey, value) {
      switch (predicate) {
      case 'LESS_THAN' :
        return propertyKey + ' < ' + value;
      case 'LESS_THAN_EQUAL' :
        return propertyKey + ' <= ' + value;
      case 'GREATER_THAN' :
        return propertyKey + ' > ' + value;
      case 'GREATER_THAN_EQUAL' :
        return propertyKey + ' >= ' + value;
      case 'CONTAINS' :
        return 'CONTAINS(' + propertyKey + ',' + value + ')';
      case 'CONTAINS_PREFIX' :
        return 'CONTAINS_PREFIX(' + propertyKey + ',' + value + ')';
      case 'CONTAINS_REGEX' :
        return 'CONTAINS_REGEX(' + propertyKey + ',' + value + ')';
      case 'PREFIX' :
        return 'PREFIX(' + propertyKey + ',' + value + ')';
      case 'REGEX' :
        return 'REGEX(' + propertyKey + ',' + value + ')';
      case 'EQUAL' :
        return propertyKey + ' = ' + value;
      case 'NOT_EQUAL' :
        return propertyKey + decodeURI(' \u2260 ') + value;
      case 'IN' :
        return propertyKey + decodeURI(' \u2208 ') + value;
      case 'NOT_IN' :
        return propertyKey + decodeURI(' \u2209 ') + value;
      }
    }

  };

}());