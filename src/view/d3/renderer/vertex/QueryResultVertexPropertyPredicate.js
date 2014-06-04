/* global QueryResultVertexPropertyPredicate: true */
var QueryResultVertexPropertyPredicate = (function () {

  function QueryResultVertexPropertyPredicate(queryGraph) {
    utils.checkExists('Query Graph', queryGraph);
    this.queryGraph = queryGraph;
  }

  utils.mixin(QueryResultVertexPropertyPredicate.prototype, {

    isVisible: function (vertex, propertyKey) {
      if (propertyKey === 'entityType') {
        return false;
      }
      return true;
    }

  });

  return QueryResultVertexPropertyPredicate;

}());