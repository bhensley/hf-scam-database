var assert      = require('assert');
var should      = require('should');
var req         = require('supertest');

describe('API', function () {
    var uri = 'http://localhost:3000';

    before(function () {
        entry_a = {
            thread_id: 999999999,
            plaintiff_id: 999999999,
            defendant_id: 999999999,
            status: 'open'
        };
    });

    describe('Scammer', function () {
        it('should not accept new record if thread ID found in database', function (done) {
            entry_a.thread_id = 4230107;

            req(uri).post('/scammers')
                .send(entry_a)
                .end(function (err, res) {
                    if (err)
                        throw err;

                    res.should.have.status(400);
                    done();
                });
        });

        it('should not accept new record if thread ID not given', function (done) {
            entry_a.thread_id = undefined; // This is in my test database

            req(uri).post('/scammers')
                .send(entry_a)
                .end(function (err, res) {
                    if (err)
                        throw err;

                    res.should.have.status(400);
                    done();
                });
        });

        it('should not accept new record if plaintiff ID not given', function (done) {
            entry_a.plaintiff_id = undefined; // This is in my test database

            req(uri).post('/scammers')
                .send(entry_a)
                .end(function (err, res) {
                    if (err)
                        throw err;

                    res.should.have.status(400);
                    done();
                });
        });

        it('should not accept new record if defendant ID not given', function (done) {
            entry_a.defendant_id = undefined; // This is in my test database

            req(uri).post('/scammers')
                .send(entry_a)
                .end(function (err, res) {
                    if (err)
                        throw err;

                    res.should.have.status(400);
                    done();
                });
        });

        it('should not accept status of anything other than open, resolved and closed', function (done) {
            entry_a.status = 'notvalid';

            req(uri).post('/scammers')
                .send(entry_a)
                .end(function (err, res) {
                    if (err)
                        throw err;

                    res.should.have.status(400);
                    done();
                });
        });
    });
});