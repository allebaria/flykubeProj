import express from 'express';
import { check } from 'express-validator'
import UsersController from '../controllers/users';
import ProductsController from '../controllers/products'

//Controllers instances
const usersController = new UsersController();
const productsController = new ProductsController();

//Routes
const USERS = '/users';
const USER = '/users/:id';
const PRODUCTS = '/products';
const PRODUCT = '/products/:id';


//Link routes with endpoints
const router = express.Router();

router.get(USERS, usersController.getUsers);
router.get(USER, usersController.getUser);
router.get(PRODUCTS, productsController.getProducts);
router.get(PRODUCT, productsController.getProduct);
router.post(USERS, [
    check('name')
        .exists().withMessage('Name must exist.')
        .isString(),
    check('email')
        .exists().withMessage('Email must exist.')
        .isEmail().withMessage('Email must be valid'),
    check('gender')
        .exists()
        .custom(gender => {
            if (gender !== 'male' && gender !== 'female') return Promise.reject('Gender must be male or female.')
            return Promise.resolve()
        }),
    check('age')
        .exists()
        .isNumeric()
],
usersController.createUser);
router.post(PRODUCTS, [
    check('name')
        .exists().withMessage('Name must exist.')
        .isString(),
    check('category')
        .exists().withMessage('Category must exist.'),
    check('price')
        .isNumeric()
        .exists(),
    check('description')
        .exists()
        .isString()
], 
productsController.createProduct)


export default router;
