# CareerForge Deployment Guide

## Backend Deployment (Render/Railway)

### Environment Variables
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.com
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
ADMIN_EMAIL=admin@careerforge.com
```

### Build & Run
```bash
npm run build
npm start
```

## Frontend Deployment (Vercel/Netlify)

### Environment Variables
```
VITE_API_URL=https://your-api-url.com/api
```

### Deploy
```bash
npm run build
```

## Database Setup

### MongoDB Atlas
1. Create cluster
2. Create database user
3. Configure IP whitelist
4. Get connection string
5. Add to `.env`

## Domain Setup

- Frontend: `careerforge.com`
- API: `api.careerforge.com`
- Portfolio: `careerforge.com/u/:username`

## SSL Certificate

Automatically handled by deployment platforms.

## Monitoring

- Use platform's built-in monitoring
- Set up error tracking with Sentry
- Monitor database performance

## Backup Strategy

- MongoDB automatic backups
- Regular database snapshots
- Code versioning on GitHub
