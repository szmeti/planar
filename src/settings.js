/* global settings: true */

var settings = {

  container: null,

  navigatorContainer: null,

  engine: new D3Engine(),

  layout: new RandomLayout(),

  raphael: {
    defaultVertexRenderer: RaphaelRectangleVertexRenderer,

    vertexRenderers: {

    }
  },

  d3: {
    defaultVertexRenderer: new D3SymbolVertexRenderer('circle'),
    defaultEdgeRenderer: D3DirectedLineEdgeRenderer,

    vertexRenderers: {
      'circle': new D3SymbolVertexRenderer('circle'),
      'cross': new D3SymbolVertexRenderer('cross'),
      'diamond': new D3SymbolVertexRenderer('diamond'),
      'square': new D3SymbolVertexRenderer('square'),
      'triangle-down': new D3SymbolVertexRenderer('triangle-down'),
      'triangle-up': new D3SymbolVertexRenderer('triangle-up'),
      'query-vertex': D3QueryVertexRenderer,
      'image-vertex': D3ImageVertexRenderer,
      'query-result-vertex': D3QueryResultVertexRenderer
    },

    edgeRenderers: {
      'line': D3DirectedLineEdgeRenderer
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
    imageUrlPropertyKey : 'imageUrl'
  },

  edge : {
    lineWeightPropertyKey : 'lineWeight',
    defaultLineWeight : 2,
    useArrows: true
  }

};