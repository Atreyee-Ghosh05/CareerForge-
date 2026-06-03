import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';

export const sanitize = mongoSanitize();

export const securityHeaders = helmet();
