'use strict';

require('should');

const SimpleRouteSupplier = require('route-suppliers/simple-route-supplier');
const Route = require('route');

describe('SimpleRouteSupplier', () => {
  describe('#getRoutes', () => {
    it('should return the array of routes provided to the constructor', (done) => {
      const context = {
        routeData: [{
          'name': 'Test route',
          'methods': ['GET'],
          'pattern': '/test',
          'target': {
            'protocol': 'http',
            'host': 'example.com',
            'pathname': '/'
          }
        }]
      };
      SimpleRouteSupplier.prototype.getRoutes.call(context).then((routes) => {
        routes.should.be.an.Array();
        routes.length.should.eql(1);
        routes[0].should.be.an.instanceof(Route);
      }).catch(done).fin(done);
    });
  });
});

