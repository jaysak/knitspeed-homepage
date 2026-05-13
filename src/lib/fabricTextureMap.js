export const fabricTextureMap = {
  "single jersey": "/textures/single-jersey.jpg",
  "single-jersey": "/textures/single-jersey.jpg",
  "sj": "/textures/single-jersey.jpg",

  rib: "/textures/rib.jpg",

  interlock: "/textures/interlock.jpg",

  compact: "/textures/compact-cotton.jpg",
  "compact cotton": "/textures/compact-cotton.jpg",
};

export function getFabricTexture(article = {}) {
  const searchable = [
    article.article_name,
    article.slug,
    article.category,
    article.structure,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  for (const key of Object.keys(fabricTextureMap)) {
    if (searchable.includes(key)) {
      return fabricTextureMap[key];
    }
  }

  return "/textures/single-jersey.jpg";
}
