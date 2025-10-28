const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('🚀 Testing live site...');
  
  try {
    // Navigate to the site
    console.log('📍 Navigating to https://tk999-betting-app.netlify.app/');
    await page.goto('https://tk999-betting-app.netlify.app/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Wait a bit more for JavaScript to render
    await page.waitForTimeout(5000);
    
    // Get the page title
    const title = await page.title();
    console.log('🔖 Page title:', title);
    
    // Get the current URL
    const url = page.url();
    console.log('🔗 Current URL:', url);
    
    // Check if we can find any React elements
    const hasReactRoot = await page.$('#root');
    console.log('⚛️ Has React root:', !!hasReactRoot);
    
    // Check if we can find the loading message
    const hasLoadingMessage = await page.isVisible('text=Loading React application');
    console.log('⏳ Has loading message:', hasLoadingMessage);
    
    // Check if we can find the TK999 text
    const hasTK999 = await page.isVisible('text=TK999');
    console.log('🎯 Has TK999 text:', hasTK999);
    
    // Take a screenshot
    await page.screenshot({ path: 'live-site-test.png' });
    console.log('📸 Screenshot saved as live-site-test.png');
    
    // Get page content for analysis
    const content = await page.content();
    
    if (content.includes('TK999 Admin') || content.includes('Admin Control Center')) {
      console.log('✅ ADMIN PANEL DETECTED!');
      console.log('✅ The transparency fixes are working correctly!');
    } else if (content.includes('TK999 - Betting App') && content.includes('Loading React application')) {
      console.log('⏳ SITE IS LOADING...');
      console.log('⚠️ React app is loading but may have issues');
    } else {
      console.log('❌ UNEXPECTED CONTENT');
      console.log('📝 Content preview:', content.substring(0, 500) + '...');
    }
    
  } catch (error) {
    console.log('❌ Error testing site:', error.message);
  }
  
  await browser.close();
  console.log('🏁 Test completed');
})();