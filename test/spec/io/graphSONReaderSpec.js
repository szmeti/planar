'use strict';

describe('GraphSONReader', function () {

  it('should add elements to empty graph', function () {
    var graph = new Graph();
    var graphSONReader = new GraphSONReader();

    graph = graphSONReader.read(graph, {
      graph: {
        mode: 'NORMAL',
        vertices: [
          {
            _id: 1,
            name: 'name 1'
          },
          {
            _id: 2,
            name: 'name 2'
          }
        ],
        edges: [
          {
            _id: 1,
            _outV: 1,
            _inV: 2,
            _label: 'label',
            property: 'edge property'
          }
        ]
      }
    });

    expect(graph.getVertex(1).getProperty('name')).toEqual('name 1');
    expect(graph.getVertex(2).getProperty('name')).toEqual('name 2');

    expect(graph.getEdge(1).getOutVertex().id).toEqual(1);
    expect(graph.getEdge(1).getInVertex().id).toEqual(2);
    expect(graph.getEdge(1).getLabel()).toEqual('label');
    expect(graph.getEdge(1).getProperty('property')).toEqual('edge property');
  });

  it('should add elements to non-empty graph', function () {
    var graph = new Graph();

    var v2 = graph.addVertex(2);
    v2.setProperty('name', 'name 2');

    var v3 = graph.addVertex(3);
    v3.setProperty('name', 'name 3');

    graph.addEdge(2, v2, v3, 'label 2');

    var graphSONReader = new GraphSONReader();

    graph = graphSONReader.read(graph, {
      graph: {
        mode: 'NORMAL',
        vertices: [
          {
            _id: 1,
            name: 'name 1'
          },
          {
            _id: 2,
            name: 'updated name 2'
          }
        ],
        edges: [
          {
            _id: 1,
            _outV: 1,
            _inV: 2,
            _label: 'label',
            property: 'edge property'
          }
        ]
      }
    });

    expect(graph.getVertex(1).getProperty('name')).toEqual('name 1');
    expect(graph.getVertex(2).getProperty('name')).toEqual('updated name 2');
    expect(graph.getVertex(3).getProperty('name')).toEqual('name 3');

    expect(graph.getEdge(1).getOutVertex().id).toEqual(1);
    expect(graph.getEdge(1).getInVertex().id).toEqual(2);
    expect(graph.getEdge(1).getLabel()).toEqual('label');
    expect(graph.getEdge(1).getProperty('property')).toEqual('edge property');

    expect(graph.getEdge(2).getOutVertex().id).toEqual(2);
    expect(graph.getEdge(2).getInVertex().id).toEqual(3);
    expect(graph.getEdge(2).getLabel()).toEqual('label 2');
  });
});
