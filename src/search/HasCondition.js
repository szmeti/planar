/* global HasCondition: true */
var HasCondition = (function () {

  function HasCondition(key, predicate, value, disabledFilters) {
    utils.checkExists('Key', key);
    utils.checkExists('Predicate', predicate);

    this.key = key;
    this.predicate = predicate;
    this.value = value;
    this.disabledFilters = disabledFilters;
  }

  utils.mixin(HasCondition.prototype, {

    matches: function (element) {
      return this.predicate.evaluate(element.getProperty(this.key, this.disabledFilters), this.value);
    }

  });

  return HasCondition;

}());