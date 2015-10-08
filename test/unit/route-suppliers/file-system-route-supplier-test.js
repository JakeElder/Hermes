'use strict';

require('should');

const mock = require('mock-fs');
const FileSystemRouteSupplier = require('route-suppliers/file-system-route-supplier');
const Route = require('route');

describe('FileSystemRouteSupplier', () => {
  describe('#getRoutes', () => {
    it('should eventually return an array of routes from filePath', (done) => {
      mock({
        '/the/routes.json': `[{
          "name": "Test route",
          "methods": ["GET"],
          "pattern": "/test",
          "target": {
            "protocol": "http",
            "host": "example.com",
            "pathname": "/"
          }
        }]`
      });
      const context = { filePath: '/the/routes.json' };
      return FileSystemRouteSupplier.prototype.getRoutes.call(context).then((routes) => {
        routes.should.be.an.Array();
        routes.length.should.eql(1);
        routes[0].should.be.an.instanceof(Route);
        mock.restore();
      }).catch(done).fin(done);
    });
  });
});
