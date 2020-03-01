import { Request, Response } from "express";
import Invoice from '../models/invoice';
import { validationResult, matchedData } from 'express-validator';
import User from '../models/user';
import Product from '../models/product';


export default class InvoicesController {
    public getInvoice = async (req: Request, res: Response) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.mapped() });
        }

        const invoice_id: number = parseInt(req.params.id)

        try {
            const invoice : Invoice = await Invoice.findByPk(invoice_id, {
                attributes: ['id'],
                include: ['user', 'product']
            })            
            return invoice ? res.status(200).json(invoice) : res.status(404).json({ error: 'Invoice not found' })
        } catch (e) {
            return res.status(500).json({ error: 'Server internal error' })
        }
    }

    public createInvocie = async (req: Request, res: Response) => {
        //Check it there are validation errors
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.mapped() });
        }

        //If no validations errors, get parameters from request
        const { user_id, product_id } = matchedData(req)
        
        //Create new product
        try {
            const user = await User.findByPk(user_id)
            if (!user) return res.status(404).json({ error: 'The specified user to create this invoice does not exist.'})

            const product = await Product.findByPk(product_id)
            if (!product) return res.status(404).json({ error: 'The specified product to create the invoice does not exist.'})

            const new_invoice = await Invoice.create({
                user_id,
                product_id
            })
            return res.status(200).json(new_invoice)
            
        } catch (e) {
            return res.status(409).json({ error: 'Could not create invoice' })
        }
    }
}