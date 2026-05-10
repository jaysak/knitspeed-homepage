export default function SEOJsonLd({ schema }) {
  if (!schema) {
    return null;
  }

  const schemas = Array.isArray(schema) ? schema : [schema];

  return (
    <>
      {schemas.filter(Boolean).map((item, index) => (
        <script
          key={item["@id"] || item.name || index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
