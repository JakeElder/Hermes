'use strict';

const Q = require('q');
const RouteSupplier = require('../route-supplier');
const Route = require('../route');

class SimpleRouteSupplier extends RouteSupplier {
  constructor(options) {
    super(options);
    this.routeData = options.routeData;
  }

  getRoutes() {
    return Q.promise((resolve) => {
      resolve(this.routeData.map(data => new Route(data)));
    });
  }
}

module.exports = SimpleRouteSupplier;
