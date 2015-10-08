'use strict';

require('should');

const request = require('supertest');
const Hermes = require('hermes');
const SimpleRouteSupplier = require('route-suppliers/simple-route-supplier');

describe('/status', () => {
  let hermes;

  before(() => {
    hermes = new Hermes(new SimpleRouteSupplier({ routeData: [] }), 0);
  });

  it('should return 200', (done) => {
    request(hermes.app)
      .get('/status')
      .expect(200, done);
  });

  it('should return JSON', (done) => {
    request(hermes.app)
      .get('/status')
      .expect('Content-Type', /json/, done);
  });

  it('should return "up" as the status', (done) => {
    request(hermes.app)
      .get('/status')
      .end(function(req, res) {
        res.body.status.should.eql('up');
        done();
      });
  });
});
