/* global D3QueryVertexRenderer: true */
var D3QueryVertexRenderer = (function () {

  return {

    init: function (uiVertex, element) {
      var vertex = uiVertex.vertex;
      var filters = vertex.getProperty('filters') || [];
      var alias = vertex.getProperty('alias');

      var lineHeight = 25;
      var boxPadding = 10;
      var numberOfLines = 1 + filters.length;
      var currentHeight = -(numberOfLines * lineHeight) / 2 + lineHeight / 2;
      var boundingBoxCalculator = new BoundingBoxCalculator(boxPadding, lineHeight, numberOfLines);

      var aliasText = element.append('text').
        attr('class', 'alias-label').
        attr('text-anchor', 'middle').
        attr('x', 0).
        attr('y', currentHeight).
        text(alias);

      boundingBoxCalculator.addElement(aliasText[0][0]);

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
      var leftEdge = boundingBoxCalculator.leftEdge();
      var totalHeight = (boundingBoxCalculator.totalHeight());
      var dividerY = -(totalHeight / 2 - lineHeight) + linePadding;

      element.append('line')
        .attr('class', 'divider')
        .attr('x1', leftEdge)
        .attr('y1', dividerY)
        .attr('x2', boundingBoxCalculator.rightEdge())
        .attr('y2', dividerY);

      element.
        insert('rect', '.alias-label').
        attr('class', 'query-vertex-box').
        attr('rx', '4').
        attr('width', boundingBoxCalculator.totalWidth()).
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