export async function fetchRankMathMeta(slug) {
  const WP_SITE = process.env.NEXT_PUBLIC_WP_URL;
  const fullURL = `${WP_SITE}${slug}`;
  const apiURL = `${WP_SITE}/wp-json/rankmath/v1/getHead?url=${fullURL}`;

  const res = await fetch(apiURL, {
    next: { revalidate: 3600 }, // cache it for 1 hour
  });

  if (!res.ok) {
    console.error(`Failed to fetch Rank Math meta for ${slug}`);
    return null;
  }

  const data = await res.json();
  return data?.head || null; // includes <title>, <meta>, <script>
}
