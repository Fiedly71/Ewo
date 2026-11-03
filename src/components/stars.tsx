import { StarIcon } from "./icons";

export function Stars({ rating, className = "h-4 w-4" }: { rating: number; className?: string }) {
  return (
    <span className="inline-flex text-accent" aria-label={`${rating.toFixed(1)} sur 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} className={className} filled={rating >= n - 0.25} />
      ))}
    </span>
  );
}
