export default function SquaresBackground() {
  // This component renders a background with a squares pattern
  // The background takes up the full size of the screen and fades from top to bottom 
  return (
    <div className="-z-20 bg-[url('/squares-background.svg')] max-w-[100svw] max-h-svh bg-cover bg-center bg-no-repeat absolute inset-0 before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-b before:from-transparent before:to-background opacity-50 xl:opacity-100"></div>
  );
}
