const { test, expect } = require('@playwright/test');

test('check actual error message', async ({ page }) => {
  // Navigate to the login page
  await page.goto('http://localhost:5173/login');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Fill in with invalid credentials
  await page.fill('input[name="email"]', 'invalid@example.com');
  await page.fill('input[name="password"]', 'wrongpassword');
  
  // Submit the login form
  await page.click('button:has-text("Sign In")');
  
  // Wait for error message
  await page.waitForTimeout(3000);
  
  // Get the page content to see what error messages are actually displayed
  const content = await page.content();
  
  // Save content to file for analysis
  require('fs').writeFileSync('error-page-content.html', content);
  
  // Try to find any error messages
  const errorElements = await page.$$('.text-red-700, [class*="error"], [class*="Error"]');
  console.log('Found', errorElements.length, 'potential error elements');
  
  for (let i = 0; i < errorElements.length; i++) {
    const text = await errorElements[i].innerText();
    console.log('Error element', i, 'text:', text);
  }
  
  console.log('Page content saved to error-page-content.html');
});