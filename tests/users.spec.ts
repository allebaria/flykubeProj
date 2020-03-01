import chai from 'chai';
import chaiHttp from 'chai-http'
import sinon from 'sinon';
import 'mocha';
import app from '../src/app';
import User from '../src/api/v1/models/user';
import Faker from 'faker';

const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp)

describe('USERS API', () => {
    describe('GET /api/v1/users', () => {
        context('when there are no results', () => {
            var findUsers;
            before(() => {
                findUsers =  sinon.stub(User, 'findAll');
                findUsers.returns(new Promise((resolve, reject) => {
                    resolve([]);
                  }));
            })
            after(() => {
                findUsers.restore()
            })
            it('returns status 404', done => {
                chai.request(app)
                    .get('/api/v1/users')
                    .end((err, res) => {
                        res.should.have.status(404)
                        done()
                    })
            })
        })
        context('when there are results', () => {
            var findUsers;
            before(() => {
                findUsers =  sinon.stub(User, 'findAll');
                findUsers.returns(new Promise((resolve, reject) => {
                    var user1 = new User({
                        id: 1,
                        name: Faker.name.firstName(), 
                        email: Faker.internet.email(),
                        gender: 'male',
                        age: Faker.random.number()
                    })
                    var user2 = new User({
                        id: 2,
                        name: Faker.name.firstName(), 
                        email: Faker.internet.email(),
                        gender: 'female',
                        age: Faker.random.number()
                    })
                    resolve([user1, user2]);
                  }));
            })
            after(() => {
                findUsers.restore()
            })
            it('returns status 200 and return users', done => {
                chai.request(app)
                .get('/api/v1/users')
                .end((err, res) => {
                    res.should.have.status(200)
                    expect(res.body.length).to.be.greaterThan(0)
                    done()
                })
            })
        })
    })
    
    describe('GET /api/V1/users/:id', () => {
        context('when id param is not valid', () => {
            it('returns status code 422', done => {
                chai.request(app)
                    .get('/api/v1/users/abc')
                    .end((err, res) => {
                        res.should.have.status(422)
                        done()
                    })
            })
        })

        context('when id param is valid', () => {
            context('when user does not exist', () => {
                var findUser;
                before(() => {
                    findUser =  sinon.stub(User, 'findByPk');
                    findUser.withArgs(1).returns(new Promise((resolve, reject) => {
                        resolve(null);
                      }));
                })
                
                after(() => {
                    findUser.restore()
                })
        
                it('returns status 404', done => {
                    chai.request(app)
                        .get('/api/v1/users/1')
                        .end((err, res) => {
                            res.should.have.status(404)
                            done()
                        })
                })
            })
        
            context('when user exists', () => {
                var findUser;
                var foundUser = new User({
                    id: 1,
                    name: Faker.name.firstName(), 
                    email: Faker.internet.email(),
                    gender: 'male',
                    age: Faker.random.number()
                })
                before(() => {
                    findUser =  sinon.stub(User, 'findByPk');
                    findUser.withArgs(1).returns(new Promise((resolve, reject) => {
                        resolve(foundUser);
                      }));
                })
                
                after(() => {
                    findUser.restore()
                })
                it('returns status 200 and return a user', done => {
                    chai.request(app)
                    .get('/api/v1/users/1')
                    .end((err, res) => {
                        res.should.have.status(200)
                        expect(res.body).not.to.be.empty
                        done()
                    })
                })
            })
        })
    })
    
    describe('POST /users', () => {
        context('when parameters validation is not ok', () => {
            
            it('returns status code 422 if mandaroty param is missing', done => {
                const req_params = {
                    name: Faker.name.firstName(),
                    gender: 'male',
                    age: Faker.random.number()
                }
    
                chai.request(app)
                .post('/api/v1/users')
                .send(req_params)
                .end((err, res) => {
                    res.should.have.status(422)
                    done()
                })
            })
    
            it('returns status code 422 if gender is not male or female', done => {
                const req_params = {
                    name: Faker.name.firstName(),
                    email: Faker.internet.email(),
                    gender: 'abc',
                    age: Faker.random.number()
                }
    
                chai.request(app)
                .post('/api/v1/users')
                .send(req_params)
                .end((err, res) => {
                    res.should.have.status(422)
                    done()
                })
            })
        })
    
        context('when params validation is ok', () => {
            var findOrcreateUser;
            var created_user = new User({
                id: 1,
                name: Faker.name.firstName(), 
                email: Faker.internet.email(),
                gender: 'male',
                age: Faker.random.number()
            })
            const req_params = {
                name: created_user.name,
                email: created_user.email,
                gender: created_user.gender,
                age: created_user.age
            }
    
            context('when user does not exist', () => {
                before(() => {
                    findOrcreateUser =  sinon.stub(User, 'findOrCreate');
                    findOrcreateUser.returns(new Promise((resolve, reject) => {
                        resolve([created_user, true]);
                      }));
                })
                after(() => {
                    findOrcreateUser.restore()
                })
    
                it('returns status 200 if created', done => {
                    chai.request(app)
                    .post('/api/v1/users')
                    .send(req_params)
                    .end((err, res) => {
                        res.should.have.status(200)
                        done()
                    })
                })
                it('returns the created user', done => {    
                    chai.request(app)
                    .post('/api/v1/users')
                    .send(req_params)
                    .end((err, res) => {
                        expect(res.body).not.to.be.empty
                        done()
                    })
                })
            })
        
            context('when user already exists', () => {
                before(() => {
                    findOrcreateUser =  sinon.stub(User, 'findOrCreate');
                    findOrcreateUser.returns(new Promise((resolve, reject) => {
                        resolve([null, false]);
                      }));
                })
                
                after(() => {
                    findOrcreateUser.restore()
                })
    
                it('returns status 409', done =>{
                    chai.request(app)
                    .post('/api/v1/users')
                    .send(req_params)
                    .end((err, res) => {
                        res.should.have.status(409)
                        done()
                    })
                })
            })
        })
    })

    describe('DELETE api/v1/users/:id', () => {
        context('when id param is not valid', () => {
            it('returns status code 422', done => {
                chai.request(app)
                    .delete('/api/v1/users/abc')
                    .end((err, res) => {
                        res.should.have.status(422)
                        done()
                    })
            })
        })

        context('when id param is valid', () => {
            var findUser;
            var deleteUser;

            context('when user exists', () => {
                var foundUser = new User({
                    id: 1,
                    name: Faker.name.firstName(), 
                    email: Faker.internet.email(),
                    gender: 'male',
                    age: Faker.random.number()
                })
                before(() => {
                    findUser =  sinon.stub(User, 'findByPk');
                    findUser.withArgs(1).returns(new Promise((resolve, reject) => {
                        resolve(foundUser);
                      }));
                    
                    deleteUser = sinon.stub(User, 'destroy');
                })
                
                after(() => {
                    findUser.restore()
                    deleteUser.restore()
                })

                it('returns status code 200', done => {
                    chai.request(app)
                        .delete('/api/v1/users/1')
                        .end((err, res) => {
                            res.should.have.status(200)
                            done()
                        })
                })
            })

            context('when user does not exist', () => {
                before(() => {
                    findUser =  sinon.stub(User, 'findByPk');
                    findUser.withArgs(1).returns(new Promise((resolve, reject) => {
                        resolve(null);
                    }));

                })
                
                after(() => {
                    findUser.restore()
                })

                it('returns status code 404', done => {
                    chai.request(app)
                        .delete('/api/v1/users/1')
                        .end((err, res) => {
                            res.should.have.status(404)
                            done()
                        })
                })
            })
        })
    })
})