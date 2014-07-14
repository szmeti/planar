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
    a.setProperty('test', 'x');

    b = graph.addVertex(null);
    b.setProperty('name', 'peter');
    b.setProperty('age', 15);
    b.setProperty('test', 'x');

    c = graph.addVertex(null);
    c.setProperty('name', 'tim');
    c.setProperty('age', 20);

    aFriendB = graph.addEdge(null, a, b, 'ab');
    bFriendA = graph.addEdge(null, b, a, 'ba');
    bFriendA.setProperty('lineWeight', 5);
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
  });

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

  it('verifies filtering and features', function () {
    var filterManager = graph.filteredView();
    filterManager.addFilter().has('age', Compare.GREATER_THAN_EQUAL, 20).type(VERTEX_FILTER);
    var normal = filterManager.getNormalGraph();
    expect(normal.query().edges().length).toBe(3);
    expect(normal.query().vertices().length).toBe(2);

    expect(normal.query().has('name', 'marko').vertices().length).toBe(1);
    expect(normal.query().has('name', 'tim').vertices().length).toBe(1);

    expect(normal.query().has('amount', 0.5).edges().length).toBe(1);
    expect(normal.query().has('amount', 0.7).edges().length).toBe(1);
    expect(normal.query().has('amount', 0.8).edges().length).toBe(1);

    var aggregated = filterManager.getAggragatedGraph();
    expect(aggregated.query().edges().length).toBe(1);
    expect(aggregated.query().vertices().length).toBe(2);

    expect(aggregated.query().has('name', 'marko').vertices().length).toBe(1);
    expect(aggregated.query().has('name', 'tim').vertices().length).toBe(1);

    expect(aggregated.query().has(settings.edge.lineWeightPropertyKey, 6).edges().length).toBe(1);

    var filteredVertices = filterManager.getFilteredVertices();
    expect(filteredVertices.length).toBe(1);
    var filteredVertex = filteredVertices[0];

    expect(filteredVertex.getProperty('name')).toBe('peter');
    expect(filteredVertex.getProperty('age')).toBe(15);

    var filteredAggregatedVertices = filterManager.getFilteredAggregatedVertices();
    expect(filteredAggregatedVertices.length).toBe(1);
    var filteredAggregatedVertex = filteredAggregatedVertices[0];

    expect(filteredAggregatedVertex.getProperty('name')).toBe('peter');
    expect(filteredAggregatedVertex.getProperty('age')).toBe(15);

    var filteredEdges = filterManager.getFilteredEdges();
    expect(filteredEdges.length).toBe(3);

    var filteredEdge1 = filteredEdges[0];
    expect(filteredEdge1.getProperty('amount')).toBe(1.0);
    expect(filteredEdge1.getLabel()).toBe('ab');

    var filteredEdge2 = filteredEdges[1];
    expect(filteredEdge2.getProperty('amount')).toBe(0.9);
    expect(filteredEdge2.getLabel()).toBe('ba');

    var filteredEdge3 = filteredEdges[2];
    expect(filteredEdge3.getProperty('amount')).toBe(0.4);
    expect(filteredEdge3.getLabel()).toBe('cb');

    var filteredAggregatedEdges = filterManager.getFilteredAggregatedEdges();
    expect(filteredAggregatedEdges.length).toBe(1);

    var filteredAggregatedEdge = filteredAggregatedEdges[0];
    expect(filteredAggregatedEdge.getProperty(settings.edge.lineWeightPropertyKey)).toBe(7);
  });

});