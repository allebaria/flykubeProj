import express from 'express';
import { check } from 'express-validator'
import UsersController from '../controllers/users';
import ProductsController from '../controllers/products';
import InvoicesController from '../controllers/invoices';

//Controllers instances
const usersController = new UsersController();
const productsController = new ProductsController();
const invoicesController = new InvoicesController();

//Routes
const USERS = '/users';
const USER = '/users/:id';
const PRODUCTS = '/products';
const PRODUCT = '/products/:id';
const INVOICES = '/invoices';
const INVOICE = '/invoices/:id';


//Link routes with endpoints
const router = express.Router();

//Users
router.get(USERS, usersController.getUsers);

router.get(USER, [
    check('id')
        .exists().withMessage('id query param must exist')
        .isNumeric().withMessage('id query param must be numeric')
],
usersController.getUser);

//Products
router.get(PRODUCTS, productsController.getProducts);

router.get(PRODUCT, [
    check('id')
        .exists().withMessage('id query param must exist')
        .isNumeric().withMessage('id query param must be numeric')
],
productsController.getProduct);

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

router.delete(PRODUCT, [
    check('id')
        .exists().withMessage('id query param must exist')
        .isNumeric().withMessage('id query param must be numeric')
],
productsController.deleteProduct)

router.delete(USER, [
    check('id')
        .exists().withMessage('id query param must exist')
        .isNumeric().withMessage('id query param must be numeric')
],
usersController.deleteUser)

//Invoices
router.get(INVOICE, [
    check('id')
        .exists().withMessage('id query param must exist')
        .isNumeric().withMessage('id query param must be numeric')
],
invoicesController.getInvoice)

router.post(INVOICES, [
    check('user_id')
        .exists().withMessage('id query param must exist')
        .isNumeric().withMessage('id query param must be numeric'),
    check('product_id')
        .exists().withMessage('id query param must exist')
        .isNumeric().withMessage('id query param must be numeric')
], invoicesController.createInvocie)


export default router;
