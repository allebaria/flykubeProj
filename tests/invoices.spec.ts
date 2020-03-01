import chai from 'chai';
import chaiHttp from 'chai-http'
import 'mocha';
import app from '../src/app';
import sinon from 'sinon';
import Invoice from '../src/api/v1/models/invoice';
import User from '../src/api/v1/models/user';
import Product from '../src/api/v1/models/product'; 
import Faker from 'faker'; 

const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('INVOICES API', () => {
    describe('GET api/v1/invoices/:id', () => {
        context('when id param is not valid', () => {
            it('returns status code 422', done => {
                chai.request(app)
                    .get('/api/v1/invoices/abc')
                    .end((err, res) => {
                        res.should.have.status(422)
                        done()
                    })
            })
        })

        context('when id param is valid', () => {
            var findInvoice;
            context('when invoice does not exist', () => {
                before(() => {
                    findInvoice =  sinon.stub(Invoice, 'findByPk');
                    findInvoice.withArgs(1).returns(new Promise((resolve, reject) => {
                        resolve(null);
                      }));
                })
                
                after(() => {
                    findInvoice.restore()
                })
        
                it('returns status 404', done => {
                    chai.request(app)
                        .get('/api/v1/invoices/1')
                        .end((err, res) => {
                            res.should.have.status(404)
                            done()
                        })
                })
            })
        
            context('when product exists', () => {
                var foundInvoice = new Invoice({
                    id: 1,
                    user_id: 1, 
                    product_id: 1
                })
                before(() => {
                    findInvoice =  sinon.stub(Invoice, 'findByPk');
                    findInvoice.withArgs(1).returns(new Promise((resolve, reject) => {
                        resolve(foundInvoice);
                      }));
                })
                
                after(() => {
                    findInvoice.restore()
                })
                it('returns status 200 and return an invoice', done => {
                    chai.request(app)
                    .get('/api/v1/invoices/1')
                    .end((err, res) => {
                        res.should.have.status(200)
                        expect(res.body).not.to.be.empty
                        done()
                    })
                })
            })
        })
    })

    describe('POST /api/v1/invoices', () => {
        context('when parameters validation is not ok', () => {
            it('returns status code 422 if mandaroty param is missing', done => {
                const req_params = {
                    user_id: 1
                } //product_id is missing
    
                chai.request(app)
                .post('/api/v1/invoices')
                .send(req_params)
                .end((err, res) => {
                    res.should.have.status(422)
                    done()
                })
            })
        })
    
        context('when params validation is ok', () => {
            var createInvoice;
            var findUser;
            var findProduct;

            var createdInvoice = new Invoice({
                id: 1,
                user_id: 1, 
                product_id: 1
            });
            
            var relatedUser = new User({
                id: 1,
                name: Faker.name.firstName(), 
                email: Faker.internet.email(),
                gender: 'male',
                age: Faker.random.number()
            });
            
            var relatedProduct = new Product({
                id: 1,
                name: Faker.commerce.productName(), 
                category: Faker.random.alphaNumeric(),
                price: Faker.commerce.price(),
                description: Faker.lorem.text()
            })
            const req_params = {
                user_id: 1,
                product_id: 1
            }

            context('when invoice could be created', () => {
                before(() => {
                    findUser =  sinon.stub(User, 'findByPk');
                    findUser.returns(new Promise((resolve, reject) => {
                        resolve(relatedUser);
                      }));

                    findProduct =  sinon.stub(Product, 'findByPk');
                    findProduct.returns(new Promise((resolve, reject) => {
                        resolve(relatedProduct);
                      }));

                    createInvoice =  sinon.stub(Invoice, 'create');
                    createInvoice.returns(new Promise((resolve, reject) => {
                        resolve(createdInvoice);
                      }));
                })
                after(() => {
                    createInvoice.restore();
                    findUser.restore();
                    findProduct.restore();
                })

                it('returns status code 200', done => {
                    chai.request(app)
                    .post('/api/v1/invoices')
                    .send(req_params)
                    .end((err, res) => {
                        res.should.have.status(200)
                        done()
                    })
                })
            })

            context('when invoice could NOT be created', () => {
                before(() => {
                    findUser =  sinon.stub(User, 'findByPk');
                    findUser.returns(new Promise((resolve, reject) => {
                        resolve(relatedUser);
                      }));
                    findProduct =  sinon.stub(Product, 'findByPk');
                    findProduct.returns(new Promise((resolve, reject) => {
                        resolve(relatedProduct);
                      }));
                    createInvoice =  sinon.stub(Invoice, 'create');
                    createInvoice.returns(new Promise((resolve, reject) => {
                        reject();
                      }));
                })
                after(() => {
                    createInvoice.restore();
                    findUser.restore();
                    findProduct.restore();
                })

                it('returns status code 409', done => {
                    chai.request(app)
                    .post('/api/v1/invoices')
                    .send(req_params)
                    .end((err, res) => {
                        res.should.have.status(409)
                        done()
                    })
                })
            })

            context('when user to create the product do not exist', () => {
                before(() => {
                    findUser =  sinon.stub(User, 'findByPk');
                    findUser.returns(new Promise((resolve, reject) => {
                        resolve(null);
                      }));
                })
                after(() => {
                    findUser.restore()
                })

                it('returns status code 404', done => {
                    chai.request(app)
                    .post('/api/v1/invoices')
                    .send(req_params)
                    .end((err, res) => {
                        res.should.have.status(404)
                        done()
                    })
                })
            })
        })
    })
})

