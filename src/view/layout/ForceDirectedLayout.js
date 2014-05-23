/* global ForceDirectedLayout: true */
var ForceDirectedLayout = (function () {

  function ForceDirectedLayout() {
  }

  utils.mixin(ForceDirectedLayout.prototype, {

    step: function (vertices, edges, width, height) {

      return true;
    }

  });

  return ForceDirectedLayout;

}());