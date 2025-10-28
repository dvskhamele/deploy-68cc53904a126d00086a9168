const { test, expect } = require('@playwright/test');

test.describe('Console Error Check', () => {
  test('check for JavaScript errors', async ({ page }) => {
    // Capture console messages
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
      console.log(`[BROWSER CONSOLE ${msg.type()}] ${msg.text()}`);
    });
    
    // Capture page errors
    const pageErrors = [];
    page.on('pageerror', error => {
      pageErrors.push(error.message);
      console.log(`[PAGE ERROR] ${error.message}`);
    });
    
    // Navigate to the login page
    console.log('📍 Navigating to login page...');
    await page.goto('http://localhost:5173/login');
    
    // Wait for the page to load and JavaScript to render
    console.log('📍 Waiting for page to load...');
    await page.waitForLoadState('networkidle');
    
    // Give additional time for React to render
    console.log('📍 Waiting additional time for React...');
    await page.waitForTimeout(5000);
    
    // Log any console messages
    console.log('📝 Console messages captured:');
    consoleMessages.forEach(msg => console.log(`  ${msg}`));
    
    // Log any page errors
    console.log('❌ Page errors captured:');
    if (pageErrors.length > 0) {
      pageErrors.forEach(error => console.log(`  ${error}`));
    } else {
      console.log('  No page errors found');
    }
    
    console.log('✅ Console error check completed');
  });
});

console.log('📋 Console Error Check Test Created Successfully!');