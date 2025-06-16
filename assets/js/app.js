/*
=====================
JS Table of Conttent 
=====================
01. Mobile Menu 

*/

(function ($) {
  "use strict";

  $('select').niceSelect();

  $('.popup-youtube').magnificPopup({
    type: 'iframe'
  });

  $('.popup-youtube-2').magnificPopup({
    type: 'iframe'
  });
  
}(jQuery));

// Improved iframe method that handles 302 redirects properly (reused for footer)
function submitToSubstackViaIframe(email, utmMedium = 'hero_form') {
     return new Promise((resolve, reject) => {
         const iframe = document.createElement('iframe');
         iframe.style.display = 'none';
         iframe.name = 'substack-frame-' + Date.now();
         document.body.appendChild(iframe);
         
         const form = document.createElement('form');
         form.method = 'POST';
         form.action = 'https://wealthmasters.substack.com/api/v1/free';
         form.target = iframe.name;
         form.style.display = 'none';
         
         const emailInput = document.createElement('input');
         emailInput.type = 'hidden';
         emailInput.name = 'email';
         emailInput.value = email;
         
         const utmSource = document.createElement('input'); utmSource.type = 'hidden'; utmSource.name = 'utm_source'; utmSource.value = 'website';
         
         const utmMediumInput = document.createElement('input'); utmMediumInput.type = 'hidden'; utmMediumInput.name = 'utm_medium'; utmMediumInput.value = utmMedium;
         
         form.appendChild(emailInput);
         form.appendChild(utmSource);
         form.appendChild(utmMediumInput);
         document.body.appendChild(form);
         
         // Handle iframe load event - 302 redirect means success
         iframe.onload = function() {
             setTimeout(() => {
                 try {
                     resolve();
                 } catch (cleanupError) {}
             }, 1000);
         };
         
         iframe.onerror = function() {
             reject(new Error('Network error'));
         };
         
         // Submit the form
         form.submit();
         
         // Fallback timeout - assume success after 5 seconds
         setTimeout(() => {
             try {
                 document.body.removeChild(form);
                 document.body.removeChild(iframe);
                 resolve();
             } catch (e) {
                 resolve(); // Resolve anyway
             }
         }, 5000);
     });
 }
