const { test, expect } = require('@playwright/test');

test.describe('Diagnostic Tests', () => {
  test('check page content and elements', async ({ page }) => {
    // Navigate to the login page
    console.log('📍 Navigating to login page...');
    await page.goto('http://localhost:5173/login');
    
    // Wait for the page to load and JavaScript to render
    console.log('📍 Waiting for page to load...');
    await page.waitForLoadState('networkidle');
    
    // Give additional time for React to render
    console.log('📍 Waiting additional time for React...');
    await page.waitForTimeout(5000);
    
    // Take a full screenshot
    await page.screenshot({ path: 'diagnostic-full-page.png', fullPage: true });
    console.log('📸 Full page screenshot saved as diagnostic-full-page.png');
    
    // Get and log the page title
    const title = await page.title();
    console.log('🔖 Page title:', title);
    
    // Get and log the current URL
    const url = page.url();
    console.log('🔗 Current URL:', url);
    
    // Get and log the page content
    const content = await page.content();
    console.log('📄 Page content length:', content.length);
    
    // Save page content to file for analysis
    require('fs').writeFileSync('diagnostic-page-content.html', content);
    console.log('💾 Page content saved to diagnostic-page-content.html');
    
    // Try to find any input elements
    const inputs = await page.$$('input');
    console.log('🔢 Number of input elements found:', inputs.length);
    
    // Try to find any button elements
    const buttons = await page.$$('button');
    console.log('🔘 Number of button elements found:', buttons.length);
    
    // Try common selectors for email input
    const emailSelectors = [
      'input[name="email"]',
      'input[type="email"]',
      '[placeholder*="email"]',
      'input'
    ];
    
    for (const selector of emailSelectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          const isVisible = await element.isVisible();
          const count = await page.locator(selector).count();
          console.log(`🔍 Selector "${selector}": Found=${!!element}, Visible=${isVisible}, Count=${count}`);
        } else {
          console.log(`🔍 Selector "${selector}": Not found`);
        }
      } catch (e) {
        console.log(`🔍 Selector "${selector}": Error - ${e.message}`);
      }
    }
    
    // Try common selectors for password input
    const passwordSelectors = [
      'input[name="password"]',
      'input[type="password"]',
      '[placeholder*="password"]'
    ];
    
    for (const selector of passwordSelectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          const isVisible = await element.isVisible();
          const count = await page.locator(selector).count();
          console.log(`🔍 Password selector "${selector}": Found=${!!element}, Visible=${isVisible}, Count=${count}`);
        } else {
          console.log(`🔍 Password selector "${selector}": Not found`);
        }
      } catch (e) {
        console.log(`🔍 Password selector "${selector}": Error - ${e.message}`);
      }
    }
    
    // Try common selectors for submit button
    const buttonSelectors = [
      'button:has-text("Sign In")',
      'button[type="submit"]',
      'button'
    ];
    
    for (const selector of buttonSelectors) {
      try {
        const count = await page.locator(selector).count();
        console.log(`🔘 Button selector "${selector}": Count=${count}`);
        if (count > 0) {
          const element = await page.locator(selector).first();
          const isVisible = await element.isVisible();
          console.log(`🔘 First button with "${selector}": Visible=${isVisible}`);
        }
      } catch (e) {
        console.log(`🔘 Button selector "${selector}": Error - ${e.message}`);
      }
    }
    
    console.log('✅ Diagnostic test completed');
  });
});

console.log('🔬 Diagnostic Tests Created Successfully!');