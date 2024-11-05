export default function SquaresBackground() {
  // This component renders a background with a squares pattern
  // The background takes up the full size of the screen and fades from top to bottom
  return (
    <div className="absolute inset-0 -z-20 max-h-svh max-w-[100svw] bg-[url('/squares-background.svg')] bg-cover bg-center bg-no-repeat opacity-50 before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-b before:from-transparent before:to-background xl:opacity-100"></div>
  );
}
