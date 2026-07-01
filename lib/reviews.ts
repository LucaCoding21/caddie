export type Review = {
  author: string;
  rating: number;
  title: string;
  body: string;
  color?: string;
  verified?: boolean;
};

// Real customer reviews from the Amazon listing — verbatim (not reworded, no
// dates). Single source of truth for BOTH the on-page Reviews section
// (components/reviews.tsx) AND the Product review/aggregateRating JSON-LD
// (components/product-schema.tsx). Google requires the marked-up review text to
// match what's visible on the page, so everything shown or marked up reads from
// here — keep them from drifting by never hardcoding review copy elsewhere.
export const REVIEWS: Review[] = [
  {
    author: "Amazon Customer",
    rating: 5,
    title: "Game Changer!",
    verified: true,
    color: "Black",
    body: `This things awesome! All-in-one tool that saves me so much space and time.

Being on the course can be stressful enough, especially if you’re running late for your t-time and are trying to make sure everything’s in your golf bag.

With this Caddie Companion, I don’t have to worry about keeping track of five different tools:

Divot fixer ✔️
Ball marker ✔️
Club brush ✔️
Bottle opener ✔️
Knife ✔️
Tightening tool ✔️

Now I can focus on what really matters, hitting greens, making pars, and having a couple cold ones with the boys! 😎

(Shipping was super fast, neat & clean packaging, & came with its own ball markers!) Highly recommended & I will buy more for my friends and family.`,
  },
  {
    author: "Mollyk",
    rating: 5,
    title: "Great quality",
    verified: true,
    color: "Black",
    body: "Great quality and easy to use. Speedy delivery!",
  },
  {
    author: "Colby White",
    rating: 5,
    title: "The Swiss Army Knife of golf tools!",
    color: "Black",
    body: "Awesome product! Great for cleaning grooves during a round and repairing divets. Highly recommend.",
  },
  {
    author: "Karly Fitterer",
    rating: 5,
    title: "Best golf tool on the market",
    color: "Black",
    body: "Wonderful product. Very well built and sturdy. Best golf tool on the market.",
  },
];

export const REVIEW_COUNT = REVIEWS.length;

// Averaged to one decimal — matches the visible "X.X" summary and the
// aggregateRating.ratingValue so the schema mirrors the page exactly.
export const AVERAGE_RATING =
  Math.round(
    (REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length) * 10
  ) / 10;
