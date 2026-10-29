import { useEffect, useState } from "react";
import { Bookmark, Heart, ThumbsUp } from "lucide-react";
import type { MediaType } from "@workspace/api-client-react";

type Reaction = "like" | "love" | "save";
type ReactionMap = Record<string, Reaction>;

const storageKey = "rebelstream-title-reactions-v1";
const reactionOptions: {
  value: Reaction;
  label: string;
  Icon: typeof ThumbsUp;
}[] = [
  { value: "like", label: "Like", Icon: ThumbsUp },
  { value: "love", label: "Love", Icon: Heart },
  { value: "save", label: "Save", Icon: Bookmark },
];

function readReactions(): ReactionMap {
  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return {};
    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};

    return Object.fromEntries(
      Object.entries(parsed).filter((entry): entry is [string, Reaction] =>
        entry[1] === "like" || entry[1] === "love" || entry[1] === "save",
      ),
    );
  } catch {
    return {};
  }
}

export function TitleReactions({
  mediaType,
  titleId,
}: {
  mediaType: MediaType;
  titleId: number;
}) {
  const [reactions, setReactions] = useState<ReactionMap>(readReactions);
  const key = `${mediaType}:${titleId}`;
  const selected = reactions[key];

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(reactions));
    } catch {
      // Private browsing and storage quotas can disable persistence.
    }
  }, [reactions]);

  const chooseReaction = (reaction: Reaction) => {
    setReactions((current) => {
      const next = { ...current };
      if (next[key] === reaction) delete next[key];
      else next[key] = reaction;
      return next;
    });
  };

  const selectedLabel = reactionOptions.find((option) => option.value === selected)?.label;

  return (
    <section className="title-reactions" aria-labelledby="title-reactions-heading">
      <div className="reactions-heading">
        <div>
          <span className="eyebrow">Reactions</span>
          <h2 id="title-reactions-heading">How did it land?</h2>
          <p>Choose one response. Your choice is saved on this device.</p>
        </div>
      </div>
      <div className="reaction-options">
        {reactionOptions.map(({ value, label, Icon }) => (
          <button
            key={value}
            type="button"
            className={selected === value ? "reaction-button selected" : "reaction-button"}
            aria-pressed={selected === value}
            aria-label={`${label}${selected === value ? ", selected" : ""}`}
            onClick={() => chooseReaction(value)}
            data-testid={`button-reaction-${value}`}
          >
            <Icon size={18} aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </div>
      <p className="reaction-status" role="status">
        {selectedLabel ? `${selectedLabel} is selected for this title.` : "No reaction selected yet."}
      </p>
    </section>
  );
}
