import chai from 'chai';
import chaiHttp from 'chai-http'
import 'mocha';
import app from '../src/app';

const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp)

describe('GET /api/health', () => {
    it('should return status 200', done => {
        chai.request(app)
            .get('/api/health')
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
})


