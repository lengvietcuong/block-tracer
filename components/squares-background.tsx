export default function SquaresBackground() {
  return (
    <div className="-z-20 bg-[url('/squares-background.svg')] bg-cover bg-center bg-no-repeat absolute inset-0 before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-b before:from-transparent before:to-background"></div>
  );
}
