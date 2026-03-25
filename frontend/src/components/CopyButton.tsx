"use client";

import { useState } from "react";

interface CopyButtonProps {
    text: string;
    className?: string;
}

export default function CopyButton({ text, className = "" }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const el = document.createElement("textarea");
            el.value = text;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="relative inline-flex items-center">
            <button
                onClick={handleCopy}
                aria-label="Copy to clipboard"
                className={`rounded-lg border border-white/10 p-1.5 text-slate-400 transition-all hover:border-mint/40 hover:text-mint active:scale-95 ${className}`}
            >
                {copied ? (
                    // Checkmark icon
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-mint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                ) : (
                    // Clipboard icon
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                )}
            </button>
            {copied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-mint/30 bg-tide px-2 py-1 font-mono text-xs text-mint shadow-lg">
                    Copied!
                </span>
            )}
        </div>
    );
}
