'use strict';

describe('GraphSONReader', function () {

  it('should add elements to empty graph', function () {
    var graph = new Graph();
    var graphSONReader = new GraphSONReader();

    graph = graphSONReader.read(graph, {
      graph: {
        'vertices': [
          {
            'id': 1,
            'label': 'vertex',
            'outE': {
              'label': [{
                'id': 1,
                'inV': 2,
                'properties': {
                  '_property': 'not reserved',
                  'property': 'edge property'
                }
              }]
            },
            'properties': {
              '_beginX': [{
                'id': 0,
                'value': 123
              }],
              '_beginY': [{
                'id': 1,
                'value': 111
              }],
              'name': [{
                'id': 2,
                'value': 'name 1'
              }]
            }
          },
          {
            'id': 2,
            'label': 'vertex',
            'inE': {
              'label': [{
                'id': 1,
                'outV': 1,
                'properties': {
                  '_property': 'not reserved',
                  'property': 'edge property'
                }
              }]
            },
            'properties': {
              '_beginX': [{
                'id': 3,
                'value': 145
              }],
              '_beginY': [{
                'id': 4,
                'value': 222
              }],
              'name': [{
                'id': 5,
                'value': 'name 2'
              }]
            }
          }
        ]
      }
    });

    expect(graph.getVertex(1).getProperty('name')).toEqual('name 1');
    expect(graph.getVertex(1).getProperty('_id')).toEqual(null);
    expect(graph.getVertex(1).getProperty('_type')).toEqual(null);
    expect(graph.getVertex(1).getProperty('_beginX')).toEqual(123);
    expect(graph.getVertex(1).getProperty('_beginY')).toEqual(111);

    expect(graph.getVertex(2).getProperty('name')).toEqual('name 2');
    expect(graph.getVertex(2).getProperty('_id')).toEqual(null);
    expect(graph.getVertex(2).getProperty('_type')).toEqual(null);
    expect(graph.getVertex(2).getProperty('_beginX')).toEqual(145);
    expect(graph.getVertex(2).getProperty('_beginY')).toEqual(222);

    expect(graph.getEdge(1).getOutVertex().id).toEqual(1);
    expect(graph.getEdge(1).getInVertex().id).toEqual(2);
    expect(graph.getEdge(1).getLabel()).toEqual('label');
    expect(graph.getEdge(1).getProperty('property')).toEqual('edge property');
    expect(graph.getEdge(1).getProperty('_id')).toEqual(null);
    expect(graph.getEdge(1).getProperty('_type')).toEqual(null);
    expect(graph.getEdge(1).getProperty('_outV')).toEqual(null);
    expect(graph.getEdge(1).getProperty('_inV')).toEqual(null);
    expect(graph.getEdge(1).getProperty('_label')).toEqual(null);
    expect(graph.getEdge(1).getProperty('_property')).toEqual('not reserved');
  });
  
  // TODO: Currently we only iterate on outEdges, so it cannot merge inEdges without vertices. Fix this case only when it is needed
  // it('should add elements to non-empty graph', function () {
  //   var graph = new Graph();
  //
  //   var v2 = graph.addVertex(2);
  //   v2.setProperty('name', 'name 2');
  //
  //   var v3 = graph.addVertex(3);
  //   v3.setProperty('name', 'name 3');
  //
  //   graph.addEdge(2, v2, v3, 'label 2');
  //
  //   var graphSONReader = new GraphSONReader();
  //
  //   graph = graphSONReader.read(graph, {
  //     graph: {
  //       'vertices': [
  //         {
  //           'id': 1,
  //           'label': 'vertex',
  //           'outE': {
  //             'label 1': [{
  //               'id': 1,
  //               'inV': 2,
  //               'properties': {
  //                 'property': 'edge property 1'
  //               }
  //             }]
  //           },
  //           'properties': {
  //             'name': [{
  //               'id': 0,
  //               'value': 'name 1'
  //             }]
  //           }
  //         },
  //         {
  //           'id': 2,
  //           'label': 'vertex',
  //           'inE': {
  //             'label 3': [{
  //               'id': 3,
  //               'outV': 3,
  //               'properties': {
  //                 'property': 'edge property 3'
  //               }
  //             }]
  //           },
  //           'properties': {
  //             'name': [{
  //               'id': 0,
  //               'value': 'updated name 2'
  //             }]
  //           }
  //         }
  //       ]
  //     }
  //   });
  //
  //   expect(graph.getVertex(1).getProperty('name')).toEqual('name 1');
  //   expect(graph.getVertex(1).getProperty('_id')).toEqual(null);
  //   expect(graph.getVertex(2).getProperty('name')).toEqual('updated name 2');
  //   expect(graph.getVertex(2).getProperty('_id')).toEqual(null);
  //   expect(graph.getVertex(3).getProperty('name')).toEqual('name 3');
  //
  //   expect(graph.getEdge(1).getOutVertex().id).toEqual(1);
  //   expect(graph.getEdge(1).getInVertex().id).toEqual(2);
  //   expect(graph.getEdge(1).getLabel()).toEqual('label 1');
  //   expect(graph.getEdge(1).getProperty('property')).toEqual('edge property 1');
  //   expect(graph.getEdge(1).getProperty('_id')).toEqual(null);
  //   expect(graph.getEdge(1).getProperty('_outV')).toEqual(null);
  //   expect(graph.getEdge(1).getProperty('_inV')).toEqual(null);
  //   expect(graph.getEdge(1).getProperty('_label')).toEqual(null);
  //
  //   expect(graph.getEdge(2).getOutVertex().id).toEqual(2);
  //   expect(graph.getEdge(2).getInVertex().id).toEqual(3);
  //   expect(graph.getEdge(2).getLabel()).toEqual('label 2');
  //
  //   expect(graph.getEdge(3).getOutVertex().id).toEqual(3);
  //   expect(graph.getEdge(3).getInVertex().id).toEqual(2);
  //   expect(graph.getEdge(3).getLabel()).toEqual('label 3');
  //   expect(graph.getEdge(3).getProperty('property')).toEqual('edge property 3');
  //   expect(graph.getEdge(3).getProperty('_id')).toEqual(null);
  //   expect(graph.getEdge(3).getProperty('_outV')).toEqual(null);
  //   expect(graph.getEdge(3).getProperty('_inV')).toEqual(null);
  //   expect(graph.getEdge(3).getProperty('_label')).toEqual(null);
  // });
});
