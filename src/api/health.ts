import { Request, Response } from 'express';


const health = (req: Request, res: Response, next) => {
    res.status(200).json({ status: 'UP' })
}

export default health