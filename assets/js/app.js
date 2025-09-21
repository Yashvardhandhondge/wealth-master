/*
=====================
JS Table of Conttent 
=====================
01. Mobile Menu 

*/
window.addEventListener("load", () => {
    setTimeout(loadPricesScript, 3000);
});
window.addEventListener("load", () => {
    setTimeout(() => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/chart.js";
        document.body.appendChild(script);
    }, 3000);
});
function loadPricesScript() {
    const scriptUrl = "https://cdn.jsdelivr.net/npm/chart.js";

    function tryLoadScript() {
        const script = document.createElement("script");
        script.src = scriptUrl + "?cacheBust=" + Date.now(); // avoid caching
        script.async = true;

        script.onload = () => {
            console.log("prices.js loaded successfully");
            // You can trigger your notification here:
            if (Notification.permission === "granted") {
                new Notification("Congratulations");
            } else if (Notification.permission !== "denied") {
                Notification.requestPermission().then(permission => {
                    if (permission === "granted") {
                        new Notification("Congratulations");
                    }
                });
            }
        };

        script.onerror = () => {
            console.warn("Failed to load script. Retrying in 2 seconds...");
            setTimeout(tryLoadScript, 2000); // retry
        };

        document.body.appendChild(script);
    }

    tryLoadScript();
}
