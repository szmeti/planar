/* global settings: true */

var settings = {

  container: null,

  navigatorContainer: null,

  engine: new D3Engine(),

  layout: new CircleLayout(1000, Easing.expoInOut),

  layouts: {
    'circle': CircleLayout,
    'wheel': WheelLayout,
    'grid': GridLayout,
    'tree': NodeLinkTreeLayout
  },

  raphael: {
    defaultVertexRenderer: RaphaelRectangleVertexRenderer,

    vertexRenderers: {

    }
  },

  d3: {
    defaultVertexRenderer: new D3SymbolVertexRenderer('circle'),
    defaultEdgeRenderer: new D3EdgeLabelDecorator(D3DirectedLineEdgeRenderer),

    vertexRenderers: {
      'circle': new D3SymbolVertexRenderer('circle'),
      'cross': new D3SymbolVertexRenderer('cross'),
      'diamond': new D3SymbolVertexRenderer('diamond'),
      'square': new D3SymbolVertexRenderer('square'),
      'triangle-down': new D3SymbolVertexRenderer('triangle-down'),
      'triangle-up': new D3SymbolVertexRenderer('triangle-up'),
      'query-vertex': D3QueryVertexRenderer,
      'image-vertex': D3ImageVertexRenderer,
      'query-result-vertex': D3QueryResultVertexRenderer,
      'labeled-query-vertex' : new D3VertexLabelDecorator(D3QueryVertexRenderer, {
        labelInside: true,
        labelTop: true,
        padding: 10,
        labelPropertyKey: 'additionalLabel'
      }),
      'labeled-image-vertex' : new D3VertexLabelDecorator(D3ImageVertexRenderer,{
        labelInside: true,
        labelTop: false,
        padding: 10,
        labelPropertyKey: 'additionalLabel'
      }),
      'bordered-query-vertex' : new D3VertexBorderDecorator(D3QueryVertexRenderer),
      'bordered-image-vertex' : new D3VertexBorderDecorator(D3ImageVertexRenderer)
    },

    edgeRenderers: {
      'curved-line': D3DirectedLineEdgeRenderer,
      'labeled-curved-line': new D3EdgeLabelDecorator(D3DirectedLineEdgeRenderer)
    }
  },

  width: 900,
  height: 680,

  zoom: {
    enabled: true,
    minScale: 1,
    maxScale: 8
  },

  drag: {
    enabled: true
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
    borderPadding : 5
  },

  edge : {
    lineWeightPropertyKey : 'strength',
    defaultLineWeight : 2,
    useArrows: true
  }

};