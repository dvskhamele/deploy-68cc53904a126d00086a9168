<<<<<<< HEAD
# TK999 Betting Platform

A complete betting platform with login, matches, and betting functionality.

## Features

- User authentication (login/register)
- Live and upcoming matches
- Betting with real-time odds
- Bet history tracking
- Dashboard with user stats
- Responsive design

## How to Run

1. Start the server:
   ```bash
   python3 -m http.server 8000
   ```
   or
   ```bash
   python3 -m http.server 8080
   ```

2. Open your browser and go to:
   - http://localhost:8000 or http://localhost:8080

3. Login with demo credentials:
   - Username: `demo`
   - Password: `demo123`

## Pages

- `/login.html` - User login
- `/register.html` - User registration
- `/dashboard.html` - Main dashboard
- `/matches.html` - Browse and bet on matches
- `/my-bets.html` - View betting history
- `/index.html` - Main application (redirects to login if not authenticated)

## Demo Credentials

- Username: `demo`
- Password: `demo123`

Or create your own account using the register page.
=======
# TK999 - Beautiful Solid Card Dashboard

## Overview
This update implements a beautiful, solid card design for the TK999 betting platform with no transparency issues. All components now use solid backgrounds with clear text for better readability.

## Key Features
- Beautiful solid card design with no transparency
- Improved readability and contrast
- Professional appearance with consistent design language
- Enhanced user experience across all pages

## Deployment Instructions

### Deploy to Netlify (Manual)
1. Go to https://app.netlify.com/
2. Sign in or create an account
3. Click "Add new site" -> "Deploy manually"
4. Drag and drop the entire `tk999-netlify-deploy` directory
5. Wait for deployment to complete
6. Your site will be live on a Netlify URL

### Files for Deployment
All built files are located in the `tk999-netlify-deploy` directory:
- `index.html` - Main application entry point
- `assets/` - Directory containing all built CSS and JavaScript files

## Development
To make further changes:
1. Navigate to the `client` directory
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Run `npm run build` to build for production

## Documentation
- `BEAUTIFUL_SOLID_CARDS_SUMMARY.md` - Complete overview of the new design system
- `ENHANCED_GAMING_DASHBOARD_SUMMARY.md` - Previous enhancements documentation
- `DEPLOYMENT_SUMMARY.md` - This deployment guide
>>>>>>> 3b0aa97c719082403efdfade708cd2882a2d02e7
