(function() {
    'use strict';
    
    // Track initialized widgets to prevent duplicates
    const initializedWidgets = new Set();
    
    // Substack widget initialization function
    function initializeSubstackWidget(config) {
        const element = document.querySelector(config.element);
        if (!element || initializedWidgets.has(config.element)) return;
        
        // Mark this element as initialized
        initializedWidgets.add(config.element);
        
        // Clear any existing content
        element.innerHTML = '';
        
        const form = document.createElement('form');
        form.className = 'substack-widget-form';
        form.innerHTML = `
            <div class="flex items-center" style="width: 417px; height: 44px; margin: 0 auto; margin-right: 16px;">
                <div class="flex-1 h-full bg-white rounded-[7px] border border-[#FFFFFF1A]" style="box-shadow: 2px 2px 1px 0px #FFFFFF59 inset; width: 292px;">
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="${config.placeholder || 'Type Your Email...'}" 
                        required
                        class="w-full h-full px-4 bg-transparent text-black placeholder-gray-500 focus:outline-none rounded-[7px]"
                        style="border: none;"
                    />
                </div>
                <button 
                    type="submit" 
                    class="h-full bg-[#E22006] text-white font-medium rounded-[7px] transition-all duration-300 transform hover:scale-105 whitespace-nowrap ml-0"
                    style="width: 125px; padding: 10px 15px; gap: 8px; box-shadow: 2px 2px 1px 0px #FFFFFF59 inset;"
                >
                    ${config.buttonText || 'Subscribe'}
                </button>
            </div>
        `;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = form.querySelector('input[name="email"]').value;
            if (email) {
                // Redirect to Substack subscription page
                window.open(`https://${config.substackUrl}/subscribe?email=${encodeURIComponent(email)}`, '_blank');
            }
        });
        
        element.appendChild(form);
    }
    
    // Initialize widgets when DOM is ready
    function init() {
        // Initialize main hero widget
        if (window.CustomSubstackWidget && !initializedWidgets.has(window.CustomSubstackWidget.element)) {
            initializeSubstackWidget(window.CustomSubstackWidget);
        }
        
        // Initialize footer widget only if it's different from the main widget
        if (window.CustomSubstackWidget2 && 
            window.CustomSubstackWidget2.element !== window.CustomSubstackWidget?.element &&
            !initializedWidgets.has(window.CustomSubstackWidget2.element)) {
            initializeSubstackWidget(window.CustomSubstackWidget2);
        }
    }
    
    // Self-executing initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Expose init function globally for manual initialization
    window.initSubstackWidgets = init;
})();