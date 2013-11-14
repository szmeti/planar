/* global HasFilter: true */
var HasFilter = (function () {

  function HasFilter(key, predicate, value) {
    utils.checkExists('Key', key);
    utils.checkExists('Predicate', predicate);
    utils.checkExists('Value', value);

    this.key = key;
    this.value = value;
    this.predicate = predicate;
  }

  utils.mixin(HasFilter.prototype, {

    matches: function (element) {
      return this.predicate.evaluate(element.getProperty(this.key), this.value);
    }

  });

  return HasFilter;

}());