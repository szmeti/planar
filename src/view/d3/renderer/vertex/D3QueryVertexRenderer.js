/* global D3QueryVertexRenderer: true */
var D3QueryVertexRenderer = (function () {

  return {

    init: function (uiVertex, element) {
      var vertex = uiVertex.vertex;
      var filters = vertex.getProperty('filters') || [];
      var alias = vertex.getProperty('alias');

      var lineHeight = 25;
      var boxPadding = 10;
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

        var propertyKey = D3QueryVertexRenderer.formatText(filter,alias, filter.propertyKey);
        var value = D3QueryVertexRenderer.formatText(filter,alias, filter.value);
        var text = D3QueryVertexRenderer.translateTextWithPredicate(filter.predicate, propertyKey, value);

        var filterText = element.
          append('text').
          attr('text-anchor', 'middle').
          attr('x', 0).
          attr('y', currentHeight).
          text(text);

        width = filterText[0][0].getBBox().width > width ? filterText[0][0].getBBox().width : width;
      }

      var linePadding = 5;

      element.append('line')
        .attr('x1', -(width + boxPadding * 2) / 2)
        .attr('y1', -((totalHeight + boxPadding * 2) / 2 - lineHeight) + linePadding)
        .attr('x2', (width + boxPadding * 2) / 2)
        .attr('y2', -((totalHeight + boxPadding * 2) / 2 - lineHeight) + linePadding)
        .attr('style', 'stroke: #d5d5d5;');

      element.
        insert('rect', '.alias-label').
        attr('class', 'query-vertex-box').
        attr('rx', '4').
        attr('width', width + boxPadding * 2).
        attr('height', totalHeight + boxPadding * 2).
        attr('x', -width / 2 - boxPadding).
        attr('y', -totalHeight / 2 - boxPadding);
    },

    initDefs: function (defs) {
      var whiteGradient = defs.append('linearGradient').attr('id', 'White');

      whiteGradient.append('stop')
          .attr('id','stop3225')
          .attr('offset','0')
          .attr('style','stop-color:#edebf4;stop-opacity:1');

      whiteGradient.append('stop')
          .attr('id','stop3227')
          .attr('offset','1')
          .attr('style','stop-color:#f9f9f9;stop-opacity:1');

      defs.append('linearGradient')
        .attr('inkscape:collect', 'always')
        .attr('xlink:href', '#White')
        .attr('id', 'queryVertexDefaultFillScheme')
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('gradientTransform', 'translate(-348,22)')
        .attr('x1', '445.06186')
        .attr('y1', '109')
        .attr('x2', '463')
        .attr('y2', '45');
    },

    formatText: function(filter, alias, text) {
      if(filter.hasOwnProperty('referencedAlias')) {
        return alias + '.' + text;
      } else {
        return text;
      }
    },

    translateTextWithPredicate: function(predicate, propertyKey, value) {
      switch(predicate) {
      case 'LESS_THAN' :
        return propertyKey + ' < ' + value;
      case 'LESS_THAN_EQUAL' :
        return propertyKey + ' <= ' + value;
      case 'GREATER_THAN' :
        return propertyKey + ' > ' + value;
      case 'GREATER_THAN_EQUAL' :
        return propertyKey + ' >= ' + value;
      case 'CONTAINS' :
        return 'CONTAINS('+ propertyKey + ',' + value + ')';
      case 'CONTAINS_PREFIX' :
        return 'CONTAINS_PREFIX('+ propertyKey + ',' + value + ')';
      case 'CONTAINS_REGEX' :
        return 'CONTAINS_REGEX('+ propertyKey + ',' + value + ')';
      case 'PREFIX' :
        return 'PREFIX('+ propertyKey + ',' + value + ')';
      case 'REGEX' :
        return 'REGEX('+ propertyKey + ',' + value + ')';
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