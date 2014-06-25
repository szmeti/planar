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

    zoomEnabled : true,
    dragEnabled : true,

    edgeRenderers: {
      'line': D3DirectedLineEdgeRenderer
    }
  },

  width: 900,
  height: 680,
  navigatorPadding: 50,
  navigatorScale: 0.25

};