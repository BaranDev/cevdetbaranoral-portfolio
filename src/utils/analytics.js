const GA_MEASUREMENT_ID =
  import.meta.env.VITE_GA_MEASUREMENT_ID || "G-QWRS8GKBXV";

let hasInitializedAnalytics = false;
let lastTrackedPath = "";

export function initAnalytics() {
  if (
    typeof window === "undefined" ||
    hasInitializedAnalytics ||
    !GA_MEASUREMENT_ID
  ) {
    return;
  }

  if (
    !document.querySelector(
      `script[src*="googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`,
    )
  ) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };

  window.gtag("js", new Date());

  // We send page views manually so SPA route changes are always tracked.
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
  });

  hasInitializedAnalytics = true;
}

export function trackPageView(path, title) {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID) {
    return;
  }

  if (path === lastTrackedPath) {
    return;
  }

  if (!hasInitializedAnalytics) {
    initAnalytics();
  }

  if (typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", "page_view", {
    send_to: GA_MEASUREMENT_ID,
    page_path: path,
    page_location: `${window.location.origin}${path}`,
    page_title: title || document.title,
  });

  lastTrackedPath = path;
}
