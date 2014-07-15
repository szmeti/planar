'use strict';

describe('FilterManager', function () {

  var a, b, c;
  var aFriendB, bFriendA, aFriendC, aHateC, cHateA, cHateB;
  var graph;

  beforeEach(function () {
    graph = new Graph();
    a = graph.addVertex(null);
    a.setProperty('name', 'marko');
    a.setProperty('age', 33);
    a.setProperty('gender', 'male');
    a.setProperty('test', 'x');

    b = graph.addVertex(null);
    b.setProperty('name', 'kim');
    b.setProperty('age', 15);
    b.setProperty('gender', 'female');
    b.setProperty('test', 'x');

    c = graph.addVertex(null);
    c.setProperty('name', 'tim');
    c.setProperty('gender', 'male');
    c.setProperty('age', 20);

    aFriendB = graph.addEdge(null, a, b, 'ab');
    bFriendA = graph.addEdge(null, b, a, 'ba');
    bFriendA.setProperty(settings.edge.lineWeightPropertyKey, 5);
    aFriendC = graph.addEdge(null, a, c, 'ac');
    aHateC = graph.addEdge(null, a, c, 'ac2');
    cHateA = graph.addEdge(null, c, a, 'ca');
    cHateB = graph.addEdge(null, c, b, 'cb');
    aFriendB.setProperty('amount', 1.0);
    aFriendB.setProperty('test', 'x');

    bFriendA.setProperty('amount', 0.9);
    bFriendA.setProperty('test', 'y');

    aFriendC.setProperty('amount', 0.5);
    aFriendC.setProperty('test', 'w');

    aHateC.setProperty('amount', 0.7);
    aHateC.setProperty('test', 'z');

    cHateA.setProperty('amount', 0.8);
    cHateB.setProperty('amount', 0.4);
  });

  it('verifies execution cache', function () {
    var filterManager = graph.filteredView();
    filterManager.addFilter().has('age', Compare.GREATER_THAN_EQUAL, 20).type(VERTEX_FILTER);
    expect(filterManager.executed).toBe(false);
    filterManager.getNormalGraph();
    expect(filterManager.executed).toBe(true);
    filterManager.reset();
    expect(filterManager.executed).toBe(false);
    expect(emptyGraph(filterManager.normalGraph)).toBe(true);
    expect(emptyGraph(filterManager.aggregatedGraph)).toBe(true);
    expect(filterManager.filteredVertices.length).toBe(0);
    expect(filterManager.filteredEdges.length).toBe(0);
    expect(filterManager.filteredAggregatedVertices.length).toBe(0);
    expect(filterManager.filteredAggregatedEdges.length).toBe(0);

    for (var i = 0; i < filterManager.filters.length; i++) {
      expect(filterManager.filters[i].count()).toBe(0);
    }
  });

  function emptyGraph(graph) {
    return graph.query().vertices().length === 0 && graph.query().edges().length === 0;
  }

  it('filters only applied to the specified type', function () {
    var filterManager = graph.filteredView();
    filterManager.addFilter().has('test', 'x').type(VERTEX_FILTER);

    var normal = filterManager.getNormalGraph();
    expect(normal.query().vertices().length).toBe(2);
    expect(normal.query().edges().length).toBe(2);

    filterManager = graph.filteredView();
    filterManager.addFilter().has('amount', 0.8).type(EDGE_FILTER);
    normal = filterManager.getNormalGraph();
    expect(normal.query().vertices().length).toBe(3);
    expect(normal.query().edges().length).toBe(1);

    filterManager = graph.filteredView();
    filterManager.addFilter().has('test', 'x').type(BOTH_FILTER);

    normal = filterManager.getNormalGraph();
    expect(normal.query().vertices().length).toBe(2);
    expect(normal.query().edges().length).toBe(1);

    filterManager = graph.filteredView();
    filterManager.addFilter().has('test', 'x').type(VERTEX_FILTER);
    filterManager.addFilter().has('test', 'x').type(EDGE_FILTER);

    normal = filterManager.getNormalGraph();
    expect(normal.query().vertices().length).toBe(2);
    expect(normal.query().edges().length).toBe(1);
  });

  it('verifies active filters and counts', function () {
    var filterManager = graph.filteredView();
    var filter1 = filterManager.addFilter().has('age', Compare.GREATER_THAN_EQUAL, 20).type(VERTEX_FILTER);
    var filter2 = filterManager.addFilter().has('name', 'marko').type(VERTEX_FILTER);

    var normal = filterManager.getNormalGraph();
    expect(normal.query().vertices().length).toBe(1);

    expect(filter1.count()).toBe(2);
    expect(filter2.count()).toBe(1);

    filterManager = graph.filteredView();
    filter1 = filterManager.addFilter().has('age', Compare.GREATER_THAN_EQUAL, 20).type(VERTEX_FILTER);
    filter2 = filterManager.addFilter().has('name', 'marko').type(VERTEX_FILTER).active(false);

    normal = filterManager.getNormalGraph();
    expect(normal.query().vertices().length).toBe(2);

    expect(filter1.count()).toBe(2);
    expect(filter2.count()).toBe(1);
  });

  it('verifies vertex and edge operators', function () {
    var filterManager = graph.filteredView();
    filterManager.addFilter().has('age', Compare.GREATER_THAN_EQUAL, 20).type(VERTEX_FILTER);
    filterManager.addFilter().has('name', 'marko').type(VERTEX_FILTER);

    var normal = filterManager.getNormalGraph();
    expect(normal.query().vertices().length).toBe(1);

    filterManager = graph.filteredView();
    filterManager.vertexFilterOperator(OR);
    filterManager.addFilter().has('age', Compare.GREATER_THAN_EQUAL, 20).type(VERTEX_FILTER);
    filterManager.addFilter().has('name', 'marko').type(VERTEX_FILTER);

    normal = filterManager.getNormalGraph();
    expect(normal.query().vertices().length).toBe(2);

    filterManager = graph.filteredView();
    filterManager.addFilter().has('test', 'x').type(EDGE_FILTER);
    filterManager.addFilter().has('test', 'y').type(EDGE_FILTER);

    normal = filterManager.getNormalGraph();
    expect(normal.query().edges().length).toBe(0);

    filterManager = graph.filteredView();
    filterManager.edgeFilterOperator(OR);
    filterManager.addFilter().has('test', 'x').type(EDGE_FILTER);
    filterManager.addFilter().has('test', 'y').type(EDGE_FILTER);

    normal = filterManager.getNormalGraph();
    expect(normal.query().edges().length).toBe(2);
  });

  it('verifies filtering and the normal graph result', function () {
    var filterManager = graph.filteredView();
    filterManager.addFilter().has('age', Compare.GREATER_THAN_EQUAL, 20).has('gender', 'male').type(VERTEX_FILTER);

    var normal = filterManager.getNormalGraph();
    expect(normal.query().edges().length).toBe(3);
    expect(normal.query().vertices().length).toBe(2);

    var marko = normal.query().has('name', 'marko').vertices();
    expect(marko.length).toBe(1);
    haveSameProperties(marko[0], a);

    var tim = normal.query().has('name', 'tim').vertices();
    expect(tim.length).toBe(1);
    haveSameProperties(tim[0], c);

    var e1 = normal.query().has('amount', 0.5).edges();
    expect(e1.length).toBe(1);
    haveSameProperties(e1[0], aFriendC);

    var e2 = normal.query().has('amount', 0.7).edges();
    expect(e2.length).toBe(1);
    haveSameProperties(e2[0], aHateC);

    var e3 = normal.query().has('amount', 0.8).edges();
    expect(e3.length).toBe(1);
    haveSameProperties(e3[0], cHateA);
  });

  it('verifies filtering and the aggregated graph result', function () {
    var filterManager = graph.filteredView();
    filterManager.addFilter().interval('age', 19, 34).type(VERTEX_FILTER);

    var aggregated = filterManager.getAggragatedGraph();
    expect(aggregated.query().edges().length).toBe(1);
    expect(aggregated.query().vertices().length).toBe(2);

    var marko = aggregated.query().has('name', 'marko').vertices();
    expect(marko.length).toBe(1);
    haveSameProperties(marko[0], a);

    var tim = aggregated.query().has('name', 'tim').vertices();
    expect(tim.length).toBe(1);
    haveSameProperties(tim[0], c);

    expect(aggregated.query().has(settings.edge.lineWeightPropertyKey, 6).edges().length).toBe(1);
  });

  it('verifies filtering with filtered vertices result', function () {
    var filterManager = graph.filteredView();
    filterManager.addFilter().hasNot('gender', 'male').type(VERTEX_FILTER);

    var filteredVertices = filterManager.getFilteredVertices();
    expect(filteredVertices.length).toBe(2);
    var filteredVertex1 = filteredVertices[0];
    var filteredVertex2 = filteredVertices[1];
    haveSameProperties(filteredVertex1, a);
    haveSameProperties(filteredVertex2, c);
  });

  it('verifies filtering with filtered aggregated vertices result', function () {
    var filterManager = graph.filteredView();
    filterManager.addFilter().hasNot('gender', 'male').type(VERTEX_FILTER);

    var filteredVertices = filterManager.getFilteredAggregatedVertices();
    expect(filteredVertices.length).toBe(2);
    var filteredVertex1 = filteredVertices[0];
    var filteredVertex2 = filteredVertices[1];
    haveSameProperties(filteredVertex1, a);
    haveSameProperties(filteredVertex2, c);
  });

  it('verifies filtering with filtered edges result', function () {
    var filterManager = graph.filteredView();
    filterManager.addFilter().has('age', Compare.GREATER_THAN_EQUAL, 20).type(VERTEX_FILTER);

    var filteredEdges = filterManager.getFilteredEdges();
    expect(filteredEdges.length).toBe(3);

    var filteredEdge1 = filteredEdges[0];
    haveSameProperties(filteredEdge1, aFriendB);
    expect(filteredEdge1.getLabel()).toBe('ab');

    var filteredEdge2 = filteredEdges[1];
    haveSameProperties(filteredEdge2, bFriendA);
    expect(filteredEdge2.getLabel()).toBe('ba');

    var filteredEdge3 = filteredEdges[2];
    haveSameProperties(filteredEdge3, cHateB);
    expect(filteredEdge3.getLabel()).toBe('cb');
  });

  it('verifies filtering with filtered aggregated edges result', function () {
    var cb2 = graph.addEdge(null, c, b, 'cb2');
    cb2.setProperty(settings.edge.lineWeightPropertyKey, 7);

    var filterManager = graph.filteredView();
    filterManager.addFilter().has('age', Compare.GREATER_THAN_EQUAL, 20).type(VERTEX_FILTER);

    var filteredAggregatedEdges = filterManager.getFilteredAggregatedEdges();
    expect(filteredAggregatedEdges.length).toBe(2);

    var filteredAggregatedEdge = filteredAggregatedEdges[0];
    expect(filteredAggregatedEdge.getProperty(settings.edge.lineWeightPropertyKey)).toBe(7);

    var filteredAggregatedEdge2 = filteredAggregatedEdges[1];
    expect(filteredAggregatedEdge2.getProperty(settings.edge.lineWeightPropertyKey)).toBe(9);
  });

  function haveSameProperties(v1, v2) {
    var propertyKeys = v1.getPropertyKeys();
    expect(propertyKeys.length).toBe(v2.getPropertyKeys().length);
    for (var i = 0; i < propertyKeys.length; i++) {
      expect(v1.getProperty(propertyKeys[i])).toBe(v2.getProperty(propertyKeys[i]));
    }
  }

});