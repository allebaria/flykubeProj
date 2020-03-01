import { Request, Response } from "express";
import Product from '../models/product';
import { validationResult, matchedData } from 'express-validator';

export default class ProductsController {
    public getProducts = async (req: Request, res: Response) => {
        try {
            const products : Array<Product> = await Product.findAll()
            if (products.length > 0) {
                res.status(200).json(products)
            } else {
                res.status(404).json({ error: 'No products found' })
            }
        } catch (e) {
            console.error(e)
        }
    }

    public getProduct = async (req: Request, res: Response) => {
        const product_id : number = parseInt(req.params.id)
        try {
            const product : Product = await Product.findByPk(product_id)
            product ? res.status(200).json(product) : res.status(404).json({ error: 'Product not found' })
        } catch (e) {
            console.error(e)
        }
    }

    public createProduct = async (req: Request, res: Response) => {
        //Check it there are validation errors
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.mapped() });
        }

        //If no validations errors, get parameters from request
        const { name, category, price, description} = matchedData(req)
        
        //Create new product
        try {
            const new_product = await Product.create({
                name,
                category,
                price,
                description
            })
            res.status(200).json(new_product)
            
        } catch (e) {
            res.status(409).json({ error: 'Could not create product' })
        }
    }
}