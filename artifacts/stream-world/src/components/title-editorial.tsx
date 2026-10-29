import {
  BookOpenText,
  Lightbulb,
  Sparkles,
  UserRound,
} from "lucide-react";
import type { TitleDetails } from "@workspace/api-client-react";
import { RelatedCollectionLinks } from "@/components/curated-collection-shelf";
import { getLanguageName } from "@/lib/editorial";

export function TitleEditorial({ title }: { title: TitleDetails }) {
  const facts: { label: string; value: string }[] = [];
  const releaseYear = title.releaseDate?.slice(0, 4);

  if (releaseYear) facts.push({ label: "Release year", value: releaseYear });
  if (title.voteAverage > 0) {
    facts.push({ label: "TMDb rating", value: `${title.voteAverage.toFixed(1)} / 10` });
  }
  if (title.voteCount > 0) {
    facts.push({ label: "TMDb votes", value: title.voteCount.toLocaleString() });
  }
  if (title.mediaType === "movie" && title.runtime) {
    facts.push({ label: "Runtime", value: `${title.runtime} min` });
  }
  if (title.mediaType === "tv" && title.numberOfSeasons !== null) {
    facts.push({ label: "Seasons", value: String(title.numberOfSeasons) });
  }
  if (title.mediaType === "tv" && title.numberOfEpisodes !== null) {
    facts.push({ label: "Episodes", value: String(title.numberOfEpisodes) });
  }
  if (title.originalLanguage) {
    facts.push({
      label: "Original language",
      value: getLanguageName(title.originalLanguage),
    });
  }

  const creativeCredit = title.mediaType === "movie"
    ? title.director
    : title.creatorNames[0] ?? null;
  const creativeLabel = title.mediaType === "movie" ? "Director" : "Created by";
  const cast = title.cast.slice(0, 4);

  return (
    <section className="title-editorial" aria-labelledby="title-editorial-heading">
      <div className="editorial-heading">
        <span className="eyebrow">Notes grounded in TMDb metadata</span>
        <h2 id="title-editorial-heading">About this title</h2>
      </div>

      <article className="editorial-card editorial-about">
        <div className="editorial-card-heading">
          <BookOpenText size={17} aria-hidden="true" />
          <h3>Story overview</h3>
        </div>
        <p>{title.overview || "A synopsis has not been listed for this title yet."}</p>
      </article>

      <div className="editorial-card-grid">
        <article className="editorial-card editorial-facts">
          <div className="editorial-card-heading">
            <Sparkles size={17} aria-hidden="true" />
            <h3>At a glance</h3>
          </div>
          {facts.length > 0 ? (
            <dl className="editorial-fact-list">
              {facts.map((fact) => (
                <div className="editorial-fact" key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="editorial-muted">More title details will appear when TMDb lists them.</p>
          )}
          {title.mediaType === "tv" && title.numberOfSeasons !== null && (
            <p className="editorial-trivia">
              TMDb lists {title.numberOfSeasons} {title.numberOfSeasons === 1 ? "season" : "seasons"}
              {title.numberOfEpisodes !== null ? ` and ${title.numberOfEpisodes} episodes` : ""}.
            </p>
          )}
          {title.mediaType === "movie" && title.runtime !== null && (
            <p className="editorial-trivia">TMDb lists a runtime of {title.runtime} minutes.</p>
          )}
        </article>

        <article className="editorial-card editorial-credits">
          <div className="editorial-card-heading">
            <UserRound size={17} aria-hidden="true" />
            <h3>{title.mediaType === "movie" ? "Director & cast" : "Creator & cast"}</h3>
          </div>
          {creativeCredit && (
            <div className="editorial-lead-credit">
              <span>{creativeLabel}</span>
              <strong>{creativeCredit}</strong>
            </div>
          )}
          {title.mediaType === "tv" && title.creatorNames.length > 1 && (
            <p className="editorial-secondary-credit">
              Also created by {title.creatorNames.slice(1, 3).join(", ")}.
            </p>
          )}
          {cast.length > 0 ? (
            <ul className="editorial-cast-list">
              {cast.map((person) => (
                <li key={person.id}>
                  <strong>{person.name}</strong>
                  {person.character && <span>{person.character}</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="editorial-muted">Cast credits have not been listed yet.</p>
          )}
        </article>

        <article className="editorial-card editorial-prompt">
          <div className="editorial-card-heading">
            <Lightbulb size={17} aria-hidden="true" />
            <h3>Scene prompt</h3>
          </div>
          <strong>Which moment would you revisit?</strong>
          <p>
            Pick a scene that changed how you read the story, then compare it with the
            premise above. There is no single correct interpretation.
          </p>
        </article>
      </div>

      <div className="editorial-tags" aria-label="Title tags">
        <span className="eyebrow">Tags</span>
        <div className="editorial-tag-list">
          <span className="editorial-tag">
            {title.mediaType === "tv" ? "TV series" : "Movie"}
          </span>
          {title.genres.map((genre) => (
            <span className="editorial-tag" key={genre.id}>{genre.name}</span>
          ))}
          {releaseYear && <span className="editorial-tag">{releaseYear}</span>}
          {title.originalLanguage && (
            <span className="editorial-tag">{getLanguageName(title.originalLanguage)}</span>
          )}
        </div>
      </div>

      <RelatedCollectionLinks title={title} />
    </section>
  );
}
