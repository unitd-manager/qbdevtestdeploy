// app/blog/[slug]/loading.js
export default function Loading() {
  return (
    <div className="container py-5 text-center">
      <div className="spinner-border text-primary" role="status" />
      <p className="mt-3">Loading post...</p>
    </div>
  );
}
