# TK999 Manual Verification Guide

## Prerequisites
1. Ensure the development server is running (`npm run dev`)
2. Open your browser to http://localhost:5173
3. Clear browser localStorage for a clean test (optional)

## Verification Steps

### 1. User Registration Flow
1. Navigate to the homepage
2. Click "Get Started" button
3. Fill the registration form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Phone: "0123456789"
4. Click "Create Account"
5. Verify:
   - [ ] Redirected to Dashboard
   - [ ] Welcome message shows "Test User"
   - [ ] Wallet balance shows 1000.00 BDT
   - [ ] User data stored in localStorage

### 2. Betting Functionality
1. Click "Matches" in the header
2. Select any match
3. Click on a team button to place a bet
4. Enter amount "100" when prompted
5. Click OK
6. Verify:
   - [ ] Success message appears
   - [ ] Wallet balance decreases by 100 BDT
   - [ ] Transaction appears in history
   - [ ] Bet appears in transaction history

### 3. Wallet Operations
1. Go to Dashboard
2. Click "Deposit" button
3. Enter amount "500" when prompted
4. Click OK
5. Verify:
   - [ ] Success message appears
   - [ ] Wallet balance increases by 500 BDT
   - [ ] Deposit transaction appears in history

6. Click "Withdraw" button
7. Enter amount "200" when prompted
8. Click OK
9. Verify:
   - [ ] Success message appears
   - [ ] Wallet balance decreases by 200 BDT
   - [ ] Withdrawal transaction appears in history

### 4. Session Persistence
1. Refresh the page (F5 or Ctrl+R)
2. Verify:
   - [ ] Still logged in as "Test User"
   - [ ] Wallet balance is correct
   - [ ] Transaction history persists
   - [ ] No need to re-login

### 5. Logout and Login
1. Click "Logout" button in header
2. Verify:
   - [ ] Redirected to Login page
   - [ ] User session cleared from localStorage

3. Click "Login" button
4. Enter:
   - Email: "alice@example.com"
   - OTP: "123456"
5. Click "Sign In"
6. Verify:
   - [ ] Redirected to Dashboard
   - [ ] Welcome message shows "Alice Kumar"
   - [ ] Wallet balance shows 1000.00 BDT

### 6. Admin Functionality
1. Logout if currently logged in
2. Login as admin:
   - Email: "admin@example.com"
   - OTP: "admin123"
3. Click "Admin" in header
4. Verify:
   - [ ] Admin Dashboard loads
   - [ ] Matches section shows matches
   - [ ] Users section shows all users
   - [ ] Bets section shows all bets

5. In Matches section, find a match without a result
6. Click "Set Winner" button
7. Enter one of the team names when prompted
8. Click OK
9. Verify:
   - [ ] Success message appears
   - [ ] Match shows the winner
   - [ ] Related bets update status (Won/Lost)
   - [ ] User wallets update for winning bets

### 7. Data Persistence Verification
1. Open browser developer tools (F12)
2. Go to Application/Storage tab
3. Check localStorage:
   - [ ] "user" entry exists with user data
   - [ ] "token" entry exists with token
   - [ ] "appData" entry exists with application data

4. Refresh the page
5. Verify all data is still present and correct

### 8. Edge Case Testing
1. Try to register with existing email:
   - [ ] Appropriate error message appears

2. Try to bet with insufficient balance:
   - [ ] Appropriate error message appears

3. Try to login with wrong OTP:
   - [ ] Appropriate error message appears

4. Try to withdraw more than balance:
   - [ ] Appropriate error message appears

## Success Criteria
All verification steps should pass without errors. The application should:
- Maintain data consistency across all operations
- Persist user sessions and data across page refreshes
- Handle errors gracefully with appropriate messages
- Provide smooth user experience with clear feedback

## Troubleshooting
If any step fails:
1. Check browser console for errors (F12 → Console tab)
2. Verify localStorage entries in Application tab
3. Ensure development server is running properly
4. Clear localStorage and try again
5. Check network tab for failed API calls

## Completion
Once all steps are verified, the TK999 application is working correctly with proper end-to-end data flow.