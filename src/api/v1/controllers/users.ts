import { Request, Response } from "express";
import { validationResult, matchedData } from 'express-validator';

import User from '../models/user';

export default class UsersController {
    public getUsers = async (req: Request, res: Response) => {
        try {
            const users : Array<User> = await User.findAll()
            if (users.length > 0) {
                res.status(200).json(users)
            } else {
                res.status(404).json({ error: 'No users found' })
            }
        } catch (e) {
            console.error(e)
        }
    }

    public getUser = async (req: Request, res: Response) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.mapped() });
        }
        
        const user_id : number = parseInt(req.params.id)
        try {
            const user : User = await User.findByPk(user_id)
            user ? res.status(200).json(user) : res.status(404).json({ error: 'User not found' })
        } catch (e) {
            console.error(e)
        }
    }

    public createUser = async (req: Request, res: Response) => {
        //Check it there are validation errors
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.mapped() });
        }

        //If no validations errors, get parameters from request
        const { name, email, gender, age} = matchedData(req)
        
        //Check if user exists by email
        const [user, created] = await User.findOrCreate({
            where: { email },
            defaults: {
                name,
                gender,
                age
            }
        })
        //Send if user created or not
        created ? res.status(200).json(user) : res.status(409).json({ error: 'User already exists' })
    }

    public deleteUser = async (req: Request, res: Response) => {
        //Check it there are validation errors
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.mapped() });
        }

        const user_id : number = parseInt(req.params.id)

        try {
            const user_to_delete = await User.findByPk(user_id)
            if (!user_to_delete) return res.status(404).json({ error: 'User to be deleted was not found'})
            await User.destroy({
                where: {
                    id: user_id
                }
            })
            return res.status(200).json({ msg: 'User deleted sucessfully'})
        } catch (e) {
            return res.status(500).json({ error: 'Server internal error' })
        }
    }
}