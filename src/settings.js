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
      'labeled-image-vertex' : new D3VertexLabelDecorator(new D3ImageVertexRenderer(),{
        labelInside: true,
        labelTop: false,
        padding: 10,
        labelPropertyKey: 'additionalLabel'
      }),
      'bordered-image-vertex' : new D3VertexBorderDecorator(new D3ImageVertexRenderer())
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

  vertex : {
    imageUrlPropertyKey : 'imageUrl',
    borderColorPropertyKey : 'borderColor',
    borderWeightPropertyKey : 'borderWeight',
    borderRadiusPropertyKey : 'borderRadius',
    borderPaddingPropertyKey : 'borderPadding',
    borderColor : '#000000',
    borderWeight : 2,
    borderRadius : 0,
    borderPadding : 5,
    vertexIconsPropertyKey : 'icons',
    iconDefaultColor: '#000000'
  },

  edge : {
    lineWeightPropertyKey : 'strength',
    defaultLineWeight : 2,
    useArrows: true,
    aggregatedByPropertyKey: 'aggregatedBy'
  }

};