/**
 * Customer Support Widget Loader
 * This script loads the chat widget iframe into the host page
 */
(function () {
  'use strict';

  // Get script tag attributes
  const scripts = document.querySelectorAll('script[data-api-key]');
  const currentScript = scripts[scripts.length - 1];
  
  if (!currentScript) {
    console.error('Customer Support Widget: Script tag not found');
    return;
  }

  const apiKey = currentScript.getAttribute('data-api-key');
  const domainId = currentScript.getAttribute('data-domain-id');
  const widgetUrl = currentScript.getAttribute('data-widget-url') || 
                    'http://localhost:3001'; // Default to localhost for development

  if (!apiKey) {
    console.error('Customer Support Widget: API key is required');
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
  iframe.src = `${widgetUrl}?apiKey=${apiKey}&domainId=${domainId || ''}`;
  iframe.style.cssText = `
    border: none;
    width: 100vw;
    height: 100vh;
    position: fixed;
    bottom: 0;
    right: 0;
    pointer-events: auto;
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

