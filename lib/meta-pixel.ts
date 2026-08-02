// Meta Pixel standard-event helper. The base pixel (app/layout.tsx) defines
// window.fbq and fires PageView on every page; buy-flow components call this
// to send the mid-funnel events (AddToCart, InitiateCheckout) that only the
// site can see — the checkout itself lives on Shopify's domain.
//
// The base snippet installs a queueing stub before fbevents.js finishes
// loading, so events fired early are buffered, not lost. The guard is only
// for environments where the pixel never loads (blockers, SSR).

type MetaEventParams = {
  value?: number;
  currency?: string;
  num_items?: number;
  content_type?: string;
  contents?: { id: string; quantity: number; item_price?: number }[];
};

declare global {
  interface Window {
    fbq?: (command: "track", event: string, params?: MetaEventParams) => void;
  }
}

export function trackMetaEvent(event: string, params?: MetaEventParams) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", event, params);
}
