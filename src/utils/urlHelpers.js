export const normalizeUrl = (url) => {
  if (!url) return "/";
  if (url.startsWith("http")) return url;
  if (!url.startsWith("/")) return `/${url}`;
  return url;
};
