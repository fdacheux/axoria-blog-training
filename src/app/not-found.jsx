import Link from "next/link";

export default function NotFound() {
  return (
    <div className="pt-44 text-center">
      <h1 className="t-main-title">404 - Page not found 😢</h1>
      <p className="mb-2 italic text-red-400">Could not find requested resource</p>

      <Link href="/" className="underline">
        Return home
      </Link>
    </div>
  );
}
