import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="flex flex-col items-center gap-8 max-w-md">
        {/* Lost Satellite Illustration */}
        <div className="relative w-64 h-64 animate-pulse">
            <svg
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full text-mint opacity-80"
            >
                <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
                <path d="M60 100C60 77.9086 77.9086 60 100 60C122.091 60 140 77.9086 140 100" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <rect x="85" y="85" width="30" height="30" rx="4" fill="currentColor" />
                <path d="M115 100H150M50 100H85" stroke="currentColor" strokeWidth="2" />
                <path d="M100 85V50M100 115V150" stroke="currentColor" strokeWidth="2" />
                <circle cx="155" cy="100" r="4" fill="white" />
                <circle cx="45" cy="100" r="4" fill="white" />
                <circle cx="100" cy="45" r="4" fill="white" />
                <circle cx="100" cy="155" r="4" fill="white" />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-mint/10 blur-3xl rounded-full" />
        </div>

        <div className="flex flex-col gap-3">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-mint">Error 404</p>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Wait, this coordinate doesn&apos;t exist.</h1>
          <p className="text-slate-400">
            The profile or payment link you are looking for has drifted out of range. Check the URL or return to safety.
          </p>
        </div>

        <Link
          href="/"
          className="group relative flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm font-semibold text-white backdrop-blur transition-all hover:border-mint/30 hover:bg-white/10"
        >
          <span className="relative z-10 transition-colors group-hover:text-mint">Back to Dashboard</span>
          <div className="absolute inset-0 -z-10 bg-mint/20 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
        </Link>
      </div>
    </main>
  );
}
