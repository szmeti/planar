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
    'fruchtermanReingold': FruchtermanReingoldLayout,
    'fixed': FixedLayout,
    'positionCorrector': PositionCorrectorLayout
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
        '2.5s2.5-1.119 2.5-2.5c0-1.381-1.119-2.5-2.5-2.5z',
      'close': 'M15.854 12.854c-0-0-0-0-0-0l-4.854-4.854 4.854-4.854c0-0 0-0 0-0 0.052-0.052 0.090-0.113 0.114-0.178 ' +
        '0.066-0.178 0.028-0.386-0.114-0.529l-2.293-2.293c-0.143-0.143-0.351-0.181-0.529-0.114-0.065 0.024-0.126 ' +
        '0.062-0.178 0.114 0 0-0 0-0 0l-4.854 4.854-4.854-4.854c-0-0-0-0-0-0-0.052-0.052-0.113-0.090-0.178-0.114-' +
        '0.178-0.066-0.386-0.029-0.529 0.114l-2.293 2.293c-0.143 0.143-0.181 0.351-0.114 0.529 0.024 0.065 0.062 ' +
        '0.126 0.114 0.178 0 0 0 0 0 0l4.854 4.854-4.854 4.854c-0 0-0 0-0 0-0.052 0.052-0.090 0.113-0.114 0.178-0.066 ' +
        '0.178-0.029 0.386 0.114 0.529l2.293 2.293c0.143 0.143 0.351 0.181 0.529 0.114 0.065-0.024 0.126-0.062 ' +
        '0.178-0.114 0-0 0-0 0-0l4.854-4.854 4.854 4.854c0 0 0 0 0 0 0.052 0.052 0.113 0.090 0.178 0.114 0.178 ' +
        '0.066 0.386 0.029 0.529-0.114l2.293-2.293c0.143-0.143 0.181-0.351 0.114-0.529-0.024-0.065-0.062-0.126-' +
        '0.114-0.178z',
      'cross': 'M11.479 10.522l-2.206-2.522 2.206-2.522c0.375-0.375 0.375-0.983 0-1.358s-0.983-0.374-1.358 0l-2.122 ' +
        '2.425-2.121-2.424c-0.375-0.375-0.983-0.375-1.358 0s-0.374 0.983 0 1.358l2.206 2.521-2.206 2.522c-0.374 ' +
        '0.375-0.374 0.982 0 1.356s0.983 0.375 1.358 0l2.122-2.423 2.121 2.423c0.375 0.375 0.983 0.375 1.358 ' +
        '0s0.375-0.981 0.001-1.356z',
      'remove': 'M3 16h10l1-11h-12zM10 2v-2h-4v2h-5v3l1-1h12l1 1v-3h-5zM9 2h-2v-1h2v1z',
      'remove2': 'M12.5 2h-9c-0.828 0-1.5 0.672-1.5 1.5v0.5h12v-0.5c0-0.828-0.672-1.5-1.5-1.5zM9.88 1l0.221 ' +
        '1.578h-4.201l0.221-1.578h3.76zM10 0h-4c-0.412 0-0.797 0.334-0.854 0.743l-0.292 2.093c-0.057 0.409 0.234 ' +
        '0.743 0.646 0.743h5c0.412 0 0.703-0.334 0.646-0.743l-0.292-2.093c-0.057-0.409-0.441-0.743-0.854-0.743v0zM12.75 ' +
        '5h-9.5c-0.55 0-0.959 0.448-0.909 0.996l0.819 9.008c0.050 0.548 0.541 0.996 1.091 0.996h7.5c0.55 0 1.041-0.448 ' +
        '1.091-0.996l0.819-9.008c0.050-0.548-0.359-0.996-0.909-0.996zM6 14h-1.5l-0.5-7h2v7zM9 14h-2v-7h2v7zM11.5 ' +
        '14h-1.5v-7h2l-0.5 7z',
      'menu2': 'M1 3h14v3h-14zM1 7h14v3h-14zM1 11h14v3h-14z'
    }
  }

};