import chai from 'chai';
import chaiHttp from 'chai-http'
import sinon from 'sinon';
import 'mocha';
import app from '../src/app';
import Product from '../src/api/v1/models/product';
import Faker from 'faker';

const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp)

describe('PRODUCTS API', () => {
    describe('GET /api/v1/products', () => {
        var findProducts;
        context('when there are no results', () => {
            before(() => {
                findProducts =  sinon.stub(Product, 'findAll');
                findProducts.returns(new Promise((resolve, reject) => {
                    resolve([]);
                  }));
            })
            after(() => {
                findProducts.restore()
            })
            it('returns status 404', done => {
                chai.request(app)
                    .get('/api/v1/products')
                    .end((err, res) => {
                        res.should.have.status(404)
                        done()
                    })
            })
        })
        context('when there are results', () => {
            before(() => {
                findProducts =  sinon.stub(Product, 'findAll');
                findProducts.returns(new Promise((resolve, reject) => {
                    var product1 = new Product({
                        id: 1,
                        name: Faker.commerce.productName(), 
                        category: Faker.random.alphaNumeric(),
                        price: Faker.commerce.price(),
                        description: Faker.lorem.text()
                    })
                    var product2 = new Product({
                        id: 2,
                        name: Faker.commerce.productName(), 
                        category: Faker.random.alphaNumeric(),
                        price: Faker.commerce.price(),
                        description: Faker.lorem.text()
                    })
                    resolve([product1, product2]);
                  }));
            })
            after(() => {
                findProducts.restore()
            })
            it('returns status 200 and return products', done => {
                chai.request(app)
                .get('/api/v1/products')
                .end((err, res) => {
                    res.should.have.status(200)
                    expect(res.body.length).to.be.greaterThan(0)
                    done()
                })
            })
        })
    })
    
    describe('GET /api/V1/products/:id', () => {
        var findProduct;
        context('when product does not exist', () => {
            before(() => {
                findProduct =  sinon.stub(Product, 'findByPk');
                findProduct.withArgs(1).returns(new Promise((resolve, reject) => {
                    resolve(null);
                  }));
            })
            
            after(() => {
                findProduct.restore()
            })
    
            it('returns status 404', done => {
                chai.request(app)
                    .get('/api/v1/products/1')
                    .end((err, res) => {
                        res.should.have.status(404)
                        done()
                    })
            })
        })
    
        context('when product exists', () => {
            var foundProduct = new Product({
                id: 1,
                name: Faker.commerce.productName(), 
                category: Faker.random.alphaNumeric(),
                price: Faker.commerce.price(),
                description: Faker.lorem.text()
            })
            before(() => {
                findProduct =  sinon.stub(Product, 'findByPk');
                findProduct.withArgs(1).returns(new Promise((resolve, reject) => {
                    resolve(foundProduct);
                  }));
            })
            
            after(() => {
                findProduct.restore()
            })
            it('returns status 200 and return a product', done => {
                chai.request(app)
                .get('/api/v1/products/1')
                .end((err, res) => {
                    res.should.have.status(200)
                    expect(res.body).not.to.be.empty
                    done()
                })
            })
        })
    })

    describe('POST /products', () => {
        context('when parameters validation is not ok', () => {
            it('returns status code 422 if mandaroty param is missing', done => {
                const req_params = {
                    category: Faker.random.alphaNumeric(),
                    price: Faker.commerce.price(),
                    description: Faker.lorem.text()
                } //Name is missing
    
                chai.request(app)
                .post('/api/v1/products')
                .send(req_params)
                .end((err, res) => {
                    res.should.have.status(422)
                    done()
                })
            })
        })
    
        context('when params validation is ok', () => {
            var createProduct;
            var createdProduct = new Product({
                id: 1,
                name: Faker.commerce.productName(), 
                category: Faker.random.alphaNumeric(),
                price: Faker.commerce.price(),
                description: Faker.lorem.text()
            })
            const req_params = {
                name: createdProduct.name,
                category: createdProduct.category,
                price: createdProduct.price,
                description: createdProduct.description
            }

            context('when product could be created', () => {
                before(() => {
                    createProduct =  sinon.stub(Product, 'create');
                    createProduct.returns(new Promise((resolve, reject) => {
                        resolve(createdProduct);
                      }));
                })
                after(() => {
                    createProduct.restore()
                })

                it('returns status code 200', done => {
                    chai.request(app)
                    .post('/api/v1/products')
                    .send(req_params)
                    .end((err, res) => {
                        res.should.have.status(200)
                        done()
                    })
                })
            })

            context('when product could NOT be created', () => {
                before(() => {
                    createProduct =  sinon.stub(Product, 'create');
                    createProduct.returns(new Promise((resolve, reject) => {
                        reject();
                      }));
                })
                after(() => {
                    createProduct.restore()
                })

                it('returns status code 409', done => {
                    chai.request(app)
                    .post('/api/v1/products')
                    .send(req_params)
                    .end((err, res) => {
                        res.should.have.status(409)
                        done()
                    })
                })
            })
        })
    })
})