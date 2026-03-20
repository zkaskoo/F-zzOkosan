export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl animate-pulse" />
      <div className="absolute top-1/3 -right-20 h-60 w-60 rounded-full bg-yellow-400/20 blur-3xl animate-pulse [animation-delay:1s]" />
      <div className="absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-secondary/20 blur-3xl animate-pulse [animation-delay:2s]" />
    </div>
  );
}
