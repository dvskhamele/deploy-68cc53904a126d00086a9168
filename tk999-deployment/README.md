# TK999 Deployment Package

This package contains both the frontend and backend for the TK999 betting platform, ready for deployment.

## Deployment Instructions

### Deploying to Vercel

1. Create a new project on Vercel
2. Connect your GitHub repository or upload this zip file
3. Set the root directory to the root of this package
4. Vercel will automatically detect and deploy both frontend and backend

### Project Structure

- `/frontend` - React frontend application
- `/backend` - Node.js/Express backend API
- `vercel.json` - Configuration for Vercel deployment

### Local Development

To run the application locally:

1. Install dependencies:
   ```
   npm install
   cd frontend && npm install && cd ..
   cd backend && npm install && cd ..
   ```

2. Start both frontend and backend:
   ```
   npm run dev
   ```

### Environment Variables

For production deployment, make sure to set the following environment variables:

- `JWT_SECRET` - Secret key for JWT tokens (backend)
- `VITE_API_URL` - URL of your backend API (frontend)

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001/api/