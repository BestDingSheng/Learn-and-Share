const request = require('supertest');
const express = require('express');
 
const app = express();
 
app.get('/', function(req, res) {
    res.status(200).json({ data: 'tobi' });
  });

describe('接口测试', function() {
    it('我写的接口对不对', function(done) {
      request(app)
        .get('/')
        .expect(200)
        .end(function(err, res) {
            if(res.body.data=='tobi'){
                done()
            }
        });
    });
  });