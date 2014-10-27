/* global D3VertexIconDecorator: true */
var D3VertexIconDecorator = (function () {

  var ICON_SIZE = 16;

  function D3VertexIconDecorator(rendererToBeDecorated) {
    this.decorateRenderer(rendererToBeDecorated);
  }

  function createOverlay(iconGroup, iconId, borderRadius, iconPadding) {
    var size = ICON_SIZE + 2 * iconPadding;
    return iconGroup.append('rect').
      attr('class', 'vertex-icon-overlay vertex-icon-overlay-' + iconId).
      attr('rx', borderRadius).
      attr('ry', borderRadius).
      attr('width', size).
      attr('height', size);
  }

  function createIcon(iconGroup, icon, iconId, iconPadding) {
    return iconGroup.append('use').
      attr('class', 'vertex-icon vertex-icon-' + iconId).
      attr('transform', 'translate(' + iconPadding + ', ' + iconPadding + ')').
      attr('xlink:href', '#' + icon.id);
  }

  utils.mixin(D3VertexIconDecorator.prototype, ElementRendererDecorator);

  utils.mixin(D3VertexIconDecorator.prototype, {
    doInit: function (uiElement, container) {
      var vertex = uiElement.vertex;
      var graph = vertex.getGraph();
      var instanceSettings = graph.getSettings();
      var icons = vertex.getProperty(instanceSettings.vertex.icons.propertyKey);
      var horizontalMargin = instanceSettings.vertex.icons.horizontalMargin;
      var iconSetMargin = instanceSettings.vertex.icons.iconSetMargin;
      var iconPadding = instanceSettings.vertex.icons.iconPadding;
      var positioning = instanceSettings.vertex.icons.positioning;
      var top = positioning === TOP_LEFT || positioning === TOP_RIGHT;
      var leftToRight = positioning === TOP_LEFT || positioning === BOTTOM_LEFT;

      var createClickHandler = function (iconId) {
        return function () {
          graph.trigger('vertexIconClicked', vertex, iconId);
        };
      };

      if (utils.isArray(icons)) {
        var containerBox = container.node().getBBox();
        var halfContainerWidth = containerBox.width / 2;
        var halfContainerHeight = containerBox.height / 2;
        var fullIconWidth = (ICON_SIZE + 2 * iconPadding + horizontalMargin);
        var fullIconHeight = ICON_SIZE + 2 * iconPadding;
        var startX = leftToRight ? -halfContainerWidth : halfContainerWidth - icons.length * fullIconWidth;

        for (var i = 0; i < icons.length; i++) {
          var icon = icons[i];
          var insideVertex = icon.insideVertex || instanceSettings.vertex.icons.insideVertex;
          var borderRadius = icon.borderRadius || instanceSettings.vertex.icons.borderRadius;

          var iconGroup = container.append('g').attr('class', 'vertex-icon-group');

          createOverlay(iconGroup, icon.id, borderRadius, iconPadding);
          createIcon(iconGroup, icon, icon.id, iconPadding);

          var translateX = startX + i * fullIconWidth;
          var translateY = top ? -halfContainerHeight - fullIconHeight - iconSetMargin : halfContainerHeight + iconSetMargin;
          var multiplier = top ? 1 : -1;
          translateY += insideVertex ? multiplier * fullIconHeight : 0;
          iconGroup.attr('transform', 'translate(' + translateX + ', ' + translateY + ')');

          iconGroup.on('click', createClickHandler(icon.id));
        }
      }
    },

    doInitDefs: function (defs, settings) {
      for (var i = 0; i < settings.icons.activeIcons.length; i++) {
        var icon = settings.icons.activeIcons[i];
        var definition = settings.icons.iconSet[icon];

        if (definition) {
          defs.append('path').attr('id', icon).attr('d', definition);
        } else {
          throw {message: 'Could not find the specified icon in the icon set: ' + icon};
        }
      }
    }
  });

  return D3VertexIconDecorator;

}());