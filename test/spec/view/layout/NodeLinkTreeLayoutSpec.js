'use strict';

describe('NodeLinkTreeLayout', function () {
  var now;
  var actualScale;
  var nodeLinkTreeLayout;

  beforeEach(function () {
    nodeLinkTreeLayout = new NodeLinkTreeLayout(1000, Easing.expoInOut);
    now = 0;
    Tween.dateNow = function () {
      return now;
    };

    LayoutUtils.setScale = function (scale) {
      actualScale = scale;
    };
  });

  it('should calculate location of elements in one tree', function () {
    var graph = new Graph();

    var v1 = graph.addVertex();
    var v2 = graph.addVertex();
    var v3 = graph.addVertex();
    var v4 = graph.addVertex();
    var v5 = graph.addVertex();
    var v6 = graph.addVertex();
    var v7 = graph.addVertex();
    var v8 = graph.addVertex();
    var v9 = graph.addVertex();
    var v10 = graph.addVertex();
    var v11 = graph.addVertex();
    var v12 = graph.addVertex();
    var v13 = graph.addVertex();
    var v14 = graph.addVertex();
    var v15 = graph.addVertex();
    var v16 = graph.addVertex();
    var v17 = graph.addVertex();
    var v18 = graph.addVertex();
    var v19 = graph.addVertex();
    var v20 = graph.addVertex();
    var v21 = graph.addVertex();

    graph.addEdge(null, v1, v6, 'knows');
    graph.addEdge(null, v1, v7, 'knows');
    graph.addEdge(null, v1, v3, 'knows');
    graph.addEdge(null, v7, v5, 'knows');
    graph.addEdge(null, v6, v8, 'knows');
    graph.addEdge(null, v6, v4, 'knows');
    graph.addEdge(null, v8, v2, 'knows');
    graph.addEdge(null, v3, v9, 'knows');
    graph.addEdge(null, v1, v10, 'knows');
    graph.addEdge(null, v1, v11, 'knows');
    graph.addEdge(null, v8, v12, 'knows');
    graph.addEdge(null, v8, v13, 'knows');
    graph.addEdge(null, v19, v14, 'knows');
    graph.addEdge(null, v19, v15, 'knows');
    graph.addEdge(null, v19, v16, 'knows');
    graph.addEdge(null, v11, v17, 'knows');
    graph.addEdge(null, v11, v18, 'knows');
    graph.addEdge(null, v11, v19, 'knows');
    graph.addEdge(null, v19, v20, 'knows');
    graph.addEdge(null, v19, v21, 'knows');

    v1 = {id: v1.id, vertex: v1};
    v2 = {id: v2.id, vertex: v2};
    v3 = {id: v3.id, vertex: v3};
    v4 = {id: v4.id, vertex: v4};
    v5 = {id: v5.id, vertex: v5};
    v6 = {id: v6.id, vertex: v6};
    v7 = {id: v7.id, vertex: v7};
    v8 = {id: v8.id, vertex: v8};
    v9 = {id: v9.id, vertex: v9};
    v10 = {id: v10.id, vertex: v10};
    v11 = {id: v11.id, vertex: v11};
    v12 = {id: v12.id, vertex: v12};
    v13 = {id: v13.id, vertex: v13};
    v14 = {id: v14.id, vertex: v14};
    v15 = {id: v15.id, vertex: v15};
    v16 = {id: v16.id, vertex: v16};
    v17 = {id: v17.id, vertex: v17};
    v18 = {id: v18.id, vertex: v18};
    v19 = {id: v19.id, vertex: v19};
    v20 = {id: v20.id, vertex: v20};
    v21 = {id: v21.id, vertex: v21};

    var vertices = [v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15, v16, v17, v18, v19, v20, v21];

    nodeLinkTreeLayout.step(vertices, null, 900, 680);

    expect(actualScale).toBeCloseTo(0.9167, 4);

    expect(v1.children.length).toEqual(5);
    expect(v1.children[0].id).toEqual(v6.id);
    expect(v1.children[1].id).toEqual(v7.id);
    expect(v1.children[2].id).toEqual(v3.id);
    expect(v1.children[3].id).toEqual(v10.id);
    expect(v1.children[4].id).toEqual(v11.id);
    expect(v1.parent).toEqual(undefined);
    expect(v1.depth).toEqual(0);
    expect(v1.beginX).toEqual(450);
    expect(v1.beginY).toEqual(75);
    expect(v1.endX).toEqual(450);
    expect(v1.endY).toEqual(75);
    expect(v1.x).toEqual(450);
    expect(v1.y).toEqual(75);

    expect(v6.children.length).toEqual(2);
    expect(v6.children[0].id).toEqual(v8.id);
    expect(v6.children[1].id).toEqual(v4.id);
    expect(v6.parent.id).toEqual(v1.id);
    expect(v6.depth).toEqual(1);
    expect(v6.beginX).toEqual(450);
    expect(v6.beginY).toEqual(75);
    expect(v6.endX).toEqual(240);
    expect(v6.endY).toEqual(200);
    expect(v6.x).toEqual(450);
    expect(v6.y).toEqual(75);

    expect(v8.children.length).toEqual(3);
    expect(v8.children[0].id).toEqual(v2.id);
    expect(v8.children[1].id).toEqual(v12.id);
    expect(v8.children[2].id).toEqual(v13.id);
    expect(v8.parent.id).toEqual(v6.id);
    expect(v8.depth).toEqual(2);
    expect(v8.beginX).toEqual(450);
    expect(v8.beginY).toEqual(75);
    expect(v8.endX).toEqual(200);
    expect(v8.endY).toEqual(325);
    expect(v8.x).toEqual(450);
    expect(v8.y).toEqual(75);

    expect(v2.children.length).toEqual(0);
    expect(v2.parent.id).toEqual(v8.id);
    expect(v2.depth).toEqual(3);
    expect(v2.beginX).toEqual(450);
    expect(v2.beginY).toEqual(75);
    expect(v2.endX).toEqual(120);
    expect(v2.endY).toEqual(450);
    expect(v2.x).toEqual(450);
    expect(v2.y).toEqual(75);

    expect(v12.children.length).toEqual(0);
    expect(v12.parent.id).toEqual(v8.id);
    expect(v12.depth).toEqual(3);
    expect(v12.beginX).toEqual(450);
    expect(v12.beginY).toEqual(75);
    expect(v12.endX).toEqual(200);
    expect(v12.endY).toEqual(450);
    expect(v12.x).toEqual(450);
    expect(v12.y).toEqual(75);

    expect(v13.children.length).toEqual(0);
    expect(v13.parent.id).toEqual(v8.id);
    expect(v13.depth).toEqual(3);
    expect(v13.beginX).toEqual(450);
    expect(v13.beginY).toEqual(75);
    expect(v13.endX).toEqual(280);
    expect(v13.endY).toEqual(450);
    expect(v13.x).toEqual(450);
    expect(v13.y).toEqual(75);

    expect(v4.children.length).toEqual(0);
    expect(v4.parent.id).toEqual(v6.id);
    expect(v4.depth).toEqual(2);
    expect(v4.beginX).toEqual(450);
    expect(v4.beginY).toEqual(75);
    expect(v4.endX).toEqual(280);
    expect(v4.endY).toEqual(325);
    expect(v4.x).toEqual(450);
    expect(v4.y).toEqual(75);

    expect(v7.children.length).toEqual(1);
    expect(v7.children[0].id).toEqual(v5.id);
    expect(v7.parent.id).toEqual(v1.id);
    expect(v7.depth).toEqual(1);
    expect(v7.beginX).toEqual(450);
    expect(v7.beginY).toEqual(75);
    expect(v7.endX).toEqual(380);
    expect(v7.endY).toEqual(200);
    expect(v7.x).toEqual(450);
    expect(v7.y).toEqual(75);

    expect(v5.children.length).toEqual(0);
    expect(v5.parent.id).toEqual(v7.id);
    expect(v5.depth).toEqual(2);
    expect(v5.beginX).toEqual(450);
    expect(v5.beginY).toEqual(75);
    expect(v5.endX).toEqual(380);
    expect(v5.endY).toEqual(325);
    expect(v5.x).toEqual(450);
    expect(v5.y).toEqual(75);

    expect(v3.children.length).toEqual(1);
    expect(v3.children[0].id).toEqual(v9.id);
    expect(v3.parent.id).toEqual(v1.id);
    expect(v3.depth).toEqual(1);
    expect(v3.beginX).toEqual(450);
    expect(v3.beginY).toEqual(75);
    expect(v3.endX).toEqual(480);
    expect(v3.endY).toEqual(200);
    expect(v3.x).toEqual(450);
    expect(v3.y).toEqual(75);

    expect(v9.children.length).toEqual(0);
    expect(v9.parent.id).toEqual(v3.id);
    expect(v9.depth).toEqual(2);
    expect(v9.beginX).toEqual(450);
    expect(v9.beginY).toEqual(75);
    expect(v9.endX).toEqual(480);
    expect(v9.endY).toEqual(325);
    expect(v9.x).toEqual(450);
    expect(v9.y).toEqual(75);

    expect(v10.children.length).toEqual(0);
    expect(v10.parent.id).toEqual(v1.id);
    expect(v10.depth).toEqual(1);
    expect(v10.beginX).toEqual(450);
    expect(v10.beginY).toEqual(75);
    expect(v10.endX).toEqual(570);
    expect(v10.endY).toEqual(200);
    expect(v10.x).toEqual(450);
    expect(v10.y).toEqual(75);

    expect(v11.children.length).toEqual(3);
    expect(v11.children[0].id).toEqual(v17.id);
    expect(v11.children[1].id).toEqual(v18.id);
    expect(v11.children[2].id).toEqual(v19.id);
    expect(v11.parent.id).toEqual(v1.id);
    expect(v11.depth).toEqual(1);
    expect(v11.beginX).toEqual(450);
    expect(v11.beginY).toEqual(75);
    expect(v11.endX).toEqual(660);
    expect(v11.endY).toEqual(200);
    expect(v11.x).toEqual(450);
    expect(v11.y).toEqual(75);

    expect(v17.children.length).toEqual(0);
    expect(v17.parent.id).toEqual(v11.id);
    expect(v17.depth).toEqual(2);
    expect(v17.beginX).toEqual(450);
    expect(v17.beginY).toEqual(75);
    expect(v17.endX).toEqual(580);
    expect(v17.endY).toEqual(325);
    expect(v17.x).toEqual(450);
    expect(v17.y).toEqual(75);

    expect(v18.children.length).toEqual(0);
    expect(v18.parent.id).toEqual(v11.id);
    expect(v18.depth).toEqual(2);
    expect(v18.beginX).toEqual(450);
    expect(v18.beginY).toEqual(75);
    expect(v18.endX).toEqual(660);
    expect(v18.endY).toEqual(325);
    expect(v18.x).toEqual(450);
    expect(v18.y).toEqual(75);

    expect(v19.children.length).toEqual(5);
    expect(v19.children[0].id).toEqual(v14.id);
    expect(v19.children[1].id).toEqual(v15.id);
    expect(v19.children[2].id).toEqual(v16.id);
    expect(v19.children[3].id).toEqual(v20.id);
    expect(v19.children[4].id).toEqual(v21.id);
    expect(v19.parent.id).toEqual(v11.id);
    expect(v19.depth).toEqual(2);
    expect(v19.beginX).toEqual(450);
    expect(v19.beginY).toEqual(75);
    expect(v19.endX).toEqual(740);
    expect(v19.endY).toEqual(325);
    expect(v19.x).toEqual(450);
    expect(v19.y).toEqual(75);

    expect(v14.children.length).toEqual(0);
    expect(v14.parent.id).toEqual(v19.id);
    expect(v14.depth).toEqual(3);
    expect(v14.beginX).toEqual(450);
    expect(v14.beginY).toEqual(75);
    expect(v14.endX).toEqual(580);
    expect(v14.endY).toEqual(450);
    expect(v14.x).toEqual(450);
    expect(v14.y).toEqual(75);

    expect(v15.children.length).toEqual(0);
    expect(v15.parent.id).toEqual(v19.id);
    expect(v15.depth).toEqual(3);
    expect(v15.beginX).toEqual(450);
    expect(v15.beginY).toEqual(75);
    expect(v15.endX).toEqual(660);
    expect(v15.endY).toEqual(450);
    expect(v15.x).toEqual(450);
    expect(v15.y).toEqual(75);

    expect(v16.children.length).toEqual(0);
    expect(v16.parent.id).toEqual(v19.id);
    expect(v16.depth).toEqual(3);
    expect(v16.beginX).toEqual(450);
    expect(v16.beginY).toEqual(75);
    expect(v16.endX).toEqual(740);
    expect(v16.endY).toEqual(450);
    expect(v16.x).toEqual(450);
    expect(v16.y).toEqual(75);

    expect(v20.children.length).toEqual(0);
    expect(v20.parent.id).toEqual(v19.id);
    expect(v20.depth).toEqual(3);
    expect(v20.beginX).toEqual(450);
    expect(v20.beginY).toEqual(75);
    expect(v20.endX).toEqual(820);
    expect(v20.endY).toEqual(450);
    expect(v20.x).toEqual(450);
    expect(v20.y).toEqual(75);

    expect(v21.children.length).toEqual(0);
    expect(v21.parent.id).toEqual(v19.id);
    expect(v21.depth).toEqual(3);
    expect(v21.beginX).toEqual(450);
    expect(v21.beginY).toEqual(75);
    expect(v21.endX).toEqual(900);
    expect(v21.endY).toEqual(450);
    expect(v21.x).toEqual(450);
    expect(v21.y).toEqual(75);

    now = 500;

    nodeLinkTreeLayout.step(vertices, null, 900, 680);

    expect(actualScale).toBeCloseTo(0.9167, 4);

    expect(v1.children.length).toEqual(5);
    expect(v1.children[0].id).toEqual(v6.id);
    expect(v1.children[1].id).toEqual(v7.id);
    expect(v1.children[2].id).toEqual(v3.id);
    expect(v1.children[3].id).toEqual(v10.id);
    expect(v1.children[4].id).toEqual(v11.id);
    expect(v1.parent).toEqual(undefined);
    expect(v1.depth).toEqual(0);
    expect(v1.beginX).toEqual(450);
    expect(v1.beginY).toEqual(75);
    expect(v1.endX).toEqual(450);
    expect(v1.endY).toEqual(75);
    expect(v1.x).toEqual(450);
    expect(v1.y).toEqual(75);

    expect(v6.children.length).toEqual(2);
    expect(v6.children[0].id).toEqual(v8.id);
    expect(v6.children[1].id).toEqual(v4.id);
    expect(v6.parent.id).toEqual(v1.id);
    expect(v6.depth).toEqual(1);
    expect(v6.beginX).toEqual(450);
    expect(v6.beginY).toEqual(75);
    expect(v6.endX).toEqual(240);
    expect(v6.endY).toEqual(200);
    expect(v6.x).toEqual(345);
    expect(v6.y).toEqual(137.5);

    expect(v8.children.length).toEqual(3);
    expect(v8.children[0].id).toEqual(v2.id);
    expect(v8.children[1].id).toEqual(v12.id);
    expect(v8.children[2].id).toEqual(v13.id);
    expect(v8.parent.id).toEqual(v6.id);
    expect(v8.depth).toEqual(2);
    expect(v8.beginX).toEqual(450);
    expect(v8.beginY).toEqual(75);
    expect(v8.endX).toEqual(200);
    expect(v8.endY).toEqual(325);
    expect(v8.x).toEqual(325);
    expect(v8.y).toEqual(200);

    expect(v2.children.length).toEqual(0);
    expect(v2.parent.id).toEqual(v8.id);
    expect(v2.depth).toEqual(3);
    expect(v2.beginX).toEqual(450);
    expect(v2.beginY).toEqual(75);
    expect(v2.endX).toEqual(120);
    expect(v2.endY).toEqual(450);
    expect(v2.x).toEqual(285);
    expect(v2.y).toEqual(262.5);

    expect(v12.children.length).toEqual(0);
    expect(v12.parent.id).toEqual(v8.id);
    expect(v12.depth).toEqual(3);
    expect(v12.beginX).toEqual(450);
    expect(v12.beginY).toEqual(75);
    expect(v12.endX).toEqual(200);
    expect(v12.endY).toEqual(450);
    expect(v12.x).toEqual(325);
    expect(v12.y).toEqual(262.5);

    expect(v13.children.length).toEqual(0);
    expect(v13.parent.id).toEqual(v8.id);
    expect(v13.depth).toEqual(3);
    expect(v13.beginX).toEqual(450);
    expect(v13.beginY).toEqual(75);
    expect(v13.endX).toEqual(280);
    expect(v13.endY).toEqual(450);
    expect(v13.x).toEqual(365);
    expect(v13.y).toEqual(262.5);

    expect(v4.children.length).toEqual(0);
    expect(v4.parent.id).toEqual(v6.id);
    expect(v4.depth).toEqual(2);
    expect(v4.beginX).toEqual(450);
    expect(v4.beginY).toEqual(75);
    expect(v4.endX).toEqual(280);
    expect(v4.endY).toEqual(325);
    expect(v4.x).toEqual(365);
    expect(v4.y).toEqual(200);

    expect(v7.children.length).toEqual(1);
    expect(v7.children[0].id).toEqual(v5.id);
    expect(v7.parent.id).toEqual(v1.id);
    expect(v7.depth).toEqual(1);
    expect(v7.beginX).toEqual(450);
    expect(v7.beginY).toEqual(75);
    expect(v7.endX).toEqual(380);
    expect(v7.endY).toEqual(200);
    expect(v7.x).toEqual(415);
    expect(v7.y).toEqual(137.5);

    expect(v5.children.length).toEqual(0);
    expect(v5.parent.id).toEqual(v7.id);
    expect(v5.depth).toEqual(2);
    expect(v5.beginX).toEqual(450);
    expect(v5.beginY).toEqual(75);
    expect(v5.endX).toEqual(380);
    expect(v5.endY).toEqual(325);
    expect(v5.x).toEqual(415);
    expect(v5.y).toEqual(200);

    expect(v3.children.length).toEqual(1);
    expect(v3.children[0].id).toEqual(v9.id);
    expect(v3.parent.id).toEqual(v1.id);
    expect(v3.depth).toEqual(1);
    expect(v3.beginX).toEqual(450);
    expect(v3.beginY).toEqual(75);
    expect(v3.endX).toEqual(480);
    expect(v3.endY).toEqual(200);
    expect(v3.x).toEqual(465);
    expect(v3.y).toEqual(137.5);

    expect(v9.children.length).toEqual(0);
    expect(v9.parent.id).toEqual(v3.id);
    expect(v9.depth).toEqual(2);
    expect(v9.beginX).toEqual(450);
    expect(v9.beginY).toEqual(75);
    expect(v9.endX).toEqual(480);
    expect(v9.endY).toEqual(325);
    expect(v9.x).toEqual(465);
    expect(v9.y).toEqual(200);

    expect(v10.children.length).toEqual(0);
    expect(v10.parent.id).toEqual(v1.id);
    expect(v10.depth).toEqual(1);
    expect(v10.beginX).toEqual(450);
    expect(v10.beginY).toEqual(75);
    expect(v10.endX).toEqual(570);
    expect(v10.endY).toEqual(200);
    expect(v10.x).toEqual(510);
    expect(v10.y).toEqual(137.5);

    expect(v11.children.length).toEqual(3);
    expect(v11.children[0].id).toEqual(v17.id);
    expect(v11.children[1].id).toEqual(v18.id);
    expect(v11.children[2].id).toEqual(v19.id);
    expect(v11.parent.id).toEqual(v1.id);
    expect(v11.depth).toEqual(1);
    expect(v11.beginX).toEqual(450);
    expect(v11.beginY).toEqual(75);
    expect(v11.endX).toEqual(660);
    expect(v11.endY).toEqual(200);
    expect(v11.x).toEqual(555);
    expect(v11.y).toEqual(137.5);

    expect(v17.children.length).toEqual(0);
    expect(v17.parent.id).toEqual(v11.id);
    expect(v17.depth).toEqual(2);
    expect(v17.beginX).toEqual(450);
    expect(v17.beginY).toEqual(75);
    expect(v17.endX).toEqual(580);
    expect(v17.endY).toEqual(325);
    expect(v17.x).toEqual(515);
    expect(v17.y).toEqual(200);

    expect(v18.children.length).toEqual(0);
    expect(v18.parent.id).toEqual(v11.id);
    expect(v18.depth).toEqual(2);
    expect(v18.beginX).toEqual(450);
    expect(v18.beginY).toEqual(75);
    expect(v18.endX).toEqual(660);
    expect(v18.endY).toEqual(325);
    expect(v18.x).toEqual(555);
    expect(v18.y).toEqual(200);

    expect(v19.children.length).toEqual(5);
    expect(v19.children[0].id).toEqual(v14.id);
    expect(v19.children[1].id).toEqual(v15.id);
    expect(v19.children[2].id).toEqual(v16.id);
    expect(v19.children[3].id).toEqual(v20.id);
    expect(v19.children[4].id).toEqual(v21.id);
    expect(v19.parent.id).toEqual(v11.id);
    expect(v19.depth).toEqual(2);
    expect(v19.beginX).toEqual(450);
    expect(v19.beginY).toEqual(75);
    expect(v19.endX).toEqual(740);
    expect(v19.endY).toEqual(325);
    expect(v19.x).toEqual(595);
    expect(v19.y).toEqual(200);

    expect(v14.children.length).toEqual(0);
    expect(v14.parent.id).toEqual(v19.id);
    expect(v14.depth).toEqual(3);
    expect(v14.beginX).toEqual(450);
    expect(v14.beginY).toEqual(75);
    expect(v14.endX).toEqual(580);
    expect(v14.endY).toEqual(450);
    expect(v14.x).toEqual(515);
    expect(v14.y).toEqual(262.5);

    expect(v15.children.length).toEqual(0);
    expect(v15.parent.id).toEqual(v19.id);
    expect(v15.depth).toEqual(3);
    expect(v15.beginX).toEqual(450);
    expect(v15.beginY).toEqual(75);
    expect(v15.endX).toEqual(660);
    expect(v15.endY).toEqual(450);
    expect(v15.x).toEqual(555);
    expect(v15.y).toEqual(262.5);

    expect(v16.children.length).toEqual(0);
    expect(v16.parent.id).toEqual(v19.id);
    expect(v16.depth).toEqual(3);
    expect(v16.beginX).toEqual(450);
    expect(v16.beginY).toEqual(75);
    expect(v16.endX).toEqual(740);
    expect(v16.endY).toEqual(450);
    expect(v16.x).toEqual(595);
    expect(v16.y).toEqual(262.5);

    expect(v20.children.length).toEqual(0);
    expect(v20.parent.id).toEqual(v19.id);
    expect(v20.depth).toEqual(3);
    expect(v20.beginX).toEqual(450);
    expect(v20.beginY).toEqual(75);
    expect(v20.endX).toEqual(820);
    expect(v20.endY).toEqual(450);
    expect(v20.x).toEqual(635);
    expect(v20.y).toEqual(262.5);

    expect(v21.children.length).toEqual(0);
    expect(v21.parent.id).toEqual(v19.id);
    expect(v21.depth).toEqual(3);
    expect(v21.beginX).toEqual(450);
    expect(v21.beginY).toEqual(75);
    expect(v21.endX).toEqual(900);
    expect(v21.endY).toEqual(450);
    expect(v21.x).toEqual(675);
    expect(v21.y).toEqual(262.5);

    now = 1000;

    nodeLinkTreeLayout.step(vertices, null, 900, 680);

    expect(actualScale).toBeCloseTo(0.9167, 4);

    expect(v1.children.length).toEqual(5);
    expect(v1.children[0].id).toEqual(v6.id);
    expect(v1.children[1].id).toEqual(v7.id);
    expect(v1.children[2].id).toEqual(v3.id);
    expect(v1.children[3].id).toEqual(v10.id);
    expect(v1.children[4].id).toEqual(v11.id);
    expect(v1.parent).toEqual(undefined);
    expect(v1.depth).toEqual(0);
    expect(v1.beginX).toEqual(450);
    expect(v1.beginY).toEqual(75);
    expect(v1.endX).toEqual(450);
    expect(v1.endY).toEqual(75);
    expect(v1.x).toEqual(450);
    expect(v1.y).toEqual(75);

    expect(v6.children.length).toEqual(2);
    expect(v6.children[0].id).toEqual(v8.id);
    expect(v6.children[1].id).toEqual(v4.id);
    expect(v6.parent.id).toEqual(v1.id);
    expect(v6.depth).toEqual(1);
    expect(v6.beginX).toEqual(450);
    expect(v6.beginY).toEqual(75);
    expect(v6.endX).toEqual(240);
    expect(v6.endY).toEqual(200);
    expect(v6.x).toEqual(240);
    expect(v6.y).toEqual(200);

    expect(v8.children.length).toEqual(3);
    expect(v8.children[0].id).toEqual(v2.id);
    expect(v8.children[1].id).toEqual(v12.id);
    expect(v8.children[2].id).toEqual(v13.id);
    expect(v8.parent.id).toEqual(v6.id);
    expect(v8.depth).toEqual(2);
    expect(v8.beginX).toEqual(450);
    expect(v8.beginY).toEqual(75);
    expect(v8.endX).toEqual(200);
    expect(v8.endY).toEqual(325);
    expect(v8.x).toEqual(200);
    expect(v8.y).toEqual(325);

    expect(v2.children.length).toEqual(0);
    expect(v2.parent.id).toEqual(v8.id);
    expect(v2.depth).toEqual(3);
    expect(v2.beginX).toEqual(450);
    expect(v2.beginY).toEqual(75);
    expect(v2.endX).toEqual(120);
    expect(v2.endY).toEqual(450);
    expect(v2.x).toEqual(120);
    expect(v2.y).toEqual(450);

    expect(v12.children.length).toEqual(0);
    expect(v12.parent.id).toEqual(v8.id);
    expect(v12.depth).toEqual(3);
    expect(v12.beginX).toEqual(450);
    expect(v12.beginY).toEqual(75);
    expect(v12.endX).toEqual(200);
    expect(v12.endY).toEqual(450);
    expect(v12.x).toEqual(200);
    expect(v12.y).toEqual(450);

    expect(v13.children.length).toEqual(0);
    expect(v13.parent.id).toEqual(v8.id);
    expect(v13.depth).toEqual(3);
    expect(v13.beginX).toEqual(450);
    expect(v13.beginY).toEqual(75);
    expect(v13.endX).toEqual(280);
    expect(v13.endY).toEqual(450);
    expect(v13.x).toEqual(280);
    expect(v13.y).toEqual(450);

    expect(v4.children.length).toEqual(0);
    expect(v4.parent.id).toEqual(v6.id);
    expect(v4.depth).toEqual(2);
    expect(v4.beginX).toEqual(450);
    expect(v4.beginY).toEqual(75);
    expect(v4.endX).toEqual(280);
    expect(v4.endY).toEqual(325);
    expect(v4.x).toEqual(280);
    expect(v4.y).toEqual(325);

    expect(v7.children.length).toEqual(1);
    expect(v7.children[0].id).toEqual(v5.id);
    expect(v7.parent.id).toEqual(v1.id);
    expect(v7.depth).toEqual(1);
    expect(v7.beginX).toEqual(450);
    expect(v7.beginY).toEqual(75);
    expect(v7.endX).toEqual(380);
    expect(v7.endY).toEqual(200);
    expect(v7.x).toEqual(380);
    expect(v7.y).toEqual(200);

    expect(v5.children.length).toEqual(0);
    expect(v5.parent.id).toEqual(v7.id);
    expect(v5.depth).toEqual(2);
    expect(v5.beginX).toEqual(450);
    expect(v5.beginY).toEqual(75);
    expect(v5.endX).toEqual(380);
    expect(v5.endY).toEqual(325);
    expect(v5.x).toEqual(380);
    expect(v5.y).toEqual(325);

    expect(v3.children.length).toEqual(1);
    expect(v3.children[0].id).toEqual(v9.id);
    expect(v3.parent.id).toEqual(v1.id);
    expect(v3.depth).toEqual(1);
    expect(v3.beginX).toEqual(450);
    expect(v3.beginY).toEqual(75);
    expect(v3.endX).toEqual(480);
    expect(v3.endY).toEqual(200);
    expect(v3.x).toEqual(480);
    expect(v3.y).toEqual(200);

    expect(v9.children.length).toEqual(0);
    expect(v9.parent.id).toEqual(v3.id);
    expect(v9.depth).toEqual(2);
    expect(v9.beginX).toEqual(450);
    expect(v9.beginY).toEqual(75);
    expect(v9.endX).toEqual(480);
    expect(v9.endY).toEqual(325);
    expect(v9.x).toEqual(480);
    expect(v9.y).toEqual(325);

    expect(v10.children.length).toEqual(0);
    expect(v10.parent.id).toEqual(v1.id);
    expect(v10.depth).toEqual(1);
    expect(v10.beginX).toEqual(450);
    expect(v10.beginY).toEqual(75);
    expect(v10.endX).toEqual(570);
    expect(v10.endY).toEqual(200);
    expect(v10.x).toEqual(570);
    expect(v10.y).toEqual(200);

    expect(v11.children.length).toEqual(3);
    expect(v11.children[0].id).toEqual(v17.id);
    expect(v11.children[1].id).toEqual(v18.id);
    expect(v11.children[2].id).toEqual(v19.id);
    expect(v11.parent.id).toEqual(v1.id);
    expect(v11.depth).toEqual(1);
    expect(v11.beginX).toEqual(450);
    expect(v11.beginY).toEqual(75);
    expect(v11.endX).toEqual(660);
    expect(v11.endY).toEqual(200);
    expect(v11.x).toEqual(660);
    expect(v11.y).toEqual(200);

    expect(v17.children.length).toEqual(0);
    expect(v17.parent.id).toEqual(v11.id);
    expect(v17.depth).toEqual(2);
    expect(v17.beginX).toEqual(450);
    expect(v17.beginY).toEqual(75);
    expect(v17.endX).toEqual(580);
    expect(v17.endY).toEqual(325);
    expect(v17.x).toEqual(580);
    expect(v17.y).toEqual(325);

    expect(v18.children.length).toEqual(0);
    expect(v18.parent.id).toEqual(v11.id);
    expect(v18.depth).toEqual(2);
    expect(v18.beginX).toEqual(450);
    expect(v18.beginY).toEqual(75);
    expect(v18.endX).toEqual(660);
    expect(v18.endY).toEqual(325);
    expect(v18.x).toEqual(660);
    expect(v18.y).toEqual(325);

    expect(v19.children.length).toEqual(5);
    expect(v19.children[0].id).toEqual(v14.id);
    expect(v19.children[1].id).toEqual(v15.id);
    expect(v19.children[2].id).toEqual(v16.id);
    expect(v19.children[3].id).toEqual(v20.id);
    expect(v19.children[4].id).toEqual(v21.id);
    expect(v19.parent.id).toEqual(v11.id);
    expect(v19.depth).toEqual(2);
    expect(v19.beginX).toEqual(450);
    expect(v19.beginY).toEqual(75);
    expect(v19.endX).toEqual(740);
    expect(v19.endY).toEqual(325);
    expect(v19.x).toEqual(740);
    expect(v19.y).toEqual(325);

    expect(v14.children.length).toEqual(0);
    expect(v14.parent.id).toEqual(v19.id);
    expect(v14.depth).toEqual(3);
    expect(v14.beginX).toEqual(450);
    expect(v14.beginY).toEqual(75);
    expect(v14.endX).toEqual(580);
    expect(v14.endY).toEqual(450);
    expect(v14.x).toEqual(580);
    expect(v14.y).toEqual(450);

    expect(v15.children.length).toEqual(0);
    expect(v15.parent.id).toEqual(v19.id);
    expect(v15.depth).toEqual(3);
    expect(v15.beginX).toEqual(450);
    expect(v15.beginY).toEqual(75);
    expect(v15.endX).toEqual(660);
    expect(v15.endY).toEqual(450);
    expect(v15.x).toEqual(660);
    expect(v15.y).toEqual(450);

    expect(v16.children.length).toEqual(0);
    expect(v16.parent.id).toEqual(v19.id);
    expect(v16.depth).toEqual(3);
    expect(v16.beginX).toEqual(450);
    expect(v16.beginY).toEqual(75);
    expect(v16.endX).toEqual(740);
    expect(v16.endY).toEqual(450);
    expect(v16.x).toEqual(740);
    expect(v16.y).toEqual(450);

    expect(v20.children.length).toEqual(0);
    expect(v20.parent.id).toEqual(v19.id);
    expect(v20.depth).toEqual(3);
    expect(v20.beginX).toEqual(450);
    expect(v20.beginY).toEqual(75);
    expect(v20.endX).toEqual(820);
    expect(v20.endY).toEqual(450);
    expect(v20.x).toEqual(820);
    expect(v20.y).toEqual(450);

    expect(v21.children.length).toEqual(0);
    expect(v21.parent.id).toEqual(v19.id);
    expect(v21.depth).toEqual(3);
    expect(v21.beginX).toEqual(450);
    expect(v21.beginY).toEqual(75);
    expect(v21.endX).toEqual(900);
    expect(v21.endY).toEqual(450);
    expect(v21.x).toEqual(900);
    expect(v21.y).toEqual(450);

    now = 2000;

    nodeLinkTreeLayout.step(vertices, null, 900, 680);

    expect(actualScale).toBeCloseTo(0.9167, 4);

    expect(v1.children.length).toEqual(5);
    expect(v1.children[0].id).toEqual(v6.id);
    expect(v1.children[1].id).toEqual(v7.id);
    expect(v1.children[2].id).toEqual(v3.id);
    expect(v1.children[3].id).toEqual(v10.id);
    expect(v1.children[4].id).toEqual(v11.id);
    expect(v1.parent).toEqual(undefined);
    expect(v1.depth).toEqual(0);
    expect(v1.beginX).toEqual(450);
    expect(v1.beginY).toEqual(75);
    expect(v1.endX).toEqual(450);
    expect(v1.endY).toEqual(75);
    expect(v1.x).toEqual(450);
    expect(v1.y).toEqual(75);

    expect(v6.children.length).toEqual(2);
    expect(v6.children[0].id).toEqual(v8.id);
    expect(v6.children[1].id).toEqual(v4.id);
    expect(v6.parent.id).toEqual(v1.id);
    expect(v6.depth).toEqual(1);
    expect(v6.beginX).toEqual(450);
    expect(v6.beginY).toEqual(75);
    expect(v6.endX).toEqual(240);
    expect(v6.endY).toEqual(200);
    expect(v6.x).toEqual(240);
    expect(v6.y).toEqual(200);

    expect(v8.children.length).toEqual(3);
    expect(v8.children[0].id).toEqual(v2.id);
    expect(v8.children[1].id).toEqual(v12.id);
    expect(v8.children[2].id).toEqual(v13.id);
    expect(v8.parent.id).toEqual(v6.id);
    expect(v8.depth).toEqual(2);
    expect(v8.beginX).toEqual(450);
    expect(v8.beginY).toEqual(75);
    expect(v8.endX).toEqual(200);
    expect(v8.endY).toEqual(325);
    expect(v8.x).toEqual(200);
    expect(v8.y).toEqual(325);

    expect(v2.children.length).toEqual(0);
    expect(v2.parent.id).toEqual(v8.id);
    expect(v2.depth).toEqual(3);
    expect(v2.beginX).toEqual(450);
    expect(v2.beginY).toEqual(75);
    expect(v2.endX).toEqual(120);
    expect(v2.endY).toEqual(450);
    expect(v2.x).toEqual(120);
    expect(v2.y).toEqual(450);

    expect(v12.children.length).toEqual(0);
    expect(v12.parent.id).toEqual(v8.id);
    expect(v12.depth).toEqual(3);
    expect(v12.beginX).toEqual(450);
    expect(v12.beginY).toEqual(75);
    expect(v12.endX).toEqual(200);
    expect(v12.endY).toEqual(450);
    expect(v12.x).toEqual(200);
    expect(v12.y).toEqual(450);

    expect(v13.children.length).toEqual(0);
    expect(v13.parent.id).toEqual(v8.id);
    expect(v13.depth).toEqual(3);
    expect(v13.beginX).toEqual(450);
    expect(v13.beginY).toEqual(75);
    expect(v13.endX).toEqual(280);
    expect(v13.endY).toEqual(450);
    expect(v13.x).toEqual(280);
    expect(v13.y).toEqual(450);

    expect(v4.children.length).toEqual(0);
    expect(v4.parent.id).toEqual(v6.id);
    expect(v4.depth).toEqual(2);
    expect(v4.beginX).toEqual(450);
    expect(v4.beginY).toEqual(75);
    expect(v4.endX).toEqual(280);
    expect(v4.endY).toEqual(325);
    expect(v4.x).toEqual(280);
    expect(v4.y).toEqual(325);

    expect(v7.children.length).toEqual(1);
    expect(v7.children[0].id).toEqual(v5.id);
    expect(v7.parent.id).toEqual(v1.id);
    expect(v7.depth).toEqual(1);
    expect(v7.beginX).toEqual(450);
    expect(v7.beginY).toEqual(75);
    expect(v7.endX).toEqual(380);
    expect(v7.endY).toEqual(200);
    expect(v7.x).toEqual(380);
    expect(v7.y).toEqual(200);

    expect(v5.children.length).toEqual(0);
    expect(v5.parent.id).toEqual(v7.id);
    expect(v5.depth).toEqual(2);
    expect(v5.beginX).toEqual(450);
    expect(v5.beginY).toEqual(75);
    expect(v5.endX).toEqual(380);
    expect(v5.endY).toEqual(325);
    expect(v5.x).toEqual(380);
    expect(v5.y).toEqual(325);

    expect(v3.children.length).toEqual(1);
    expect(v3.children[0].id).toEqual(v9.id);
    expect(v3.parent.id).toEqual(v1.id);
    expect(v3.depth).toEqual(1);
    expect(v3.beginX).toEqual(450);
    expect(v3.beginY).toEqual(75);
    expect(v3.endX).toEqual(480);
    expect(v3.endY).toEqual(200);
    expect(v3.x).toEqual(480);
    expect(v3.y).toEqual(200);

    expect(v9.children.length).toEqual(0);
    expect(v9.parent.id).toEqual(v3.id);
    expect(v9.depth).toEqual(2);
    expect(v9.beginX).toEqual(450);
    expect(v9.beginY).toEqual(75);
    expect(v9.endX).toEqual(480);
    expect(v9.endY).toEqual(325);
    expect(v9.x).toEqual(480);
    expect(v9.y).toEqual(325);

    expect(v10.children.length).toEqual(0);
    expect(v10.parent.id).toEqual(v1.id);
    expect(v10.depth).toEqual(1);
    expect(v10.beginX).toEqual(450);
    expect(v10.beginY).toEqual(75);
    expect(v10.endX).toEqual(570);
    expect(v10.endY).toEqual(200);
    expect(v10.x).toEqual(570);
    expect(v10.y).toEqual(200);

    expect(v11.children.length).toEqual(3);
    expect(v11.children[0].id).toEqual(v17.id);
    expect(v11.children[1].id).toEqual(v18.id);
    expect(v11.children[2].id).toEqual(v19.id);
    expect(v11.parent.id).toEqual(v1.id);
    expect(v11.depth).toEqual(1);
    expect(v11.beginX).toEqual(450);
    expect(v11.beginY).toEqual(75);
    expect(v11.endX).toEqual(660);
    expect(v11.endY).toEqual(200);
    expect(v11.x).toEqual(660);
    expect(v11.y).toEqual(200);

    expect(v17.children.length).toEqual(0);
    expect(v17.parent.id).toEqual(v11.id);
    expect(v17.depth).toEqual(2);
    expect(v17.beginX).toEqual(450);
    expect(v17.beginY).toEqual(75);
    expect(v17.endX).toEqual(580);
    expect(v17.endY).toEqual(325);
    expect(v17.x).toEqual(580);
    expect(v17.y).toEqual(325);

    expect(v18.children.length).toEqual(0);
    expect(v18.parent.id).toEqual(v11.id);
    expect(v18.depth).toEqual(2);
    expect(v18.beginX).toEqual(450);
    expect(v18.beginY).toEqual(75);
    expect(v18.endX).toEqual(660);
    expect(v18.endY).toEqual(325);
    expect(v18.x).toEqual(660);
    expect(v18.y).toEqual(325);

    expect(v19.children.length).toEqual(5);
    expect(v19.children[0].id).toEqual(v14.id);
    expect(v19.children[1].id).toEqual(v15.id);
    expect(v19.children[2].id).toEqual(v16.id);
    expect(v19.children[3].id).toEqual(v20.id);
    expect(v19.children[4].id).toEqual(v21.id);
    expect(v19.parent.id).toEqual(v11.id);
    expect(v19.depth).toEqual(2);
    expect(v19.beginX).toEqual(450);
    expect(v19.beginY).toEqual(75);
    expect(v19.endX).toEqual(740);
    expect(v19.endY).toEqual(325);
    expect(v19.x).toEqual(740);
    expect(v19.y).toEqual(325);

    expect(v14.children.length).toEqual(0);
    expect(v14.parent.id).toEqual(v19.id);
    expect(v14.depth).toEqual(3);
    expect(v14.beginX).toEqual(450);
    expect(v14.beginY).toEqual(75);
    expect(v14.endX).toEqual(580);
    expect(v14.endY).toEqual(450);
    expect(v14.x).toEqual(580);
    expect(v14.y).toEqual(450);

    expect(v15.children.length).toEqual(0);
    expect(v15.parent.id).toEqual(v19.id);
    expect(v15.depth).toEqual(3);
    expect(v15.beginX).toEqual(450);
    expect(v15.beginY).toEqual(75);
    expect(v15.endX).toEqual(660);
    expect(v15.endY).toEqual(450);
    expect(v15.x).toEqual(660);
    expect(v15.y).toEqual(450);

    expect(v16.children.length).toEqual(0);
    expect(v16.parent.id).toEqual(v19.id);
    expect(v16.depth).toEqual(3);
    expect(v16.beginX).toEqual(450);
    expect(v16.beginY).toEqual(75);
    expect(v16.endX).toEqual(740);
    expect(v16.endY).toEqual(450);
    expect(v16.x).toEqual(740);
    expect(v16.y).toEqual(450);

    expect(v20.children.length).toEqual(0);
    expect(v20.parent.id).toEqual(v19.id);
    expect(v20.depth).toEqual(3);
    expect(v20.beginX).toEqual(450);
    expect(v20.beginY).toEqual(75);
    expect(v20.endX).toEqual(820);
    expect(v20.endY).toEqual(450);
    expect(v20.x).toEqual(820);
    expect(v20.y).toEqual(450);

    expect(v21.children.length).toEqual(0);
    expect(v21.parent.id).toEqual(v19.id);
    expect(v21.depth).toEqual(3);
    expect(v21.beginX).toEqual(450);
    expect(v21.beginY).toEqual(75);
    expect(v21.endX).toEqual(900);
    expect(v21.endY).toEqual(450);
    expect(v21.x).toEqual(900);
    expect(v21.y).toEqual(450);
  });

  it('should calculate location of elements in 3 trees', function () {
    var graph = new Graph();

    var v1 = graph.addVertex();
    var v2 = graph.addVertex();
    var v3 = graph.addVertex();

    var v4 = graph.addVertex();
    var v5 = graph.addVertex();
    var v6 = graph.addVertex();

    var v7 = graph.addVertex();
    var v8 = graph.addVertex();
    var v9 = graph.addVertex();

    graph.addEdge(null, v1, v2, 'knows');
    graph.addEdge(null, v1, v3, 'knows');

    graph.addEdge(null, v4, v5, 'knows');
    graph.addEdge(null, v4, v6, 'knows');

    graph.addEdge(null, v7, v8, 'knows');
    graph.addEdge(null, v7, v9, 'knows');

    v1 = {id: v1.id, vertex: v1};
    v2 = {id: v2.id, vertex: v2};
    v3 = {id: v3.id, vertex: v3};
    v4 = {id: v4.id, vertex: v4};
    v5 = {id: v5.id, vertex: v5};
    v6 = {id: v6.id, vertex: v6};
    v7 = {id: v7.id, vertex: v7};
    v8 = {id: v8.id, vertex: v8};
    v9 = {id: v9.id, vertex: v9};

    var vertices = [v1, v2, v3, v4, v5, v6, v7, v8, v9];

    nodeLinkTreeLayout.step(vertices, null, 900, 680);

    expect(actualScale).toBeCloseTo(0.8643, 4);

    expect(v1.children.length).toEqual(2);
    expect(v1.children[0].id).toEqual(v2.id);
    expect(v1.children[1].id).toEqual(v3.id);
    expect(v1.parent).toEqual(undefined);
    expect(v1.depth).toEqual(0);
    expect(v1.beginX).toEqual(450);
    expect(v1.beginY).toEqual(575);
    expect(v1.endX).toEqual(450);
    expect(v1.endY).toEqual(75);
    expect(v1.x).toEqual(450);
    expect(v1.y).toEqual(575);

    expect(v2.children.length).toEqual(0);
    expect(v2.parent.id).toEqual(v1.id);
    expect(v2.depth).toEqual(1);
    expect(v2.beginX).toEqual(450);
    expect(v2.beginY).toEqual(575);
    expect(v2.endX).toEqual(410);
    expect(v2.endY).toEqual(200);
    expect(v2.x).toEqual(450);
    expect(v2.y).toEqual(575);

    expect(v3.children.length).toEqual(0);
    expect(v3.parent.id).toEqual(v1.id);
    expect(v3.depth).toEqual(1);
    expect(v3.beginX).toEqual(450);
    expect(v3.beginY).toEqual(575);
    expect(v3.endX).toEqual(490);
    expect(v3.endY).toEqual(200);
    expect(v3.x).toEqual(450);
    expect(v3.y).toEqual(575);

    expect(v4.children.length).toEqual(2);
    expect(v4.children[0].id).toEqual(v5.id);
    expect(v4.children[1].id).toEqual(v6.id);
    expect(v4.parent).toEqual(undefined);
    expect(v4.depth).toEqual(2);
    expect(v4.beginX).toEqual(450);
    expect(v4.beginY).toEqual(575);
    expect(v4.endX).toEqual(450);
    expect(v4.endY).toEqual(325);
    expect(v4.x).toEqual(450);
    expect(v4.y).toEqual(575);

    expect(v5.children.length).toEqual(0);
    expect(v5.parent.id).toEqual(v4.id);
    expect(v5.depth).toEqual(3);
    expect(v5.beginX).toEqual(450);
    expect(v5.beginY).toEqual(575);
    expect(v5.endX).toEqual(410);
    expect(v5.endY).toEqual(450);
    expect(v5.x).toEqual(450);
    expect(v5.y).toEqual(575);

    expect(v6.children.length).toEqual(0);
    expect(v6.parent.id).toEqual(v4.id);
    expect(v6.depth).toEqual(3);
    expect(v6.beginX).toEqual(450);
    expect(v6.beginY).toEqual(575);
    expect(v6.endX).toEqual(490);
    expect(v6.endY).toEqual(450);
    expect(v6.x).toEqual(450);
    expect(v6.y).toEqual(575);

    expect(v7.children.length).toEqual(2);
    expect(v7.children[0].id).toEqual(v8.id);
    expect(v7.children[1].id).toEqual(v9.id);
    expect(v7.parent).toEqual(undefined);
    expect(v7.depth).toEqual(4);
    expect(v7.beginX).toEqual(450);
    expect(v7.beginY).toEqual(575);
    expect(v7.endX).toEqual(450);
    expect(v7.endY).toEqual(575);
    expect(v7.x).toEqual(450);
    expect(v7.y).toEqual(575);

    expect(v8.children.length).toEqual(0);
    expect(v8.parent.id).toEqual(v7.id);
    expect(v8.depth).toEqual(5);
    expect(v8.beginX).toEqual(450);
    expect(v8.beginY).toEqual(575);
    expect(v8.endX).toEqual(410);
    expect(v8.endY).toEqual(700);
    expect(v8.x).toEqual(450);
    expect(v8.y).toEqual(575);

    expect(v9.children.length).toEqual(0);
    expect(v9.parent.id).toEqual(v7.id);
    expect(v9.depth).toEqual(5);
    expect(v9.beginX).toEqual(450);
    expect(v9.beginY).toEqual(575);
    expect(v9.endX).toEqual(490);
    expect(v9.endY).toEqual(700);
    expect(v9.x).toEqual(450);
    expect(v9.y).toEqual(575);

    now = 500;

    nodeLinkTreeLayout.step(vertices, null, 900, 680);

    expect(actualScale).toBeCloseTo(0.8643, 4);

    expect(v1.children.length).toEqual(2);
    expect(v1.children[0].id).toEqual(v2.id);
    expect(v1.children[1].id).toEqual(v3.id);
    expect(v1.parent).toEqual(undefined);
    expect(v1.depth).toEqual(0);
    expect(v1.beginX).toEqual(450);
    expect(v1.beginY).toEqual(575);
    expect(v1.endX).toEqual(450);
    expect(v1.endY).toEqual(75);
    expect(v1.x).toEqual(450);
    expect(v1.y).toEqual(325);

    expect(v2.children.length).toEqual(0);
    expect(v2.parent.id).toEqual(v1.id);
    expect(v2.depth).toEqual(1);
    expect(v2.beginX).toEqual(450);
    expect(v2.beginY).toEqual(575);
    expect(v2.endX).toEqual(410);
    expect(v2.endY).toEqual(200);
    expect(v2.x).toEqual(430);
    expect(v2.y).toEqual(387.5);

    expect(v3.children.length).toEqual(0);
    expect(v3.parent.id).toEqual(v1.id);
    expect(v3.depth).toEqual(1);
    expect(v3.beginX).toEqual(450);
    expect(v3.beginY).toEqual(575);
    expect(v3.endX).toEqual(490);
    expect(v3.endY).toEqual(200);
    expect(v3.x).toEqual(470);
    expect(v3.y).toEqual(387.5);

    expect(v4.children.length).toEqual(2);
    expect(v4.children[0].id).toEqual(v5.id);
    expect(v4.children[1].id).toEqual(v6.id);
    expect(v4.parent).toEqual(undefined);
    expect(v4.depth).toEqual(2);
    expect(v4.beginX).toEqual(450);
    expect(v4.beginY).toEqual(575);
    expect(v4.endX).toEqual(450);
    expect(v4.endY).toEqual(325);
    expect(v4.x).toEqual(450);
    expect(v4.y).toEqual(450);

    expect(v5.children.length).toEqual(0);
    expect(v5.parent.id).toEqual(v4.id);
    expect(v5.depth).toEqual(3);
    expect(v5.beginX).toEqual(450);
    expect(v5.beginY).toEqual(575);
    expect(v5.endX).toEqual(410);
    expect(v5.endY).toEqual(450);
    expect(v5.x).toEqual(430);
    expect(v5.y).toEqual(512.5);

    expect(v6.children.length).toEqual(0);
    expect(v6.parent.id).toEqual(v4.id);
    expect(v6.depth).toEqual(3);
    expect(v6.beginX).toEqual(450);
    expect(v6.beginY).toEqual(575);
    expect(v6.endX).toEqual(490);
    expect(v6.endY).toEqual(450);
    expect(v6.x).toEqual(470);
    expect(v6.y).toEqual(512.5);

    expect(v7.children.length).toEqual(2);
    expect(v7.children[0].id).toEqual(v8.id);
    expect(v7.children[1].id).toEqual(v9.id);
    expect(v7.parent).toEqual(undefined);
    expect(v7.depth).toEqual(4);
    expect(v7.beginX).toEqual(450);
    expect(v7.beginY).toEqual(575);
    expect(v7.endX).toEqual(450);
    expect(v7.endY).toEqual(575);
    expect(v7.x).toEqual(450);
    expect(v7.y).toEqual(575);

    expect(v8.children.length).toEqual(0);
    expect(v8.parent.id).toEqual(v7.id);
    expect(v8.depth).toEqual(5);
    expect(v8.beginX).toEqual(450);
    expect(v8.beginY).toEqual(575);
    expect(v8.endX).toEqual(410);
    expect(v8.endY).toEqual(700);
    expect(v8.x).toEqual(430);
    expect(v8.y).toEqual(637.5);

    expect(v9.children.length).toEqual(0);
    expect(v9.parent.id).toEqual(v7.id);
    expect(v9.depth).toEqual(5);
    expect(v9.beginX).toEqual(450);
    expect(v9.beginY).toEqual(575);
    expect(v9.endX).toEqual(490);
    expect(v9.endY).toEqual(700);
    expect(v9.x).toEqual(470);
    expect(v9.y).toEqual(637.5);

    now = 1000;

    nodeLinkTreeLayout.step(vertices, null, 900, 680);

    expect(actualScale).toBeCloseTo(0.8643, 4);

    expect(v1.children.length).toEqual(2);
    expect(v1.children[0].id).toEqual(v2.id);
    expect(v1.children[1].id).toEqual(v3.id);
    expect(v1.parent).toEqual(undefined);
    expect(v1.depth).toEqual(0);
    expect(v1.beginX).toEqual(450);
    expect(v1.beginY).toEqual(575);
    expect(v1.endX).toEqual(450);
    expect(v1.endY).toEqual(75);
    expect(v1.x).toEqual(450);
    expect(v1.y).toEqual(75);

    expect(v2.children.length).toEqual(0);
    expect(v2.parent.id).toEqual(v1.id);
    expect(v2.depth).toEqual(1);
    expect(v2.beginX).toEqual(450);
    expect(v2.beginY).toEqual(575);
    expect(v2.endX).toEqual(410);
    expect(v2.endY).toEqual(200);
    expect(v2.x).toEqual(410);
    expect(v2.y).toEqual(200);

    expect(v3.children.length).toEqual(0);
    expect(v3.parent.id).toEqual(v1.id);
    expect(v3.depth).toEqual(1);
    expect(v3.beginX).toEqual(450);
    expect(v3.beginY).toEqual(575);
    expect(v3.endX).toEqual(490);
    expect(v3.endY).toEqual(200);
    expect(v3.x).toEqual(490);
    expect(v3.y).toEqual(200);

    expect(v4.children.length).toEqual(2);
    expect(v4.children[0].id).toEqual(v5.id);
    expect(v4.children[1].id).toEqual(v6.id);
    expect(v4.parent).toEqual(undefined);
    expect(v4.depth).toEqual(2);
    expect(v4.beginX).toEqual(450);
    expect(v4.beginY).toEqual(575);
    expect(v4.endX).toEqual(450);
    expect(v4.endY).toEqual(325);
    expect(v4.x).toEqual(450);
    expect(v4.y).toEqual(325);

    expect(v5.children.length).toEqual(0);
    expect(v5.parent.id).toEqual(v4.id);
    expect(v5.depth).toEqual(3);
    expect(v5.beginX).toEqual(450);
    expect(v5.beginY).toEqual(575);
    expect(v5.endX).toEqual(410);
    expect(v5.endY).toEqual(450);
    expect(v5.x).toEqual(410);
    expect(v5.y).toEqual(450);

    expect(v6.children.length).toEqual(0);
    expect(v6.parent.id).toEqual(v4.id);
    expect(v6.depth).toEqual(3);
    expect(v6.beginX).toEqual(450);
    expect(v6.beginY).toEqual(575);
    expect(v6.endX).toEqual(490);
    expect(v6.endY).toEqual(450);
    expect(v6.x).toEqual(490);
    expect(v6.y).toEqual(450);

    expect(v7.children.length).toEqual(2);
    expect(v7.children[0].id).toEqual(v8.id);
    expect(v7.children[1].id).toEqual(v9.id);
    expect(v7.parent).toEqual(undefined);
    expect(v7.depth).toEqual(4);
    expect(v7.beginX).toEqual(450);
    expect(v7.beginY).toEqual(575);
    expect(v7.endX).toEqual(450);
    expect(v7.endY).toEqual(575);
    expect(v7.x).toEqual(450);
    expect(v7.y).toEqual(575);

    expect(v8.children.length).toEqual(0);
    expect(v8.parent.id).toEqual(v7.id);
    expect(v8.depth).toEqual(5);
    expect(v8.beginX).toEqual(450);
    expect(v8.beginY).toEqual(575);
    expect(v8.endX).toEqual(410);
    expect(v8.endY).toEqual(700);
    expect(v8.x).toEqual(410);
    expect(v8.y).toEqual(700);

    expect(v9.children.length).toEqual(0);
    expect(v9.parent.id).toEqual(v7.id);
    expect(v9.depth).toEqual(5);
    expect(v9.beginX).toEqual(450);
    expect(v9.beginY).toEqual(575);
    expect(v9.endX).toEqual(490);
    expect(v9.endY).toEqual(700);
    expect(v9.x).toEqual(490);
    expect(v9.y).toEqual(700);
  });

});
