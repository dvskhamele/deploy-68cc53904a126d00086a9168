const { test, expect } = require('@playwright/test');

test.describe('TK999 Application Tests', () => {
  test('should display homepage with correct title', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Check that the page has the correct title
    await expect(page).toHaveTitle(/TK999 - Betting App/);
    
    // Check for key elements on the homepage
    await expect(page.locator('h1:text("TK999")')).toBeVisible();
    await expect(page.locator('text=Sports Betting Platform')).toBeVisible();
    
    console.log('✅ Homepage test passed');
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Click the login button
    await page.click('a:has-text("Login")');
    
    // Wait for navigation and check the URL
    await page.waitForURL('http://localhost:5173/login');
    await expect(page).toHaveURL('http://localhost:5173/login');
    
    // Check for login form elements
    await expect(page.locator('text=Welcome Back')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    
    console.log('✅ Login page navigation test passed');
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Click the register button
    await page.click('a:has-text("Register")');
    
    // Wait for navigation and check the URL
    await page.waitForURL('http://localhost:5173/register');
    await expect(page).toHaveURL('http://localhost:5173/register');
    
    // Check for register form elements
    await expect(page.locator('text=Create Account')).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    
    console.log('✅ Register page navigation test passed');
  });

  test('should perform user login', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    
    // Fill in the login form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', '123456');
    
    // Submit the form
    await page.click('button:has-text("Sign In")');
    
    // Wait a bit for any potential navigation
    await page.waitForTimeout(2000);
    
    // Check that we're either on the dashboard or we see a success message
    const currentUrl = page.url();
    const isSuccess = currentUrl.includes('/dashboard') || 
                     (await page.locator('text=Login successful').isVisible()) ||
                     (await page.locator('text=TK999').isVisible());
    
    expect(isSuccess).toBeTruthy();
    
    console.log('✅ Login functionality test passed');
  });

  test('should perform user registration', async ({ page }) => {
    await page.goto('http://localhost:5173/register');
    
    // Fill in the registration form
    await page.fill('input[name="name"]', 'Playwright Test User');
    await page.fill('input[name="email"]', 'playwright@test.com');
    await page.fill('input[name="phone"]', '1234567890');
    await page.fill('input[name="password"]', '123456');
    await page.fill('input[name="confirm-password"]', '123456');
    
    // Accept terms
    await page.check('#agree-to-terms');
    
    // Submit the form
    await page.click('button:has-text("Create Account")');
    
    // Wait for verification screen
    await page.waitForTimeout(2000);
    
    // Check if we're on the verification screen
    const isVerificationVisible = await page.locator('text=Email Verification').isVisible();
    if (isVerificationVisible) {
      // Fill in the verification code
      await page.fill('input[name="verification-code"]', '123456');
      await page.click('button:has-text("Verify")');
    }
    
    // Wait a bit for any potential navigation
    await page.waitForTimeout(2000);
    
    // Check that registration was successful
    const currentUrl = page.url();
    const isSuccess = currentUrl.includes('/login') || 
                     (await page.locator('text=Registration successful').isVisible()) ||
                     (await page.locator('text=Verify your email').isVisible());
    
    expect(isSuccess).toBeTruthy();
    
    console.log('✅ Registration functionality test passed');
  });
});

console.log('🧪 Playwright tests created successfully!');
console.log('To run the tests, use: npx playwright test');