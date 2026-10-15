/** "Bingo!" in the middle of the screen, its letters bouncing in one after the other over a dimmed grid, then fading out. */
export default function BingoBanner() {
  return (
    <p
      role="status"
      className="pointer-events-none fixed inset-0 z-20 isolate flex items-center justify-center font-heading text-8xl text-cartoon animate-[banner-out_300ms_ease-in_1700ms_forwards] motion-reduce:animate-none"
    >
      {/* Dims the grid behind the letters */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 animate-in bg-[radial-gradient(closest-side,rgb(0_0_0/0.5),transparent)] duration-200 fade-in"
      />
      <span className="sr-only">Bingo!</span>
      <span aria-hidden className="text-cartoon-ringed">
        {[..."Bingo!"].map((letter, i) => (
          <span
            key={i}
            className="inline-block animate-[letter-pop_600ms_ease-out_both] motion-reduce:animate-none"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            {letter}
          </span>
        ))}
      </span>
    </p>
  );
}
