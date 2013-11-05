'use strict';

describe('Edge', function () {

  it('should return equal objects', function () {
    var graph = new Graph();

    var v = graph.addVertex(1);
    var u = graph.addVertex(2);
    var e = graph.addEdge(1, v, u, 'knows');

    expect(e.getLabel()).toEqual('knows');
    expect(e.getInVertex()).toBe(u);
    expect(e.getVertex(IN)).toBe(u);
    expect(e.getOutVertex()).toBe(v);
    expect(e.getVertex(OUT)).toBe(v);
    expect(v.getEdges(OUT)[0]).toBe(e);
    expect(u.getEdges(IN)[0]).toBe(e);
  });

  it('should add edges', function () {
    var graph = new Graph();

    var v1 = graph.addVertex(1);
    var v2 = graph.addVertex(2);
    var v3 = graph.addVertex(3);
    graph.addEdge(1, v1, v2, 'knows');
    graph.addEdge(2, v2, v3, 'pets');
    graph.addEdge(3, v2, v3, 'caresFor');

    expect(v1.getEdges(OUT).length).toBe(1);
    expect(v2.getEdges(OUT).length).toBe(2);
    expect(v3.getEdges(OUT).length).toBe(0);
    expect(v1.getEdges(IN).length).toBe(0);
    expect(v2.getEdges(IN).length).toBe(1);
    expect(v3.getEdges(IN).length).toBe(2);
  });

  it('should add many edges', function () {
    var graph = new Graph();
    var edgeCount = 100;
    var vertexCount = 200;
    var counter = 0;

    for (var i = 0; i < edgeCount; i++) {
      var outV = graph.addVertex(counter++);
      var inV = graph.addVertex(counter++);
      graph.addEdge(i, outV, inV, 'knows');
    }

    expect(graph.getEdges().length).toBe(edgeCount);
    var vertices = graph.getVertices();
    expect(vertices.length).toBe(vertexCount);

    for (i = 0; i < vertices.length; i++) {
      var vertex = vertices[i];

      if (vertex.getEdges(OUT).length > 0) {
        expect(vertex.getEdges(OUT).length).toBe(1);
        expect(vertex.getEdges(IN).length).toBe(0);
      } else {
        expect(vertex.getEdges(IN).length).toBe(1);
        expect(vertex.getEdges(OUT).length).toBe(0);
      }
    }
  });

  it('should get edges', function () {
    var graph = new Graph();

    var v1 = graph.addVertex(1);
    var v2 = graph.addVertex(2);
    var v3 = graph.addVertex(3);
    var e1 = graph.addEdge(1, v1, v2, 'test1');
    var e2 = graph.addEdge(2, v2, v3, 'test2');
    var e3 = graph.addEdge(3, v3, v1, 'test3');

    expect(graph.getEdge(e1.getId())).toBe(e1);
    expect(graph.getEdge(e1.getId()).getVertex(IN), v2);
    expect(graph.getEdge(e1.getId()).getVertex(OUT), v1);

    expect(graph.getEdge(e2.getId())).toBe(e2);
    expect(graph.getEdge(e2.getId()).getVertex(IN), v3);
    expect(graph.getEdge(e2.getId()).getVertex(OUT), v2);

    expect(graph.getEdge(e3.getId())).toBe(e3);
    expect(graph.getEdge(e3.getId()).getVertex(IN), v1);
    expect(graph.getEdge(e3.getId()).getVertex(OUT), v3);

    expect(v1.getEdges(OUT).length).toBe(1);
    expect(v1.getEdges(OUT)[0]).toBe(e1);
    expect(v1.getEdges(OUT)[0].getVertex(IN), v2);
    expect(v1.getEdges(OUT)[0].getVertex(OUT), v1);

    expect(v2.getEdges(OUT).length).toBe(1);
    expect(v2.getEdges(OUT)[0]).toBe(e2);
    expect(v2.getEdges(OUT)[0].getVertex(IN), v3);
    expect(v2.getEdges(OUT)[0].getVertex(OUT), v2);

    expect(v3.getEdges(OUT).length).toBe(1);
    expect(v3.getEdges(OUT)[0]).toBe(e3);
    expect(v3.getEdges(OUT)[0].getVertex(IN), v1);
    expect(v3.getEdges(OUT)[0].getVertex(OUT), v3);
  });

  it('should not get non-existent edges', function () {
    var graph = new Graph();

    try {
      graph.getEdge(null);
      fail('Getting an element with a null identifier must throw exception');
    } catch (e) {
      expect(e.message).toEqual('ID must be specified');
    }

    try {
      var id;
      graph.getEdge(id);
      fail('Getting an element with an undefined identifier must throw exception');
    } catch (e) {
      expect(e.message).toEqual('ID must be specified');
    }

    expect(graph.getEdge('asds')).toBeNull();
    expect(graph.getEdge(12)).toBeNull();
  });

  it('should remove many edges', function () {
    var graph = new Graph();
    var edgeCount = 10;
    var counter = 200000;
    var edges = [];

    for (var i = 0; i < edgeCount; i++) {
      var outV = graph.addVertex(counter++);
      var inV = graph.addVertex(counter++);
      edges.push(graph.addEdge(i, outV, inV, 'knows'));
    }

    expect(edges.length).toBe(edgeCount);
    expect(graph.getVertices().length).toBe(edgeCount * 2);
    expect(graph.getEdges().length).toBe(edgeCount);

    var remaining = edgeCount;
    for (i = 0; i < edges.length; i++) {
      var edge = edges[i];

      if (Math.random() < 0.5) {
        graph.removeEdge(edge);
      } else {
        edge.remove();
      }

      remaining--;
      expect(graph.getEdges().length).toBe(remaining);

      var vertices = graph.getVertices();
      var x = 0;
      for (var j = 0; j < vertices.length; j++) {
        var vertex = vertices[j];

        if (vertex.getEdges(OUT).length > 0) {
          expect(vertex.getEdges(OUT).length).toBe(1);
          expect(vertex.getEdges(IN).length).toBe(0);
        } else if (vertex.getEdges(IN).length > 0) {
          expect(vertex.getEdges(IN).length).toBe(1);
          expect(vertex.getEdges(OUT).length).toBe(0);
        } else {
          x++;
        }
      }

      expect((edgeCount - remaining) * 2).toBe(x);
    }
  });

  it('should add duplicate edges', function () {
    var graph = new Graph();

    var v1 = graph.addVertex(1);
    var v2 = graph.addVertex(2);
    var v3 = graph.addVertex(3);
    graph.addEdge(1, v1, v2, 'knows');
    graph.addEdge(2, v2, v3, 'pets');
    graph.addEdge(3, v2, v3, 'pets');
    graph.addEdge(4, v2, v3, 'pets');
    graph.addEdge(5, v2, v3, 'pets');

    expect(graph.getVertices().length).toBe(3);
    expect(graph.getEdges().length).toBe(5);

    expect(v1.getEdges(OUT).length).toBe(1);
    expect(v2.getEdges(OUT).length).toBe(4);
    expect(v3.getEdges(OUT).length).toBe(0);
    expect(v1.getEdges(IN).length).toBe(0);
    expect(v2.getEdges(IN).length).toBe(1);
    expect(v3.getEdges(IN).length).toBe(4);
  });

  it('should remove edges by removing vertex', function () {
    var graph = new Graph();

    var v1 = graph.addVertex(1);
    var v2 = graph.addVertex(2);
    var v3 = graph.addVertex(3);
    graph.addEdge(1, v1, v2, 'knows');
    graph.addEdge(2, v2, v3, 'pets');
    graph.addEdge(3, v2, v3, 'pets');

    expect(v1.getEdges(OUT).length).toBe(1);
    expect(v3.getEdges(OUT).length).toBe(0);
    expect(v1.getEdges(IN).length).toBe(0);
    expect(v2.getEdges(IN).length).toBe(1);

    v1 = graph.getVertex(1);
    v2 = graph.getVertex(2);
    v3 = graph.getVertex(3);

    expect(v1.getEdges(OUT).length).toBe(1);
    expect(v3.getEdges(OUT).length).toBe(0);
    expect(v1.getEdges(IN).length).toBe(0);
    expect(v2.getEdges(IN).length).toBe(1);

    expect(graph.getVertices().length).toBe(3);

    graph.removeVertex(v1);

    expect(graph.getVertices().length).toBe(2);
    expect(v2.getEdges(OUT).length).toBe(2);
    expect(v2.getEdges(IN).length).toBe(0);
    expect(v3.getEdges(OUT).length).toBe(0);
    expect(v3.getEdges(IN).length).toBe(2);
  });

  it('should remove edges', function () {
    var graph = new Graph();

    var v1 = graph.addVertex(1);
    var v2 = graph.addVertex(2);
    var v3 = graph.addVertex(3);
    var e1 = graph.addEdge(1, v1, v2, 'knows');
    var e2 = graph.addEdge(2, v2, v3, 'pets');
    var e3 = graph.addEdge(3, v2, v3, 'cares_for');

    expect(graph.getVertices().length).toBe(3);

    graph.removeEdge(e1);

    expect(v1.getEdges(OUT).length).toBe(0);
    expect(v2.getEdges(OUT).length).toBe(2);
    expect(v3.getEdges(OUT).length).toBe(0);
    expect(v1.getEdges(IN).length).toBe(0);
    expect(v2.getEdges(IN).length).toBe(0);
    expect(v3.getEdges(IN).length).toBe(2);

    v1 = graph.getVertex(1);
    v2 = graph.getVertex(2);
    v3 = graph.getVertex(3);

    expect(v1.getEdges(OUT).length).toBe(0);
    expect(v2.getEdges(OUT).length).toBe(2);
    expect(v3.getEdges(OUT).length).toBe(0);
    expect(v1.getEdges(IN).length).toBe(0);
    expect(v2.getEdges(IN).length).toBe(0);
    expect(v3.getEdges(IN).length).toBe(2);

    e2.remove();

    expect(v1.getEdges(OUT).length).toBe(0);
    expect(v2.getEdges(OUT).length).toBe(1);
    expect(v3.getEdges(OUT).length).toBe(0);
    expect(v1.getEdges(IN).length).toBe(0);
    expect(v2.getEdges(IN).length).toBe(0);
    expect(v3.getEdges(IN).length).toBe(1);

    v1 = graph.getVertex(1);
    v2 = graph.getVertex(2);
    v3 = graph.getVertex(3);

    expect(v1.getEdges(OUT).length).toBe(0);
    expect(v2.getEdges(OUT).length).toBe(1);
    expect(v3.getEdges(OUT).length).toBe(0);
    expect(v1.getEdges(IN).length).toBe(0);
    expect(v2.getEdges(IN).length).toBe(0);
    expect(v3.getEdges(IN).length).toBe(1);

    graph.removeEdge(e3);

    expect(v1.getEdges(OUT).length).toBe(0);
    expect(v2.getEdges(OUT).length).toBe(0);
    expect(v3.getEdges(OUT).length).toBe(0);
    expect(v1.getEdges(IN).length).toBe(0);
    expect(v2.getEdges(IN).length).toBe(0);
    expect(v3.getEdges(IN).length).toBe(0);

    v1 = graph.getVertex(1);
    v2 = graph.getVertex(2);
    v3 = graph.getVertex(3);

    expect(v1.getEdges(OUT).length).toBe(0);
    expect(v2.getEdges(OUT).length).toBe(0);
    expect(v3.getEdges(OUT).length).toBe(0);
    expect(v1.getEdges(IN).length).toBe(0);
    expect(v2.getEdges(IN).length).toBe(0);
    expect(v3.getEdges(IN).length).toBe(0);
  });

  it('should add self loops', function () {
    var graph = new Graph();

    var v1 = graph.addVertex(1);
    var v2 = graph.addVertex(2);
    var v3 = graph.addVertex(3);
    graph.addEdge(1, v1, v1, 'is_self');
    graph.addEdge(2, v2, v2, 'is_self');
    graph.addEdge(3, v3, v3, 'is_self');

    expect(graph.getVertices().length).toBe(3);
    var edges = graph.getEdges();
    expect(edges.length).toBe(3);

    for (var i = 0; i < edges.length; i++) {
      var edge = edges[i];

      expect(edge.getVertex(IN)).toBe(edge.getVertex(OUT));
      expect(edge.getVertex(IN).getId()).toBe(edge.getVertex(OUT).getId());
    }
  });

  it('should remove self loops', function () {
    var graph = new Graph();

    var v1 = graph.addVertex(1);
    var v2 = graph.addVertex(2);
    var v3 = graph.addVertex(3);
    graph.addEdge(1, v1, v1, 'is_self');
    var e2 = graph.addEdge(2, v2, v2, 'is_self');
    graph.addEdge(3, v3, v3, 'is_self');

    expect(graph.getVertices().length).toBe(3);
    var edges = graph.getEdges();
    expect(edges.length).toBe(3);

    var edge;
    for (var i = 0; i < edges.length; i++) {
      edge = edges[i];

      expect(edge.getVertex(IN)).toBe(edge.getVertex(OUT));
      expect(edge.getVertex(IN).getId()).toBe(edge.getVertex(OUT).getId());
    }

    graph.removeVertex(v1);

    edges = graph.getEdges();
    expect(edges.length).toBe(2);

    for (i = 0; i < edges.length; i++) {
      edge = edges[i];

      expect(edge.getVertex(IN)).toBe(edge.getVertex(OUT));
      expect(edge.getVertex(IN).getId()).toBe(edge.getVertex(OUT).getId());
    }

    expect(v2.getEdges(OUT).length).toBe(1);
    expect(v2.getEdges(IN).length).toBe(1);

    graph.removeEdge(e2);

    expect(v2.getEdges(OUT).length).toBe(0);
    expect(v2.getEdges(IN).length).toBe(0);

    edges = graph.getEdges();
    expect(edges.length).toBe(1);

    for (i = 0; i < edges.length; i++) {
      edge = edges[i];

      expect(edge.getVertex(IN)).toBe(edge.getVertex(OUT));
      expect(edge.getVertex(IN).getId()).toBe(edge.getVertex(OUT).getId());
    }
  });

  it('should get all edges', function () {
    var graph = new Graph();

    var v1 = graph.addVertex(1);
    var v2 = graph.addVertex(2);
    var v3 = graph.addVertex(3);
    var e1 = graph.addEdge(1, v1, v2, 'test');
    var e2 = graph.addEdge(2, v2, v3, 'test');
    var e3 = graph.addEdge(3, v3, v1, 'test');

    expect(graph.getVertices().length).toBe(3);
    var edges = graph.getEdges();
    expect(edges.length).toBe(3);

    var edgeIds = [];
    for (var i = 0; i < edges.length; i++) {
      var edge = edges[i];

      edgeIds.push(edge.getId());
      expect(edge.getLabel()).toEqual('test');

      if (edge.getId() === e1.getId()) {
        expect(edge.getVertex(OUT), v1);
        expect(edge.getVertex(IN), v2);
      } else if (edge.getId() === e2.getId()) {
        expect(edge.getVertex(OUT), v2);
        expect(edge.getVertex(IN), v3);
      } else if (edge.getId() === e3.getId()) {
        expect(edge.getVertex(OUT), v3);
        expect(edge.getVertex(IN), v1);
      } else {
        fail('invalid id');
      }
    }

    expect(edgeIds.length).toBe(3);
    expect(edgeIds).toContain(1);
    expect(edgeIds).toContain(2);
    expect(edgeIds).toContain(3);
  });

  it('should add and remove edge properties', function () {
    var graph = new Graph();

    var a = graph.addVertex(1);
    var b = graph.addVertex(2);
    var edge = graph.addEdge(3, a, b, 'knows');

    expect(edge.getPropertyKeys().length).toBe(0);
    expect(edge.getProperty('weight')).toBeNull();

    edge.setProperty('weight', 0.5);
    expect(edge.getPropertyKeys().length).toBe(1);
    expect(edge.getProperty('weight')).toBe(0.5);

    edge.setProperty('weight', 0.6);
    expect(edge.getPropertyKeys().length).toBe(1);
    expect(edge.getProperty('weight')).toBe(0.6);
    expect(edge.removeProperty('weight')).toBe(0.6);
    expect(edge.getPropertyKeys().length).toBe(0);
    expect(edge.getProperty('weight')).toBeNull();

    edge.setProperty('blah', 'marko');
    edge.setProperty('blah2', 'josh');
    expect(edge.getPropertyKeys().length).toBe(2);
  });

  it('should not allow bad properties', function () {
    var graph = new Graph();

    var a = graph.addVertex(1);
    var b = graph.addVertex(2);
    var edge = graph.addEdge(3, a, b, 'knows');

    try {
      edge.setProperty('', 'value');
      fail('Setting an edge property with an empty string key should fail');
    } catch (e) {
      expect(e.message).toEqual('Property key must not be empty');
    }

    try {
      edge.setProperty(null, 'value');
      fail('Setting an edge property with a null key should fail');
    } catch (e) {
      expect(e.message).toEqual('Property key must be specified');
    }

    try {
      var key;
      edge.setProperty(key, 'value');
      fail('Setting an edge property with an undefined key should fail');
    } catch (e) {
      expect(e.message).toEqual('Property key must be specified');
    }

    try {
      edge.setProperty('good', null);
      fail('Setting an edge property with a null value should fail');
    } catch (e) {
      expect(e.message).toEqual('Property value must be specified');
    }
  });

  it('should allow edge centric removal', function () {
    var graph = new Graph();

    var a = graph.addEdge(1, graph.addVertex(1), graph.addVertex(2), 'knows');
    var b = graph.addEdge(2, graph.addVertex(3), graph.addVertex(4), 'knows');
    var c = graph.addEdge(3, graph.addVertex(5), graph.addVertex(6), 'knows');

    expect(graph.getEdges().length).toBe(3);

    a.remove();
    b.remove();

    expect(graph.getEdge(3)).toBe(c);
    expect(graph.getEdges().length).toBe(1);
  });

});