/* global D3VertexIconDecorator: true */
var D3VertexIconDecorator = (function () {

  var ICON_SIZE = 16;
  var PADDING = 2;

  function D3VertexIconDecorator(rendererToBeDecorated) {
    this.decorateRenderer(rendererToBeDecorated);
  }

  utils.mixin(D3VertexIconDecorator.prototype, ElementRendererDecorator);

  utils.mixin(D3VertexIconDecorator.prototype, {
    doInit: function (uiElement, container) {
      var vertex = uiElement.vertex;
      var instanceSettings = vertex.getGraph().getSettings();
      var icons = vertex.getProperty(instanceSettings.vertex.vertexIconsPropertyKey);

      if (utils.isArray(icons)) {
        var containerBox = container.node().getBBox();

        var startX = -containerBox.width / 2;
        for (var i = 0; i < icons.length; i++) {
          var icon = icons[i];
          var fillColor = icon.color || instanceSettings.vertex.iconDefaultColor;

          container.append('use').
            attr('xlink:href', '#' + icon.id).
            attr('x', startX + i * (ICON_SIZE + PADDING)).
            attr('y', containerBox.height / 2 - ICON_SIZE).
            attr('fill', fillColor);
        }
      }
    },

    doInitDefs: function (defs) {
      var spamIcon = defs.append('g').
        attr('id', 'icon-spam');

      spamIcon.append('path').attr('d', 'M16 11.5l-4.5-11.5h-7l-4.5 4.5v7l4.5 ' +
        '4.5h7l4.5-4.5v-7l-4.5-4.5zM9 13h-2v-2h2v2zM9 9h-2v-6h2v6z');

      var airplaneIcon = defs.append('g').
        attr('id', 'icon-airplane');

      airplaneIcon.append('path').attr('d', 'M12 9.999l-2.857-2.857 6.857-5.143-2-2-8.571 ' +
        '3.429-2.698-2.699c-0.778-0.778-1.864-0.964-2.414-0.414s-0.364 1.636 0.414 ' +
        '2.414l2.698 2.698-3.429 8.572 2 2 5.144-6.857 2.857 2.857v4h2l1-3 3-1v-2l-4 0z');
    }
  });

  return D3VertexIconDecorator;

}());