'use client';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { ArrowLeft, ArrowNavLeft, ArrowRight } from '../Common/Icons';

export default function BlogPagination({ currentPage, totalPages }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const searchQuery = searchParams?.get('search');

  // Auto-detect the base path from current pathname
  const getBasePath = () => {
    if (pathname.includes('/blog/category/')) {
      const categoryMatch = pathname.match(/\/blog\/category\/([^\/]+)/);
      if (categoryMatch) {
        return `/blog/category/${categoryMatch[1]}/page`;
      }
    }
    return '/blog/page';
  };

  const basePath = getBasePath();

  const getLink = (page) => {
    let base;
    if (page === 1) {
      base = basePath.replace('/page', '');
    } else {
      base = `${basePath}/${page}`;
    }
    return searchQuery ? `${base}?search=${encodeURIComponent(searchQuery)}` : base;
  };

  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="blog-pagination">
      <ul className="pagination">
        {currentPage > 1 && (
          <li className="page-item">
            <Link className="page-link prev-page" href={getLink(currentPage - 1)}>
              <ArrowLeft /> Prev
            </Link>
          </li>
        )}
        {pages.map((page) => (
          <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
            <Link className="page-link" href={getLink(page)}>
              {page}
            </Link>
          </li>
        ))}
        {currentPage < totalPages && (
          <li className="page-item">
            <Link className="page-link next-page" href={getLink(currentPage + 1)}>
              Next <ArrowRight />
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}