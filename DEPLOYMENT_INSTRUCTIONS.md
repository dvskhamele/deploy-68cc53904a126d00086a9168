# TK999 - Deployment Instructions

## Prerequisites

1. Node.js and npm installed
2. Netlify CLI installed (`npm install -g netlify-cli`)

## Deployment Process

### Step 1: Build the Application

```bash
# Navigate to the client directory
cd client

# Install dependencies (if not already done)
npm install

# Build the application
npm run build
```

This will create a `dist` folder with the compiled application.

### Step 2: Update Deployment Directory

The deployment directory (`tk999-deployment/tk999-netlify-deploy`) should be automatically updated with the latest build. If you need to manually update it:

```bash
# Run the update script
./update-deployment.sh
```

### Step 3: Test Locally (Optional)

Before deploying, you can test the deployment locally:

```bash
# Navigate to the deployment directory
cd tk999-deployment/tk999-netlify-deploy

# Start a simple HTTP server (Python 3)
python -m http.server 8000

# Or with Node.js (if http-server is installed)
npx http-server -p 8000
```

Then open `http://localhost:8000/test-deployment.html` to verify everything works.

### Step 4: Deploy to Netlify

#### Option 1: Automated Deployment (Recommended)

```bash
# Run the deployment script
./deploy-to-netlify.sh
```

This script will:
1. Check if Netlify CLI is installed
2. Verify the deployment directory
3. Deploy to Netlify
4. Provide instructions for manual deployment if needed

#### Option 2: Manual Deployment

1. Login to Netlify CLI:
   ```bash
   netlify login
   ```

2. Deploy the site:
   ```bash
   netlify deploy --dir="tk999-deployment/tk999-netlify-deploy" --prod
   ```

### Step 5: Post-Deployment

1. After deployment, Netlify will provide a URL for your site
2. Test the login and register functionality:
   - Regular User: Any email + password `123456`
   - Admin User: `admin@example.com` + password `admin123`

## Troubleshooting

### Common Issues

1. **Netlify CLI not found**: Install with `npm install -g netlify-cli`
2. **Build errors**: Ensure all dependencies are installed with `npm install` in the client directory
3. **Missing assets**: Run `./update-deployment.sh` to refresh the deployment directory
4. **Routing issues**: The application uses React Router with BrowserRouter, which requires Netlify redirects

### Netlify Redirects

The `_redirects` file in the deployment directory handles client-side routing:

```
/*    /index.html   200
```

This ensures that all routes are redirected to index.html, allowing React Router to handle navigation.

## Updating the Application

To update the deployed application:

1. Make changes to the source code
2. Run `./update-deployment.sh` to rebuild and update the deployment directory
3. Run `./deploy-to-netlify.sh` to deploy the updated version

## Application Structure

The deployed application includes:

- `index.html`: Main entry point
- `/assets/`: Compiled JavaScript, CSS, and other assets
- `vite.svg`: Favicon
- Test files for verification
- `_redirects`: Netlify routing configuration

## Login Credentials

For testing purposes, the application includes demo credentials:

- **Regular User**: 
  - Email: Any valid email
  - Password: `123456`

- **Admin User**:
  - Email: `admin@example.com`
  - Password: `admin123`

These are for demonstration only and would be replaced with a real authentication system in production.