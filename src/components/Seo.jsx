/**
 * Per-page <title> and <meta> tags.
 * React 19 automatically hoists these elements into the document <head>.
 */
export function Seo({ title, description, noindex = false }) {
  return (
    <>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {noindex && <meta name="robots" content="noindex" />}
    </>
  );
}
