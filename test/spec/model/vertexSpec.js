'use strict';

describe('Vertex', function () {

  it('should return equal objects', function () {
    var graph = new Graph();

    var v = graph.addVertex(1);
    var u = graph.addVertex(1);

    expect(v).toBe(u);

    v = graph.addVertex(2);
    expect(v).toBeDefined();
    u = graph.getVertex(v.getId());
    expect(u).toBeDefined();
    expect(v).toBe(u);

    expect(graph.getVertex(u.getId())).toBe(graph.getVertex(u.getId()));
    expect(graph.getVertex(u.getId())).toBe(graph.getVertex(v.getId()));
    expect(graph.getVertex(v.getId())).toBe(graph.getVertex(v.getId()));
  });

  it('should add vertex', function () {
    var graph = new Graph();

    graph.addVertex(1);
    graph.addVertex(2);

    expect(graph.getVertices().length).toBe(2);

    graph.addVertex(3);

    expect(graph.getVertices().length).toBe(3);
  });

  it('should not return null vertex', function () {
    var graph = new Graph();

    try {
      graph.getVertex(null);
      fail('Should not allow null IDs');
    } catch (e) {
      expect(e.message).toEqual('ID must be specified');
    }
  });

  it('should remove vertex', function () {
    var graph = new Graph();

    var v1 = graph.addVertex(1);

    expect(graph.getVertex(1)).toBe(v1);
    expect(graph.getVertices().length).toBe(1);
    expect(graph.getEdges().length).toBe(0);

    graph.removeVertex(v1);

    expect(graph.getVertices().length).toBe(0);
    expect(graph.getEdges().length).toBe(0);

    var vertices = [];
    for (var i = 0; i < 100; i++) {
      vertices.push(graph.addVertex(i));
    }
    expect(graph.getVertices().length).toBe(100);
    expect(graph.getEdges().length).toBe(0);

    for (i = 0; i < vertices.length; i++) {
      graph.removeVertex(vertices[i]);
    }
    expect(graph.getVertices().length).toBe(0);
    expect(graph.getEdges().length).toBe(0);
  });

  it('should remove vertex with edges', function () {
    var graph = new Graph();

    var v1 = graph.addVertex(1);
    var v2 = graph.addVertex(2);
    graph.addEdge(1, v1, v2, 'knows');

    expect(graph.getVertices().length).toBe(2);
    expect(graph.getEdges().length).toBe(1);

    graph.removeVertex(v1);

    expect(graph.getVertices().length).toBe(1);
    expect(graph.getEdges().length).toBe(0);

    graph.removeVertex(v2);

    expect(graph.getVertices().length).toBe(0);
    expect(graph.getEdges().length).toBe(0);
  });

  it('should not find non-existent vertices', function () {
    var graph = new Graph();

    expect(graph.getVertex('asb')).toBeNull();
    expect(graph.getVertex(12)).toBeNull();
  });

  it('should remove vertex with null ID', function () {
    var graph = new Graph();

    var v1 = graph.addVertex(null);

    expect(graph.getVertex(v1.getId())).toBe(v1);
    expect(graph.getVertices().length).toBe(1);
    expect(graph.getEdges().length).toBe(0);

    graph.removeVertex(v1);

    expect(graph.getVertices().length).toBe(0);
    expect(graph.getEdges().length).toBe(0);

    var vertices = [];
    for (var i = 0; i < 100; i++) {
      vertices.push(graph.addVertex(null));
    }
    expect(graph.getVertices().length).toBe(100);
    expect(graph.getEdges().length).toBe(0);

    for (i = 0; i < vertices.length; i++) {
      graph.removeVertex(vertices[i]);
    }
    expect(graph.getVertices().length).toBe(0);
    expect(graph.getEdges().length).toBe(0);
  });

  it('should generate unique IDs', function () {
    var graph = new Graph();

    var vertices = {};
    for (var i = 0; i < 1000; i++) {
      var vertex = graph.addVertex(null);
      vertices[vertex.getId()] = vertex;
    }
    expect(graph.getVertices().length).toBe(1000);
    expect(utils.values(vertices).length).toBe(1000);
  });

  it('should return edges', function () {
    var graph = new Graph();

    var v1 = graph.addVertex(null);

    for (var i = 0; i < 10; i++) {
      graph.addEdge(null, v1, graph.addVertex(null), 'knows');
    }
    var edges = v1.getEdges(OUT, 'knows');
    expect(edges.length).toBe(10);
  });

  it('should add vertex properties', function () {
    var graph = new Graph();

    var v1 = graph.addVertex(1);
    var v2 = graph.addVertex(2);

    v1.setProperty('key1', 'value1');
    expect(v1.getProperty('key1')).toEqual('value1');

    v1.setProperty('key2', 10);
    v2.setProperty('key2', 20);
    expect(v1.getProperty('key2')).toEqual(10);
    expect(v2.getProperty('key2')).toEqual(20);
  });

  it('should add many vertex properties', function () {
    var graph = new Graph();

    var vertices = [];
    var vertex;
    for (var i = 0; i < 50; i++) {
      vertex = graph.addVertex(null);
      for (var j = 0; j < 15; j++) {
        vertex.setProperty(Math.random().toString(36), Math.random().toString(36));
      }
      vertices.push(vertex);
    }

    expect(graph.getVertices().length).toBe(50);

    for (i = 0; i < vertices.length; i++) {
      vertex = vertices[i];
      expect(vertex.getPropertyKeys().length).toBe(15);
    }
  });

  it('should remove vertex properties', function () {
    var graph = new Graph();

    var v1 = graph.addVertex(1);
    var v2 = graph.addVertex(2);

    expect(v1.removeProperty('key1')).toBeNull();
    expect(v1.removeProperty('key2')).toBeNull();
    expect(v2.removeProperty('key2')).toBeNull();

    v1.setProperty('key1', 'value1');
    expect(v1.removeProperty('key1')).toEqual('value1');

    v1.setProperty('key2', 10);
    v2.setProperty('key2', 20);
    expect(v1.removeProperty('key2')).toEqual(10);
    expect(v2.removeProperty('key2')).toEqual(20);

    expect(v1.removeProperty('key1')).toBeNull();
    expect(v1.removeProperty('key2')).toBeNull();
    expect(v2.removeProperty('key2')).toBeNull();

    v1.setProperty('key1', 'value1');
    v1.setProperty('key2', 10);
    v2.setProperty('key2', 20);

    v1 = graph.getVertex(1);
    v2 = graph.getVertex(2);

    expect(v1.removeProperty('key1')).toEqual('value1');
    expect(v1.removeProperty('key2')).toEqual(10);
    expect(v2.removeProperty('key2')).toEqual(20);

    expect(v1.removeProperty('key1')).toBeNull();
    expect(v1.removeProperty('key2')).toBeNull();
    expect(v2.removeProperty('key2')).toBeNull();

    v1 = graph.getVertex(1);
    v2 = graph.getVertex(2);

    v1.setProperty('key1', 'value2');
    expect(v1.removeProperty('key1')).toEqual('value2');

    v1.setProperty('key2', 20);
    v2.setProperty('key2', 30);
    expect(v1.removeProperty('key2')).toEqual(20);
    expect(v2.removeProperty('key2')).toEqual(30);

    expect(v1.removeProperty('key1')).toBeNull();
    expect(v1.removeProperty('key2')).toBeNull();
    expect(v2.removeProperty('key2')).toBeNull();
  });

  it('should get edges and vertices', function () {
    var graph = new Graph();

    var a = graph.addVertex(null);
    var b = graph.addVertex(null);
    var c = graph.addVertex();
    var w = graph.addEdge(null, a, b, 'knows');
    var x = graph.addEdge(null, b, c, 'knows');
    var y = graph.addEdge(null, a, c, 'hates');
    var z = graph.addEdge(null, a, b, 'hates');
    var zz = graph.addEdge(null, c, c, 'hates');

    expect(a.getEdges(OUT).length).toBe(3);
    expect(a.getEdges(OUT, 'hates').length).toBe(2);
    expect(a.getEdges(OUT, 'knows').length).toBe(1);
    expect(a.getVertices(OUT).length).toBe(3);
    expect(a.getVertices(OUT, 'hates').length).toBe(2);
    expect(a.getVertices(OUT, 'knows').length).toBe(1);
    expect(a.getVertices(BOTH).length).toBe(3);
    expect(a.getVertices(BOTH, 'hates').length).toBe(2);
    expect(a.getVertices(BOTH, 'knows').length).toBe(1);

    expect(a.getEdges(OUT)).toContain(w);
    expect(a.getEdges(OUT)).toContain(y);
    expect(a.getEdges(OUT)).toContain(z);
    expect(a.getVertices(OUT)).toContain(b);
    expect(a.getVertices(OUT)).toContain(c);

    expect(a.getEdges(OUT, 'knows')).toContain(w);
    expect(a.getEdges(OUT, 'knows')).not.toContain(y);
    expect(a.getEdges(OUT, 'knows')).not.toContain(z);
    expect(a.getVertices(OUT, 'knows')).toContain(b);
    expect(a.getVertices(OUT, 'knows')).not.toContain(c);

    expect(a.getEdges(OUT, 'hates')).not.toContain(w);
    expect(a.getEdges(OUT, 'hates')).toContain(y);
    expect(a.getEdges(OUT, 'hates')).toContain(z);
    expect(a.getVertices(OUT, 'hates')).toContain(b);
    expect(a.getVertices(OUT, 'hates')).toContain(c);

    expect(a.getVertices(IN).length).toBe(0);
    expect(a.getVertices(IN, 'hates').length).toBe(0);
    expect(a.getVertices(IN, 'knows').length).toBe(0);

    expect(b.getEdges(BOTH).length).toBe(3);
    expect(b.getEdges(BOTH, 'knows').length).toBe(2);
    expect(b.getEdges(BOTH, 'knows')).toContain(x);
    expect(b.getEdges(BOTH, 'knows')).toContain(w);
    expect(b.getVertices(BOTH, 'knows')).toContain(a);
    expect(b.getVertices(BOTH, 'knows')).toContain(c);

    expect(c.getEdges(BOTH, 'hates').length).toBe(3);
    expect(c.getVertices(BOTH, 'hates').length).toBe(3);
    expect(c.getEdges(BOTH, 'knows').length).toBe(1);
    expect(c.getEdges(BOTH, 'hates')).toContain(y);
    expect(c.getEdges(BOTH, 'hates')).toContain(zz);
    expect(c.getVertices(BOTH, 'hates')).toContain(a);
    expect(c.getVertices(BOTH, 'hates')).toContain(c);
    expect(c.getEdges(IN, 'hates').length).toBe(2);
    expect(c.getEdges(OUT, 'hates').length).toBe(1);

    try {
      x.getVertex(BOTH);
      fail('Getting edge vertex with direction BOTH should fail');
    } catch (e) {
      expect(e.message).toEqual('Invalid direction. Must be either IN or OUT');
    }
  });

  it('should add edge via vertex', function () {
    var graph = new Graph();

    var v = graph.addVertex();
    var a = graph.addVertex();
    var b = graph.addVertex();

    v.addEdge('knows', a);
    v.addEdge('knows', b);

    expect(graph.getVertices().length).toBe(3);
    expect(graph.getEdges().length).toBe(2);

    expect(v.getEdges(OUT, 'knows').length).toBe(2);
    expect(a.getEdges(OUT, 'knows').length).toBe(0);
    expect(a.getEdges(IN, 'knows').length).toBe(1);

    expect(b.getEdges(OUT, 'knows').length).toBe(0);
    expect(b.getEdges(IN, 'knows').length).toBe(1);
  });

  it('should remove vertex', function () {
    var graph = new Graph();

    var a = graph.addVertex();
    var b = graph.addVertex();
    var c = graph.addVertex();

    var cId = c.getId();

    expect(graph.getVertices().length).toBe(3);

    a.remove();
    b.remove();

    expect(graph.getVertex(cId)).not.toBeNull();

    expect(graph.getVertices().length).toBe(1);
  });

  it('should not allow bad properties', function () {
    var graph = new Graph();

    var v = graph.addVertex();

    try {
      v.setProperty('', 'value');
      fail('Setting a vertex property with an empty string key should fail');
    } catch (e) {
      expect(e.message).toEqual('Property key must not be empty');
    }

    try {
      v.setProperty(null, 'value');
      fail('Setting a vertex property with a null key should fail');
    } catch (e) {
      expect(e.message).toEqual('Property key must be specified');
    }

    try {
      var key;
      v.setProperty(key, 'value');
      fail('Setting a vertex property with an undefined key should fail');
    } catch (e) {
      expect(e.message).toEqual('Property key must be specified');
    }

    try {
      v.setProperty('good', null);
      fail('Setting a vertex property with a null value should fail');
    } catch (e) {
      expect(e.message).toEqual('Property value must be specified');
    }
  });

});