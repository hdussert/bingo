/** "Bingo!" in the middle of the screen, its letters bouncing in one after the other, then fading out. */
export default function BingoBanner() {
  return (
    <p
      role="status"
      className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center font-heading text-8xl text-cartoon animate-[banner-out_300ms_ease-in_1700ms_forwards] motion-reduce:animate-none"
    >
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
