/** "Bingo!" over the grid, its letters bouncing in one after the other, then fading out. */
export default function BingoBanner() {
  return (
    <p
      role="status"
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center font-heading text-7xl text-cartoon animate-[banner-out_300ms_ease-in_1700ms_forwards] motion-reduce:animate-none"
    >
      <span className="sr-only">Bingo!</span>
      {[..."Bingo!"].map((letter, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block animate-[letter-pop_600ms_ease-out_both] motion-reduce:animate-none"
          style={{ animationDelay: `${i * 70}ms` }}
        >
          {letter}
        </span>
      ))}
    </p>
  );
}
