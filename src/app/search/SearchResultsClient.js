'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { DivTag, H1Tag, PTag, SectionTag } from '../../components/Common/HTMLTags';
import Link from 'next/link';
import SearchSection from '../../components/Layout/home-search';
import Image from 'next/image';
import { ArrowRight } from '@/components/Common/Icons';


export default function SearchResultsClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const keywords = searchParams.get('keywords');
  const intent = searchParams.get('intent');
  const category = searchParams.get('category');
  
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // WordPress API configuration
  const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WP_API_URL;

  const performSearch = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const keywordArray = keywords ? keywords.split(',').map(k => k.trim()) : [query];
      const searchQuery = keywordArray.join(' ');
      
      // Search both posts and pages in parallel
      const [postsResponse, pagesResponse] = await Promise.all([
        fetch(`${WORDPRESS_API_URL}/wp/v2/posts?search=${encodeURIComponent(searchQuery)}&per_page=15&_embed&orderby=relevance`),
        fetch(`${WORDPRESS_API_URL}/wp/v2/pages?search=${encodeURIComponent(searchQuery)}&per_page=20&_embed&acf_format=standard&orderby=relevance`)
      ]);

      let posts = [];
      let pages = [];

      // Process posts response
      if (postsResponse.ok) {
        posts = await postsResponse.json();
        posts = posts.map(post => ({ ...post, content_type: 'post' }));
      }

      // Process pages response with ACF search
      if (pagesResponse.ok) {
        const pagesData = await pagesResponse.json();
        
        // Filter pages that match the search query in ACF fields or content
        const filteredPages = pagesData.filter(page => {
          const searchLower = searchQuery.toLowerCase();
          
          // Search in title and content
          const titleMatch = page.title.rendered.toLowerCase().includes(searchLower);
          const contentMatch = page.content.rendered.toLowerCase().includes(searchLower);
          
          // Search in ACF fields if they exist
          let acfMatch = false;
          if (page.acf) {
            acfMatch = Object.values(page.acf).some(value => {
              if (typeof value === 'string') {
                return value.toLowerCase().includes(searchLower);
              }
              if (typeof value === 'object' && value !== null) {
                return JSON.stringify(value).toLowerCase().includes(searchLower);
              }
              return false;
            });
          }
          
          return titleMatch || contentMatch || acfMatch;
        });
        
        pages = filteredPages.map(page => ({ ...page, content_type: 'page' }));
      }

      // Combine results
      let combinedResults = [...pages, ...posts]; // Pages first, then posts

      // If no results with keywords, try with original query
      if (combinedResults.length === 0 && keywords) {
        const [fallbackPostsResponse, fallbackPagesResponse] = await Promise.all([
          fetch(`${WORDPRESS_API_URL}/wp/v2/posts?search=${encodeURIComponent(query)}&per_page=15&_embed&orderby=relevance`),
          fetch(`${WORDPRESS_API_URL}/wp/v2/pages?search=${encodeURIComponent(query)}&per_page=20&_embed&acf_format=standard&orderby=relevance`)
        ]);

        let fallbackPosts = [];
        let fallbackPages = [];

        if (fallbackPostsResponse.ok) {
          fallbackPosts = await fallbackPostsResponse.json();
          fallbackPosts = fallbackPosts.map(post => ({ ...post, content_type: 'post' }));
        }

        if (fallbackPagesResponse.ok) {
          const fallbackPagesData = await fallbackPagesResponse.json();
          
          // Filter pages for fallback search
          const fallbackFilteredPages = fallbackPagesData.filter(page => {
            const searchLower = query.toLowerCase();
            
            const titleMatch = page.title.rendered.toLowerCase().includes(searchLower);
            const contentMatch = page.content.rendered.toLowerCase().includes(searchLower);
            
            let acfMatch = false;
            if (page.acf) {
              acfMatch = Object.values(page.acf).some(value => {
                if (typeof value === 'string') {
                  return value.toLowerCase().includes(searchLower);
                }
                if (typeof value === 'object' && value !== null) {
                  return JSON.stringify(value).toLowerCase().includes(searchLower);
                }
                return false;
              });
            }
            
            return titleMatch || contentMatch || acfMatch;
          });
          
          fallbackPages = fallbackFilteredPages.map(page => ({ ...page, content_type: 'page' }));
        }

        combinedResults = [...fallbackPages, ...fallbackPosts];
      }

      setSearchResults(combinedResults);
      
    } catch (err) {
      setError('Failed to load search results. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, [query, keywords, WORDPRESS_API_URL]);

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query, performSearch]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const getContentTypeLabel = (contentType) => {
    return contentType === 'page' ? 'Page' : 'Article';
  };

  const getContentTypeIcon = (contentType) => {
    return contentType === 'page' ? '📄' : '📝';
  };

  // Generate slug from title for internal routing
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim('-'); // Remove leading/trailing hyphens
  };

  return (
    <>
      {/* Search Section at the top */}
      <SearchSection />
      
      {/* Search Results Section */}
      <SectionTag className="search-results-section">
        <DivTag className="container">
          <DivTag className="sub-section">
            
            {/* Search Results Header */}
            <DivTag className="search-header">
              <H1Tag className="search-title">
                Search Results
              </H1Tag>
              
              {!loading && searchResults.length > 0 && (
                <PTag className="search-meta">
                  Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for <span className="query-highlight">{query}</span>
                </PTag>
              )}
            </DivTag>

            {/* Loading State */}
            {loading && (
              <DivTag className="loading-container">
                <DivTag className="loading-spinner"></DivTag>
                <PTag>Searching posts and pages...</PTag>
              </DivTag>
            )}

            {/* Error Message */}
            {error && (
              <DivTag className="error-message">
                <strong>Error:</strong> {error}
              </DivTag>
            )}

            {/* No Results Message */}
            {!loading && searchResults.length === 0 && !error && (
              <DivTag className="no-results">
                <H1Tag className="no-results-title">
                  No Results Found
                </H1Tag>
                <PTag className="no-results-desc">
                  We could not find any posts or pages for <strong>{query}</strong>
                </PTag>
                <PTag className="no-results-suggestion">
                  Try different keywords or check your spelling.
                </PTag>
              </DivTag>
            )}

            {/* Search Results Grid */}
            {!loading && searchResults.length > 0 && (
              <DivTag className="row search-results-grid">
                {searchResults.map((item, index) => {
                  const slug = generateSlug(stripHtml(item.title.rendered));
                  const internalPath = item.content_type === 'page' ? `/${slug}` : `/${slug}`;
                  
                  return (
                    <DivTag key={`${item.content_type}-${item.id}`} className="col-lg-4 col-md-6 col-sm-12 search-result-col">
                      <DivTag className="search-result-card">
                        
                        {/* Content Type Badge */}
                        {/* <DivTag className={`content-type-badge ${item.content_type}`}>
                          {getContentTypeIcon(item.content_type)} {getContentTypeLabel(item.content_type)}
                        </DivTag> */}

                        {/* Featured Image Container */}
                        <DivTag className="card-image-container">
                          {item._embedded && item._embedded['wp:featuredmedia'] ? (
                            <Image 
                              src={item._embedded['wp:featuredmedia'][0].source_url} 
                              alt={item.title.rendered}
                              width={390}
                              height={220}
                              className="card-image"
                            />
                          ) : (
                            <DivTag className="card-image-placeholder">
                              {getContentTypeIcon(item.content_type)}
                            </DivTag>
                          )}
                          <DivTag className="image-overlay"></DivTag>
                        </DivTag>

                        {/* Card Content */}
                        <DivTag className="card-content">
                          
                          {/* Title */}
                          <H1Tag className="card-title">
                            {stripHtml(item.title.rendered)}
                          </H1Tag>

                          {/* Meta Information */}
                          <DivTag className="card-meta">
                            <span className="meta-item">
                              <span className="meta-icon">📅</span>
                              {formatDate(item.date)}
                            </span>
                            {item._embedded && item._embedded.author && (
                              <span className="meta-item">
                                <span className="meta-icon">👤</span>
                                {item._embedded.author[0].name}
                              </span>
                            )}
                          </DivTag>

                          {/* Content Excerpt */}
                          <PTag className="card-excerpt">
                            {stripHtml(item.excerpt.rendered).substring(0, 120)}...
                          </PTag>

                          {/* Categories (for posts) */}
                          {item.content_type === 'post' && item._embedded && item._embedded['wp:term'] && item._embedded['wp:term'][0] && (
                            <DivTag className="card-categories">
                              {item._embedded['wp:term'][0].slice(0, 2).map((category) => (
                                <span key={category.id} className="category-tag">
                                  {category.name}
                                </span>
                              ))}
                            </DivTag>
                          )}

                          {/* ACF Fields Preview (for pages with ACF data) */}
                          {item.content_type === 'page' && item.acf && Object.keys(item.acf).length > 0 && (
                            <DivTag className="acf-preview">
                              <DivTag className="acf-content">
                                {Object.entries(item.acf).slice(0, 1).map(([key, value]) => (
                                  <div key={key} className="acf-item">
                                    <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong> {
                                      typeof value === 'string' ? value.substring(0, 60) + (value.length > 60 ? '...' : '') : 
                                      typeof value === 'object' ? JSON.stringify(value).substring(0, 60) + '...' : 
                                      String(value)
                                    }
                                  </div>
                                ))}
                              </DivTag>
                            </DivTag>
                          )}

                          {/* Read More Button */}
                          <DivTag className="card-actions">
                            <Link href={internalPath} className="btn primary-btn">
                              READ MORE
                              <ArrowRight />
                            </Link>
                            
  
                          </DivTag>
                        </DivTag>
                      </DivTag>
                    </DivTag>
                  );
                })}
              </DivTag>
            )}

            {/* Back to Home Search */}
            <DivTag className="back-to-search">
              <Link href="/" className="back-home-btn">
                ← Back to Home
              </Link>
            </DivTag>
          </DivTag>
        </DivTag>
      </SectionTag>
    </>
  );
}