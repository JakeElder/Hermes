'use strict';

const fs = require('fs');
const Q = require('q');
const stripComments = require('strip-json-comments');
const RouteSupplier = require('../route-supplier');
const Route = require('../route');

class FileSystemRouteSupplier extends RouteSupplier {
  constructor(options) {
    super(options);
    this.filePath = options.filePath;
  }

  getRoutes() {
    return Q.promise((resolve) => {
      fs.readFile(this.filePath, 'utf-8', (err, json) => {
        const routes = JSON.parse(stripComments(json));
        resolve(routes.map(route => new Route(route)));
      });
    });
  }
}

module.exports = FileSystemRouteSupplier;
