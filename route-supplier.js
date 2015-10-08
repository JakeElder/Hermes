'use strict';

const exceptions = require('./exceptions');

class RouteSupplier {
  getRoutes() {
    throw new exceptions.NotImplementedException('Not implemented');
  }
}

module.exports = RouteSupplier;
