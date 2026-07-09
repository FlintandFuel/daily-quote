import { useState } from "react";
import Button from "./Button";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function QuoteChoiceScreen({ onWriteOwn, onGenerate, generating }) {
  const [mode, setMode] = useState(null); // null | 'write' | 'generate'
  const [text, setText] = useState("");
  const [topic, setTopic] = useState("");

  return (
    <div className="flex min-h-dvh flex-col px-6 pt-14 pb-10 safe-top safe-bottom">
      <p className="text-sm font-medium text-teal-500">{greeting()}</p>
      <h1 className="mt-2 font-display text-3xl leading-tight text-teal-950 italic">
        Today's card isn't ready yet.
      </h1>
      <p className="mt-3 text-[15px] text-teal-700/80">
        Write today's quote yourself, or let it be written for you.
      </p>

      <div className="mt-10 flex flex-1 flex-col gap-4">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setMode(mode === "write" ? null : "write")}
          onKeyDown={(e) => e.key === "Enter" && setMode(mode === "write" ? null : "write")}
          className={`cursor-pointer rounded-3xl border p-5 text-left transition-all ${
            mode === "write"
              ? "border-teal-700 bg-teal-50 ring-2 ring-teal-700/20"
              : "border-teal-100 bg-white hover:border-teal-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blush text-lg">
              ✍️
            </span>
            <div>
              <p className="font-semibold text-teal-950">Write my own</p>
              <p className="text-sm text-teal-700/70">Type today's quote yourself</p>
            </div>
          </div>

          {mode === "write" && (
            <div className="mt-4 space-y-3" onClick={(e) => e.stopPropagation()}>
              <textarea
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type today's quote..."
                rows={4}
                className="w-full resize-none rounded-2xl border border-teal-200 bg-paper p-4 text-[15px] text-teal-950 placeholder:text-teal-700/40 focus:border-teal-500 focus:outline-none"
              />
              <Button
                variant="primary"
                className="w-full"
                disabled={!text.trim()}
                onClick={() => onWriteOwn(text.trim())}
              >
                Continue
              </Button>
            </div>
          )}
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => setMode(mode === "generate" ? null : "generate")}
          onKeyDown={(e) => e.key === "Enter" && setMode(mode === "generate" ? null : "generate")}
          className={`cursor-pointer rounded-3xl border p-5 text-left transition-all ${
            mode === "generate"
              ? "border-teal-700 bg-teal-50 ring-2 ring-teal-700/20"
              : "border-teal-100 bg-white hover:border-teal-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-lilac text-lg">
              ✨
            </span>
            <div>
              <p className="font-semibold text-teal-950">Get a quote for me</p>
              <p className="text-sm text-teal-700/70">Optionally name a theme</p>
            </div>
          </div>

          {mode === "generate" && (
            <div className="mt-4 space-y-3" onClick={(e) => e.stopPropagation()}>
              <input
                autoFocus
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. boundaries, burnout — or leave blank"
                className="w-full rounded-2xl border border-teal-200 bg-paper p-4 text-[15px] text-teal-950 placeholder:text-teal-700/40 focus:border-teal-500 focus:outline-none"
              />
              <Button
                variant="primary"
                className="w-full"
                disabled={generating}
                onClick={() => onGenerate(topic.trim())}
              >
                {generating ? "Writing something for you…" : "Generate"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
