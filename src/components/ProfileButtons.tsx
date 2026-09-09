"use client";

import { useState } from "react";
import {
  MailIcon,
  GitHubIcon,
  LinkedInIcon,
  DownloadIcon,
  SubstackIcon,
  InstagramIcon,
  SoundCloudIcon,
} from "./icons";
import type { IconProps } from "./icons";

// Obfuscated so naive email scrapers can't find a contiguous "name@domain".
const EMAIL = "wangcary19" + String.fromCharCode(64) + "gmail.com";

function CheckIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

const linkClass =
  "corner-frame corner-frame-sm flex h-11 w-11 items-center justify-center border border-blue-300/20 bg-blue-400/5 text-white/80 transition hover:border-blue-300/50 hover:bg-[#0c1a2f] hover:text-white";

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // fallback for older/insecure contexts
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
}

export default function ProfileButtons() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await copyText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — ignore
    }
  };

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={copyEmail}
        aria-label={copied ? "Email copied" : "Copy email address"}
        title={copied ? "Copied!" : "Copy email"}
        className={linkClass}
      >
        {copied ? (
          <CheckIcon className="h-5 w-5" />
        ) : (
          <MailIcon className="h-5 w-5" />
        )}
      </button>

      <a
        href="https://github.com/wangcary19"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        title="GitHub"
        className={linkClass}
      >
        <GitHubIcon className="h-5 w-5" />
      </a>

      <a
        href="https://www.linkedin.com/in/carywang/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        title="LinkedIn"
        className={linkClass}
      >
        <LinkedInIcon className="h-5 w-5" />
      </a>

      <a
        href="/resume.pdf"
        download="Cary-Wang-Resume.pdf"
        aria-label="Resume"
        title="Resume"
        className={linkClass}
      >
        <DownloadIcon className="h-5 w-5" />
      </a>

      <a
        href="https://wangcary.substack.com/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Substack"
        title="Substack"
        className={linkClass}
      >
        <SubstackIcon className="h-5 w-5" />
      </a>

      <a
        href="https://www.instagram.com/caryw_/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        title="Instagram"
        className={linkClass}
      >
        <InstagramIcon className="h-5 w-5" />
      </a>

      <a
        href="https://soundcloud.com/cart_tracks"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="SoundCloud"
        title="SoundCloud"
        className={linkClass}
      >
        <SoundCloudIcon className="h-5 w-5" />
      </a>
    </div>
  );
}
