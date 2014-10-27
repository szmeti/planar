/* global settings: true */
var settings = {

  container: null,

  navigatorContainer: null,

  engine: new D3Engine(),

  defaultLayout: 'circle',

  layouts: {
    'random': RandomLayout,
    'circle': CircleLayout,
    'wheel': WheelLayout,
    'grid': GridLayout,
    'tree': NodeLinkTreeLayout,
    'fruchtermanReingold': FruchtermanReingoldLayout
  },

  animationDuration: 1000,

  easing: Easing.expoInOut,

  raphael: {
    defaultVertexRenderer: RaphaelRectangleVertexRenderer,

    vertexRenderers: {

    }
  },

  d3: {
    defaultVertexRenderer: new D3SymbolVertexRenderer('circle'),
    defaultEdgeRenderer: new D3LineEdgeRenderer(),

    vertexRenderers: {
      'circle': new D3SymbolVertexRenderer('circle'),
      'cross': new D3SymbolVertexRenderer('cross'),
      'diamond': new D3SymbolVertexRenderer('diamond'),
      'square': new D3SymbolVertexRenderer('square'),
      'triangle-down': new D3SymbolVertexRenderer('triangle-down'),
      'triangle-up': new D3SymbolVertexRenderer('triangle-up'),
      'image-vertex': new D3ImageVertexRenderer(),
      'query-result-vertex': new D3QueryResultVertexRenderer(),
      'labeled-image-vertex': new D3VertexLabelDecorator(new D3ImageVertexRenderer(), {
        labelInside: true,
        labelTop: false,
        padding: 10,
        labelPropertyKey: 'additionalLabel'
      }),
      'bordered-image-vertex': new D3VertexBorderDecorator(new D3ImageVertexRenderer())
    },

    edgeRenderers: {
      'curved-line': new D3DirectedLineEdgeRenderer(),
      'labeled-curved-line': new D3EdgeLabelDecorator(new D3DirectedLineEdgeRenderer())
    }
  },

  height: 680,

  zoom: {
    enabled: true,
    minScale: 1,
    maxScale: 8,
    defaultScale: 0.5
  },

  drag: {
    enabled: true,
    delay: 100
  },

  navigator: {
    enabled: true,
    scale: 0.25
  },

  zoomPanControl: {
    enabled: true,
    zoomStep: 0.25,
    panStep: 50,
    paddingTop: 5,
    paddingLeft: 10
  },

  vertex: {
    imageUrlPropertyKey: 'imageUrl',
    borderColorPropertyKey: 'borderColor',
    borderWeightPropertyKey: 'borderWeight',
    borderRadiusPropertyKey: 'borderRadius',
    borderPaddingPropertyKey: 'borderPadding',
    borderColor: '#000000',
    borderWeight: 2,
    borderRadius: 0,
    borderPadding: 5,
    icons: {
      propertyKey: 'icons',
      insideVertex: true,
      borderRadius: 0,
      horizontalMargin: 3,
      iconSetMargin: 2,
      iconPadding: 2,
      positioning: TOP_RIGHT
    }
  },

  edge: {
    lineWeightPropertyKey: 'strength',
    defaultLineWeight: 2,
    useArrows: true,
    aggregatedByPropertyKey: 'aggregatedBy'
  },

  icons: {
    activeIcons: [],
    iconSet: {
      'spam': 'M16 11.5l-4.5-11.5h-7l-4.5 4.5v7l4.5 4.5h7l4.5-4.5v-7l-4.5-4.5zM9 13h-2v-2h2v2zM9 9h-2v-6h2v6z',
      'airplane': 'M12 9.999l-2.857-2.857 6.857-5.143-2-2-8.571 3.429-2.698-2.699c-0.778-0.778-1.864-0.964-2.414' +
        '-0.414s-0.364 1.636 0.414 2.414l2.698 2.698-3.429 8.572 2 2 5.144-6.857 2.857 2.857v4h2l1-3 3-1v-2l-4 0z',
      'share': 'M13.5 11c-0.706 0-1.342 0.293-1.797 0.763l-6.734-3.367c0.021-0.129 0.032-0.261 ' +
        '0.032-0.396s-0.011-0.267-0.032-0.396l6.734-3.367c0.455 0.47 1.091 0.763 1.797 0.763 1.381 0 ' +
        '2.5-1.119 2.5-2.5s-1.119-2.5-2.5-2.5-2.5 1.119-2.5 2.5c0 0.135 0.011 0.267 0.031 0.396l-6.734 ' +
        '3.367c-0.455-0.47-1.091-0.763-1.797-0.763-1.381 0-2.5 1.119-2.5 2.5s1.119 2.5 2.5 2.5c0.706 0 ' +
        '1.343-0.293 1.797-0.763l6.734 3.367c-0.021 0.129-0.031 0.261-0.031 0.396 0 1.381 1.119 2.5 2.5 ' +
        '2.5s2.5-1.119 2.5-2.5c0-1.381-1.119-2.5-2.5-2.5z'
    }
  }

};