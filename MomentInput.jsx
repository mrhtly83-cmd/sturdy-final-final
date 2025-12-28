import React, { useState } from "react";

const emotions = ["Angry", "Overwhelmed", "Frustrated", "Nervous", "Sad"];
const contexts = ["Home", "Public", "School", "Bedtime", "Screen time"];

export default function MomentInput({ onChange }) {
  const [emotion, setEmotion] = useState("");
  const [context, setContext] = useState("");
  const [note, setNote] = useState("");
  const [touched, setTouched] = useState(false);

  const hasValue = emotion || context || note.trim();
  const showError = touched && !hasValue;

  const handleSuggest = () => {
    const suggestion = "She screamed when her toy broke and stormed into the hallway.";
    setNote(suggestion);
    setEmotion("Frustrated");
    setContext("Home");
    onChange?.({ emotion: "Frustrated", context: "Home", note: suggestion });
  };

  const handleChange = (field, value) => {
    setTouched(true);
    if (field === "emotion") setEmotion(value);
    if (field === "context") setContext(value);
    if (field === "note") setNote(value);
    if (onChange) {
      onChange({
        emotion: field === "emotion" ? value : emotion,
        context: field === "context" ? value : context,
        note: field === "note" ? value : note,
      });
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <label className="font-body text-sm uppercase tracking-[0.3em] text-white/70">
        What’s happening right now?
      </label>
      <div className="flex flex-col gap-3 md:flex-row">
        <select
          className="flex-1 rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-base text-white placeholder-white/50 transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300/50"
          value={emotion}
          onChange={(e) => handleChange("emotion", e.target.value)}
        >
          <option value="" disabled>
            Select an emotion
          </option>
          {emotions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          className="flex-1 rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-base text-white placeholder-white/50 transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300/50"
          value={context}
          onChange={(e) => handleChange("context", e.target.value)}
        >
          <option value="" disabled>
            Select context
          </option>
          {contexts.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <textarea
        className="min-h-[120px] w-full rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white placeholder-white/60 transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300/50"
        placeholder="She screamed when her toy broke..."
        value={note}
        onChange={(e) => handleChange("note", e.target.value)}
      />
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <button
          type="button"
          className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white/20"
          onClick={handleSuggest}
        >
          Suggest based on last use
        </button>
        {showError && (
          <p className="text-xs text-rose-300">
            Please pick an emotion, context, or add a note to continue.
          </p>
        )}
      </div>
    </div>
  );
}
