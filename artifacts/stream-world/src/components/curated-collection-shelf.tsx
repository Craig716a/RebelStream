import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import type { TitleDetails } from "@workspace/api-client-react";
import {
  curatedCollections,
  findCuratedCollectionsForTitle,
} from "@/lib/curated-collections";

export function CuratedCollectionShelf({
  heading = "Curated collections",
}: {
  heading?: string;
}) {
  return (
    <section className="collection-shelf" aria-labelledby="curated-collection-heading">
      <div className="section-toolbar">
        <div>
          <span className="eyebrow">RebelStream curation</span>
          <h2 id="curated-collection-heading">{heading}</h2>
        </div>
      </div>
      <div className="collection-card-grid">
        {curatedCollections.map((collection) => (
          <Link
            key={collection.slug}
            href={`/collections/${collection.slug}`}
            className="collection-card"
            data-testid={`link-collection-${collection.slug}`}
          >
            <span className="collection-card-eyebrow">{collection.eyebrow}</span>
            <strong>{collection.title}</strong>
            <span className="collection-card-description">{collection.description}</span>
            <span className="collection-card-action">
              Explore collection <ChevronRight size={15} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function RelatedCollectionLinks({ title }: { title: TitleDetails }) {
  const collections = findCuratedCollectionsForTitle(title);
  if (collections.length === 0) return null;

  return (
    <div className="related-collection-links">
      <span className="eyebrow">Explore related collections</span>
      <div className="related-collection-chips">
        {collections.map((collection) => (
          <Link
            key={collection.slug}
            href={`/collections/${collection.slug}`}
            className="related-collection-chip"
            data-testid={`link-related-collection-${collection.slug}`}
          >
            {collection.title} <ChevronRight size={13} />
          </Link>
        ))}
      </div>
    </div>
  );
}
