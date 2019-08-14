const assert = require('chai').assert;
const should = require('should');
const request = require('request');
const expect = require('chai').expect;
describe('/posts ', function() {
    it('should get all the posts ', function(done) {
        request.get({ url: 'http://localhost:3000/posts/' },
            function(error, response, body) {
                expect(response.body).to.contain('_id');
                expect(response.body).to.contain('channel');
                expect(response.body).to.contain('content');
                expect(response.body).to.contain('username');
                expect(response.body).to.contain('timestamp');
                done();
            });
    });
});