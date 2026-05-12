export const fabricTextureMap = {
  "single jersey": "/visuals/textures/single-jersey-texture.jpg",
  "single-jersey": "/visuals/textures/single-jersey-texture.jpg",
  "sj": "/visuals/textures/single-jersey-texture.jpg",

  rib: "/visuals/textures/rib-texture.jpg",

  interlock: "/visuals/textures/interlock-texture.jpg",

  compact: "/visuals/textures/compact-cotton-texture.jpg",
  "compact cotton": "/visuals/textures/compact-cotton-texture.jpg",
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

  return "/visuals/textures/single-jersey-texture.jpg";
}
