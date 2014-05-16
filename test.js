var assert      = require('assert');
var should      = require('should');
var req         = require('supertest');
var mongoose    = require('mongoose');

var config = require('../config');

describe('API', function () {
    var uri = 'http://localhost:3000';

    before(function () {
        mongoose.connect(config.mongo.conn_string);
        
        entry_a = {
            thread_id: 999999999,
            plaintiff_id: 999999999,
            defendant_id: 999999999,
            status: 'open'
        };
        
        done();
    });

    describe('Scammer', function () {
        it('should not accept new record if thread ID found in database', function (d) {
            entry_a.thread_id = 4230107; // This is in my test database

            req(uri).post('/scammers')
                .send(entry_a)
                .end(function (err, res) {
                    if (err)
                        throw err;

                    res.should.have.status(400);
                    done();
                });
        });
    })
})