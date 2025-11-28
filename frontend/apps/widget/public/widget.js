/**
 * Customer Support Widget Loader
 * This script loads the chat widget iframe into the host page
 */
(function () {
  'use strict';

  // Get script tag attributes - support both old (data-api-key) and new (data-domain) formats
  let currentScript = document.querySelector('script[data-domain]') || 
                      document.querySelector('script[data-api-key]');
  
  // Fallback: find the script that loaded this widget.js
  if (!currentScript) {
    const scripts = document.querySelectorAll('script[src*="widget.js"]');
    currentScript = scripts[scripts.length - 1];
  }
  
  if (!currentScript) {
    console.error('Customer Support Widget: Script tag not found');
    return;
  }

  // Support both attribute naming conventions
  const domain = currentScript.getAttribute('data-domain');
  const apiKey = currentScript.getAttribute('data-api-key');
  const apiUrl = currentScript.getAttribute('data-api-url') || 'http://localhost:5000';
  
  // Get widget URL from the script src or fallback to localhost
  const scriptSrc = currentScript.getAttribute('src') || '';
  const widgetBaseUrl = scriptSrc.replace('/widget.js', '') || 'http://localhost:3001';

  if (!domain && !apiKey) {
    console.error('Customer Support Widget: data-domain or data-api-key is required');
    return;
  }

  // Create iframe container
  const container = document.createElement('div');
  container.id = 'cs-widget-container';
  container.style.cssText = `
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 999999;
    pointer-events: none;
  `;

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.id = 'cs-widget-iframe';
  
  // Build query params - prefer domain, fallback to apiKey
  const params = new URLSearchParams();
  if (domain) params.set('domain', domain);
  if (apiKey) params.set('apiKey', apiKey);
  params.set('apiUrl', apiUrl);
  
  iframe.src = `${widgetBaseUrl}?${params.toString()}`;
  iframe.style.cssText = `
    border: none;
    width: 100vw;
    height: 100vh;
    position: fixed;
    bottom: 0;
    right: 0;
    pointer-events: auto;
    background: transparent;
  `;
  iframe.setAttribute('allow', 'clipboard-write');
  iframe.setAttribute('title', 'Customer Support Chat Widget');

  // Append to container and body
  container.appendChild(iframe);
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      document.body.appendChild(container);
    });
  } else {
    document.body.appendChild(container);
  }

  // Log successful initialization
  console.log('Customer Support Widget initialized successfully');
})();

