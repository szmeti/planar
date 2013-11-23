'use strict';

describe('KeyIndex', function () {

  it('getIndexedKeys should not accept null type', function () {
    var graph = new Graph();

    try {
      graph.getIndexedKeys(null);
      this.fail('Should not accept null type');
    } catch (e) {
      expect(e.message).toEqual('Invalid type');
    }
  });

  it('createKeyIndex should not accept null type', function () {
    var graph = new Graph();

    try {
      graph.createKeyIndex('test', null);
      this.fail('Should not accept null type');
    } catch (e) {
      expect(e.message).toEqual('Invalid type');
    }
  });

  it('dropKeyIndex should not accept null type', function () {
    var graph = new Graph();

    try {
      graph.dropKeyIndex('test', null);
      this.fail('Should not accept null type');
    } catch (e) {
      expect(e.message).toEqual('Invalid type');
    }
  });

  it('should auto index keys', function () {
    var graph = new Graph();

    expect(graph.getIndexedKeys(Vertex).length).toBe(0);
    graph.createKeyIndex('name', Vertex);
    graph.createKeyIndex('location', Vertex);
    expect(graph.getIndexedKeys(Vertex).length).toBe(2);
    expect(graph.getIndexedKeys(Vertex)).toContain('name');
    expect(graph.getIndexedKeys(Vertex)).toContain('location');

    expect(graph.getIndexedKeys(Edge).length).toBe(0);
    graph.createKeyIndex('weight', Edge);
    graph.createKeyIndex('since', Edge);
    expect(graph.getIndexedKeys(Edge).length).toBe(2);
    expect(graph.getIndexedKeys(Edge)).toContain('weight');
    expect(graph.getIndexedKeys(Edge)).toContain('since');
  });

  it('should auto index key dropping', function () {
    var graph = new Graph();

    graph.createKeyIndex('name', Vertex);
    graph.createKeyIndex('location', Vertex);
    graph.createKeyIndex('weight', Edge);
    graph.createKeyIndex('since', Edge);

    graph.dropKeyIndex('name', Vertex);
    graph.dropKeyIndex('weight', Edge);

    expect(graph.getIndexedKeys(Vertex).length).toBe(1);
    expect(graph.getIndexedKeys(Vertex)).toContain('location');
    graph.dropKeyIndex('location', Vertex);

    expect(graph.getIndexedKeys(Edge).length).toBe(1);
    expect(graph.getIndexedKeys(Edge)).toContain('since');
    graph.dropKeyIndex('since', Edge);

    expect(graph.getIndexedKeys(Vertex).length).toBe(0);
    expect(graph.getIndexedKeys(Edge).length).toBe(0);
  });

  it('should get vertices and edges with key value', function () {
    var graph = new Graph();

    graph.createKeyIndex('name', Vertex);
    expect(graph.getIndexedKeys(Vertex).length).toBe(1);
    expect(graph.getIndexedKeys(Vertex)).toContain('name');
    var v1 = graph.addVertex(null);
    v1.setProperty('name', 'marko');
    v1.setProperty('location', 'everywhere');
    var v2 = graph.addVertex(null);
    v2.setProperty('name', 'stephen');
    v2.setProperty('location', 'everywhere');

    expect(graph.getVertices('location', 'everywhere').length).toBe(2);
    expect(graph.getVertices('name', 'marko').length).toBe(1);
    expect(graph.getVertices('name', 'stephen').length).toBe(1);
    expect(graph.getVertices('name', 'marko')[0], v1);
    expect(graph.getVertices('name', 'stephen')[0], v2);

    graph.createKeyIndex('place', Edge);
    expect(graph.getIndexedKeys(Edge).length).toBe(1);
    expect(graph.getIndexedKeys(Edge)).toContain('place');

    var e1 = graph.addEdge(null, graph.addVertex(null), graph.addVertex(null), 'knows');
    e1.setProperty('name', 'marko');
    e1.setProperty('place', 'everywhere');
    var e2 = graph.addEdge(null, graph.addVertex(null), graph.addVertex(null), 'knows');
    e2.setProperty('name', 'stephen');
    e2.setProperty('place', 'everywhere');

    expect(graph.getEdges('place', 'everywhere').length).toBe(2);
    expect(graph.getEdges('name', 'marko').length).toBe(1);
    expect(graph.getEdges('name', 'stephen').length).toBe(1);
    expect(graph.getEdges('name', 'marko')[0], e1);
    expect(graph.getEdges('name', 'stephen')[0], e2);
  });

  it('should re-index elements', function () {
    var graph = new Graph();

    var vertex = graph.addVertex(null);
    vertex.setProperty('name', 'marko');
    expect(graph.getVertices('name', 'marko').length).toBe(1);
    expect(graph.getVertices('name', 'marko')[0], vertex);
    graph.createKeyIndex('name', Vertex);
    expect(graph.getVertices('name', 'marko').length).toBe(1);
    expect(graph.getVertices('name', 'marko')[0], vertex);

    var edge = graph.addEdge(null, graph.addVertex(null), graph.addVertex(null), 'knows');
    edge.setProperty('date', 2012);
    expect(graph.getEdges('date', 2012).length).toBe(1);
    expect(graph.getEdges('date', 2012)[0], edge);
    graph.createKeyIndex('date', Edge);
    expect(graph.getEdges('date', 2012).length).toBe(1);
    expect(graph.getEdges('date', 2012)[0], edge);
  });

  it('should update key indices after element removal', function () {
    var graph = new Graph();

    graph.createKeyIndex('foo', Vertex);
    graph.createKeyIndex('foo2', Edge);

    var v1 = graph.addVertex(null);
    v1.setProperty('foo', 42);
    expect(graph.getVertices().length).toBe(1);

    var edge = graph.addEdge(null, graph.addVertex(null), graph.addVertex(null), 'knows');
    edge.setProperty('foo2', 2012);
    expect(graph.getEdges().length).toBe(1);

    graph.removeVertex(v1);
    expect(graph.getVertices().length).toBe(2);
    expect(graph.getVertices('foo', 42).length).toBe(0);

    graph.removeEdge(edge);
    expect(graph.getEdges().length).toBe(0);
    expect(graph.getEdges('foo2', 2012).length).toBe(0);
  });

  it('should update values in index keys', function () {
    var graph = new Graph();

    graph.createKeyIndex('name', Vertex);

    var v1 = graph.addVertex(null);
    v1.setProperty('name', 'marko');
    expect(v1.getProperty('name')).toEqual('marko');
    expect(graph.getVertices().length).toBe(1);

    v1 = graph.getVertices('name', 'marko')[0];
    expect(v1.getProperty('name')).toEqual('marko');
    v1.setProperty('name', 'marko a. rodriguez');
    expect(v1.getProperty('name')).toEqual('marko a. rodriguez');
    expect(graph.getVertices().length).toBe(1);

    expect(graph.getVertices('name', 'marko').length).toBe(0);
    v1 = graph.getVertices('name', 'marko a. rodriguez')[0];
    expect(v1.getProperty('name')).toEqual('marko a. rodriguez');
    expect(graph.getVertices().length).toBe(1);
  });

});