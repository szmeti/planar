'use strict';

describe('Index', function () {

  it('should put, get, remove vertex', function () {
    var graph = new Graph();
    var index = graph.createIndex('basic', Vertex);
    var v1 = graph.addVertex(null);
    var v2 = graph.addVertex(null);
    expect(graph.getVertices().length).toBe(2);

    index.put('dog', 'puppy', v1);
    index.put('dog', 'mama', v2);
    expect(v1).toBe(index.get('dog', 'puppy')[0]);
    expect(v2).toBe(index.get('dog', 'mama')[0]);
    expect(index.count('dog', 'puppy')).toBe(1);

    v1.removeProperty('dog');
    expect(v1).toBe(index.get('dog', 'puppy')[0]);
    expect(v2).toBe(index.get('dog', 'mama')[0]);

    graph.removeVertex(v1);
    expect(index.get('dog', 'puppy').length).toBe(0);
    expect(v2).toBe(index.get('dog', 'mama')[0]);
    expect(graph.getVertices().length).toBe(1);

    v2.setProperty('dog', 'mama2');
    expect(v2).toBe(index.get('dog', 'mama')[0]);
    graph.removeVertex(v2);
    expect(index.get('dog', 'puppy').length).toBe(0);
    expect(index.get('dog', 'mama').length).toBe(0);
    expect(graph.getVertices().length).toBe(0);
  });

  it('should count elements', function () {
    var graph = new Graph();
    var index = graph.createIndex('basic', Vertex);
    var v;
    for (var i = 0; i < 10; i++) {
      v = graph.addVertex(null);
      index.put('dog', 'puppy', v);
    }
    expect(index.count('dog', 'puppy')).toBe(10);
    v = index.get('dog', 'puppy')[0];
    graph.removeVertex(v);
    index.remove('dog', 'puppy', v);
    expect(index.count('dog', 'puppy')).toBe(9);
  });

  it('should put, get, remove edge', function () {
    var graph = new Graph();
    var index = graph.createIndex('basic', Edge);

    var v1 = graph.addVertex(null);
    var v2 = graph.addVertex(null);
    var e1 = graph.addEdge(null, v1, v2, 'test1');
    var e2 = graph.addEdge(null, v1, v2, 'test2');

    expect(graph.getEdges().length).toBe(2);

    index.put('dog', 'puppy', e1);
    index.put('dog', 'mama', e2);
    expect(e1).toBe(index.get('dog', 'puppy')[0]);
    expect(e2).toBe(index.get('dog', 'mama')[0]);

    v1.removeProperty('dog');
    expect(e1).toBe(index.get('dog', 'puppy')[0]);
    expect(e2).toBe(index.get('dog', 'mama')[0]);

    graph.removeEdge(e1);
    expect(index.get('dog', 'puppy').length).toBe(0);
    expect(e2).toBe(index.get('dog', 'mama')[0]);
    expect(graph.getEdges().length).toBe(1);

    v2.setProperty('dog', 'mama2');
    expect(e2).toBe(index.get('dog', 'mama')[0]);
    graph.removeEdge(e2);
    expect(index.get('dog', 'puppy').length).toBe(0);
    expect(index.get('dog', 'mama').length).toBe(0);
    expect(graph.getEdges().length).toBe(0);
  });

});