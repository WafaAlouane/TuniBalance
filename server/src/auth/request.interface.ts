import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: any; // Typiquement, vous pouvez mettre `user?: UserDocument;`
  userId?: string;
}
