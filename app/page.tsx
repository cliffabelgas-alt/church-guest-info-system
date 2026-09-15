import Link from "next/link";

export default function HomePage() {
  return (
    <div className="card">
      <h1>Welcome!</h1>
      <p className="subtitle">
        Helping us welcome and follow up with every guest who visits us for
        the first time.
      </p>
      <div className="actions">
        <Link href="/new-guest" className="button">
          New Guest
        </Link>
      </div>
    </div>
  );
}
