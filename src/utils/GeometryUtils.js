/* global GeometryUtils: true */

var GeometryUtils = {

  isLeftOf: function (pt1, pt2) {
    return pt1.x < pt2.x;
  },

  isRightOf: function (pt1, pt2) {
    return GeometryUtils.isLeftOf(pt1, pt2);
  },

  isAbove: function (pt1, pt2) {
    return pt1.y < pt2.y;
  },

  isBelow: function (pt1, pt2) {
    return !GeometryUtils.isAbove(pt1, pt2);
  },

  centerOf: function (rect) {
    return new Point(
      rect.x + rect.width / 2,
      rect.y + rect.height / 2
    );
  },

  gradient: function (pt1, pt2) {
    return (pt2.y - pt1.y) / (pt2.x - pt1.x);
  },

  aspectRatio: function (rect) {
    return rect.height / rect.width;
  },

  distanceOfPoints : function(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  },

  findIntersectionOnClosestSide : function(fromRect, toRect) {
    var centerA = GeometryUtils.centerOf(fromRect),
      centerB = GeometryUtils.centerOf(toRect),
    // calculate the gradient from rectA to rectB
      gradA2B = GeometryUtils.gradient(centerA, centerB),
    // grab the aspectRatio of rectA
    // as we want any dimensions to work with the script
      aspectA = GeometryUtils.aspectRatio(fromRect),

    // grab the half values, as they are used for the additional point
      h05 = fromRect.width / 2,
      w05 = fromRect.height / 2,

    // the norm is the normalized gradient honoring the aspect Ratio of rectA
      normA2B = Math.abs(gradA2B / aspectA),

    // the additional point
      add = new Point(
        // when the rectA is left of rectB we move right, else left
        (GeometryUtils.isLeftOf(centerA, centerB) ? 1 : -1) * h05,
        // when the rectA is below
        (GeometryUtils.isAbove(centerA, centerB)  ? 1 : -1) * w05
      );

    // norm values are absolute, thus we can compare whether they are
    // greater or less than 1
    if (normA2B < 1) {
      // when they are less then 1 multiply the y component with the norm
      add.y *= normA2B;
    } else {
      // otherwise divide the x component by the norm
      add.x /= normA2B;
    }
    // this way we will stay on the edge with at least one component of the result
    // while the other component is shifted towards the center

    return new Point(centerA.x + add.x, centerA.y + add.y);
  },

  findClosestMidpointToIntersection : function(intersection, pointOnElement, width, height) {
    var halfWidth = width / 2;
    var halfHeight = height / 2;

    if (pointOnElement.y - halfHeight === intersection.y) {
      return {
        point : new Point(pointOnElement.x, pointOnElement.y - halfHeight),
        horizontal : true
      };
    } else if (halfHeight + pointOnElement.y === intersection.y) {
      return {
        point : new Point(pointOnElement.x, pointOnElement.y + halfHeight),
        horizontal : true
      };
    } else if (pointOnElement.x - halfWidth  === intersection.x) {
      return {
        point : new Point(pointOnElement.x - halfWidth, pointOnElement.y),
        horizontal : false
      };
    } else if (halfWidth + pointOnElement.x === intersection.x) {
      return {
        point : new Point(pointOnElement.x + halfWidth, pointOnElement.y),
        horizontal : false
      };
    }
  }

};