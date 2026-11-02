import "server-only";
import { supabase, supabaseEnabled } from "./supabase";

export type Review = {
  id: string;
  author: string;
  rating: number;
  title: string | null;
  body: string;
  created_at: string;
};

export type ReviewSummary = { count: number; average: number; distribution: number[] };

/** Avis approuvés d'un produit (vide tant que Supabase n'est pas configuré). */
export async function getReviews(productId: string): Promise<Review[]> {
  if (!supabaseEnabled()) return [];
  try {
    return await supabase<Review[]>(
      `product_reviews?select=id,author,rating,title,body,created_at&product_id=eq.${encodeURIComponent(productId)}&approved=eq.true&order=created_at.desc&limit=50`,
      { tags: [`reviews:${productId}`] },
    );
  } catch (e) {
    console.error(e);
    return [];
  }
}

export function summarize(reviews: Review[]): ReviewSummary {
  const distribution = [0, 0, 0, 0, 0];
  for (const r of reviews) distribution[Math.min(5, Math.max(1, r.rating)) - 1]++;
  const count = reviews.length;
  const average = count ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;
  return { count, average, distribution };
}
