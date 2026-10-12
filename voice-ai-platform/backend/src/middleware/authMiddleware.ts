import { Request, Response, NextFunction } from 'express';
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
 if (!req.headers.authorization) { res.status(401).json({ error: 'Unauthorized' }); return; }
 next();
}
