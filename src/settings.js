/* global settings: true */

var settings = {

  engine: new RaphaelEngine(),

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
    paddingTop: 0,
    paddingLeft: 20,
    scale: 0.25,
    wrapperBorder: 1
  },

  zoomPanControl: {
    enabled: true,
    zoomScale: 0.25,
    panScale: 50,
    paddingTop: 5,
    paddingLeft: 10
  }

};