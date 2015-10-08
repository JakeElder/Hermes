'use strict';

require('should');

const request = require('supertest');
const Hermes = require('hermes');
const SimpleRouteSupplier = require('route-suppliers/simple-route-supplier');

describe('Unknown routes', () => {
  it('should return 404 ', (done) => {
    const hermes = new Hermes(new SimpleRouteSupplier({ routeData: [] }), 0);
    request(hermes.app)
      .get('/doesnt-exist')
      .expect(404, done);
  });
});
