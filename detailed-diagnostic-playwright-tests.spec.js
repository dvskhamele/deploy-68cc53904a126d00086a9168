const { test, expect } = require('@playwright/test');

test.describe('Detailed Diagnostic Tests', () => {
  test('check for JavaScript errors and page rendering', async ({ page }) => {
    // Capture all console messages
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
        location: msg.location(),
        args: msg.args()
      });
    });
    
    // Capture page errors
    const pageErrors = [];
    page.on('pageerror', error => {
      pageErrors.push({
        message: error.message,
        stack: error.stack
      });
    });
    
    // Capture request failures
    const requestFailures = [];
    page.on('requestfailed', request => {
      requestFailures.push({
        url: request.url(),
        failure: request.failure(),
        method: request.method()
      });
    });
    
    // Navigate to the homepage first
    console.log('📍 Navigating to homepage...');
    await page.goto('http://localhost:5173');
    
    // Wait for load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check homepage content
    const homepageContent = await page.content();
    console.log('🏠 Homepage content length:', homepageContent.length);
    
    // Navigate to the login page
    console.log('📍 Navigating to login page...');
    await page.goto('http://localhost:5173/login');
    
    // Wait for load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({ path: 'detailed-diagnostic.png', fullPage: true });
    
    // Get page content
    const content = await page.content();
    console.log('📄 Login page content length:', content.length);
    
    // Check for specific elements
    const rootDiv = await page.$('#root');
    const rootContent = await page.locator('#root').innerText();
    console.log('🌱 Root div content:', rootContent.substring(0, 100) + '...');
    
    // Log all console messages
    console.log('📝 Console messages:');
    consoleMessages.forEach((msg, index) => {
      console.log(`  ${index + 1}. [${msg.type}] ${msg.text}`);
      if (msg.location && msg.location.url) {
        console.log(`     Location: ${msg.location.url}:${msg.location.lineNumber}:${msg.location.columnNumber}`);
      }
    });
    
    // Log page errors
    console.log('❌ Page errors:');
    pageErrors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error.message}`);
      if (error.stack) {
        console.log(`     Stack: ${error.stack}`);
      }
    });
    
    // Log request failures
    console.log('📡 Request failures:');
    requestFailures.forEach((failure, index) => {
      console.log(`  ${index + 1}. ${failure.method} ${failure.url}`);
      if (failure.failure) {
        console.log(`     Error: ${failure.failure.errorText}`);
      }
    });
    
    console.log('✅ Detailed diagnostic test completed');
  });
});

console.log('🔬 Detailed Diagnostic Tests Created Successfully!');