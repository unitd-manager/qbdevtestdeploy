'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { DivTag, H1Tag, PTag, SectionTag } from '../Common/HTMLTags';
import Link from 'next/link';
import Slider from 'react-slick';
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

const suggestions = [ 
  'Agentic AI Workflows in Enterprises', 
  'Generative AI for Business Automation', 
  'How AI is Transforming Healthcare', 
  'AI Orchestration with Enterprise Tools', 
  'AI in Digital Marketing Campaigns', 
  'Intelligent Document Processing Solutions', 
  'Natural Language Processing in AI Agents', 
  'Computer Vision for Diagnostics', 
  'Ethical AI and Enterprise Governance', 
  'Future of Agentic AI and Automation', 
  'Deep Learning in AI Frameworks', 
];


export default function SearchSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [instantResults, setInstantResults] = useState([]);
  const [extractedKeywords, setExtractedKeywords] = useState([]);
  const [error, setError] = useState('');
  const [showInstantResults, setShowInstantResults] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();
  const searchInputRef = useRef(null);
  const debounceRef = useRef(null);
  const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WP_API_URL;

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const savedPopular = JSON.parse(localStorage.getItem('popularSearches') || '[]');
    setSearchHistory(savedHistory);
    setPopularSearches(savedPopular);
  }, []);

  const extractKeywords = async (prompt) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const result = await model.generateContent(
        `You are an AI search assistant for Qbotica, a company specializing in AI-powered business automation and intelligent solutions. Analyze this search query and extract the most relevant keywords for finding information about business automation, AI solutions, workflow optimization, and enterprise technology.
        Query: "${prompt}"
        Focus on these key areas:
        - Business process automation
        - AI-powered solutions
        - Workflow optimization
        - Enterprise technology
        - Digital transformation
        - Business intelligence
        - Robotic process automation (RPA)
        - Machine learning applications
        - Data-driven insights
        - Operational efficiency
        Return a JSON object with:
        1. "keywords": array of 3-5 most relevant keywords for business automation and AI solutions
        2. "recommended_solutions": List of potential Qbotica solutions or approaches
        Format as valid JSON only. Do not include any markdown formatting, code blocks, or explanatory text.`
      );

      const response = await result.response;
      const text = response.text();

      try {
        const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsedResponse = JSON.parse(cleanText);

        if (!parsedResponse.keywords || !Array.isArray(parsedResponse.keywords)) {
          throw new Error('Invalid response structure');
        }

        return parsedResponse;
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Response text:', text);

        // Enhanced fallback for business automation terms
        const businessTerms = ['automation', 'AI', 'workflow', 'process', 'optimization'];
        const keywordMatch = text.match(/keywords['":\s]*\[([^\]]+)\]/i);
        let fallbackKeywords = businessTerms;

        if (keywordMatch) {
          fallbackKeywords = keywordMatch[1]
            .split(',')
            .map(k => k.replace(/['"]/g, '').trim())
            .filter(k => k);
        }

        // If still no useful keywords, use business-relevant terms
        if (fallbackKeywords.length === 0) {
          fallbackKeywords = [prompt, 'business automation', 'AI solutions'];
        }

        return {
          keywords: fallbackKeywords,
          recommended_solutions: 'general'
        };
      }
    } catch (error) {
     
      return {
        keywords: [prompt, 'business automation', 'AI solutions'],
        recommended_solutions: 'general'
      };
    }
  };

  // Simplified WordPress search without AI ranking
  const searchWordPressPosts = async (prompt, aiAnalysis) => {
    try {
      const { keywords } = aiAnalysis;
      const allSearchTerms = [...keywords];
      const searchQuery = allSearchTerms.join(' ');

      // Search both posts and pages in parallel
      const [postsResponse, pagesResponse] = await Promise.all([
        // Search posts
        fetch(`${WORDPRESS_API_URL}/wp/v2/posts?search=${encodeURIComponent(searchQuery)}&per_page=15&_embed&orderby=relevance`),
        // Search pages
        fetch(`${WORDPRESS_API_URL}/wp/v2/pages?search=${encodeURIComponent(searchQuery)}&per_page=10&_embed&orderby=relevance`)
      ]);

      let posts = [];
      let pages = [];

      // Process posts response
      if (postsResponse.ok) {
        posts = await postsResponse.json();
        posts = posts.map(post => ({ ...post, content_type: 'post' }));
      }

      // Process pages response
      if (pagesResponse.ok) {
        pages = await pagesResponse.json();
        pages = pages.map(page => ({ ...page, content_type: 'page' }));
      }

      // Combine results
      let combinedResults = [...posts, ...pages];

      // If no results with AI keywords, fallback to original prompt
      if (combinedResults.length === 0) {
        const [fallbackPostsResponse, fallbackPagesResponse] = await Promise.all([
          fetch(`${WORDPRESS_API_URL}/wp/v2/posts?search=${encodeURIComponent(prompt)}&per_page=15&_embed&orderby=relevance`),
          fetch(`${WORDPRESS_API_URL}/wp/v2/pages?search=${encodeURIComponent(prompt)}&per_page=10&_embed&orderby=relevance`)
        ]);

        if (fallbackPostsResponse.ok) {
          const fallbackPosts = await fallbackPostsResponse.json();
          combinedResults = [...combinedResults, ...fallbackPosts.map(post => ({ ...post, content_type: 'post' }))];
        }

        if (fallbackPagesResponse.ok) {
          const fallbackPages = await fallbackPagesResponse.json();
          combinedResults = [...combinedResults, ...fallbackPages.map(page => ({ ...page, content_type: 'page' }))];
        }
      }

      // Sort results by relevance (pages first, then posts)
      combinedResults.sort((a, b) => {
        if (a.content_type === 'page' && b.content_type === 'post') return -1;
        if (a.content_type === 'post' && b.content_type === 'page') return 1;
        return 0;
      });

      return combinedResults;
    } catch (error) {
      console.error('Error searching WordPress content:', error);
      throw error;
    }
  };

 // Instant search as user types - now includes both posts and pages
const handleInstantSearch = async (query) => {
  if (!query.trim() || query.length < 3) {
    setInstantResults([]);
    setShowInstantResults(false);
    return;
  }

  try {
   
    const [postsResponse, pagesResponse] = await Promise.all([
      fetch(`${WORDPRESS_API_URL}/wp/v2/posts?search=${encodeURIComponent(query)}&per_page=5&_embed`),
      fetch(`${WORDPRESS_API_URL}/wp/v2/pages?search=${encodeURIComponent(query)}&per_page=20&_embed&acf_format=standard`)
    ]);
    let results = [];

    if (postsResponse.ok) {
      const posts = await postsResponse.json();
      results = [...results, ...posts.map(post => ({ ...post, content_type: 'post' }))];
    }

    if (pagesResponse.ok) {
      const pages = await pagesResponse.json();
      results = [...results, ...pages.map(page => ({ ...page, content_type: 'page' }))];
    }

    results.sort((a, b) => {
      if (a.content_type === 'page' && b.content_type === 'post') return -1;
      if (a.content_type === 'post' && b.content_type === 'page') return 1;
      return 0;
    });

    // Limit total results to 10 for instant search
    results = results.slice(0, 10);
    setInstantResults(results);
    setShowInstantResults(true);
  } catch (error) {
    console.error('Instant search error:', error);
  }
};

  // Debounced instant search
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsTyping(true);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setIsTyping(false);
      handleInstantSearch(value);
    }, 300);
  };

  // Main search function
  const handleSearch = async (query = searchTerm) => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setSearchResults([]);
    setExtractedKeywords([]);
    setShowInstantResults(false);

    try {
      // Step 1: AI-powered query analysis
      const aiAnalysis = await extractKeywords(query.trim());
      setExtractedKeywords(aiAnalysis.keywords);
      // Step 2: Enhanced search (without AI ranking)
      const posts = await searchWordPressPosts(query.trim(), aiAnalysis);
      setSearchResults(posts);

      // Step 3: Update search history
      updateSearchHistory(query.trim());

      // Step 4: Navigate to results page
      router.push(`/search?query=${encodeURIComponent(query.trim())}&keywords=${encodeURIComponent(aiAnalysis.keywords.join(','))}`);

    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update search history
  const updateSearchHistory = (query) => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const updatedHistory = [query, ...history.filter(h => h !== query)].slice(0, 10);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    setSearchHistory(updatedHistory);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowInstantResults(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = async (value) => {
    setSearchTerm(value);
    setShowInstantResults(false);
    await handleSearch(value);
  };

  // Handle instant result click
  const handleInstantResultClick = (post) => {
    setShowInstantResults(false);
    router.push(`/${post.slug}`);
  };

  // Auto-complete and suggestions
  const getAutocompleteSuggestions = () => {
    if (!searchTerm.trim()) return [];

    const filtered = suggestions.filter(s =>
      s.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filtered.slice(0, 5);
  };

  const sliderSettingsLTR = {
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    speed: 4000,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: 'linear',
    arrows: false,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  const sliderSettingsRTL = {
    ...sliderSettingsLTR,
    rtl: true,
  };

  return (
    <SectionTag className="home-search-section">
      <DivTag className="container">
        <DivTag className="sub-section">
          <DivTag className="row">
            <DivTag className="col-md-12 p-0">
              <DivTag className="section-head">
                <H1Tag className="main-title">
                  <span className="text-bold">qBotica AI Agent </span>
                  <span className="search-highlight">
                    <span className="text-only">Search</span>
                  </span>
                </H1Tag>
                <PTag className="sub-text">
                  Ask a question or select a prompt
                </PTag>
              </DivTag>

              <DivTag className="searchbar-wrapper" style={{ position: 'relative' }}>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => searchTerm.length >= 3 && setShowInstantResults(true)}
                  disabled={loading}
                  placeholder="Ask anything about AI, automation, or technology..."
                />
                <button
                  onClick={() => handleSearch()}
                  disabled={loading || !searchTerm.trim()}
                >
                  {loading ? 'SEARCHING...' : 'SEARCH'}
                </button>

                {/* Instant Results Dropdown */}
                {showInstantResults && (instantResults.length > 0 || getAutocompleteSuggestions().length > 0) && (
                  <DivTag
                    className="instant-results-dropdown"
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '0',
                      right: '0',
                      background: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      zIndex: 1000,
                      maxHeight: '400px',
                      overflowY: 'auto',
                      marginTop: '5px',
                    }}
                  >
                    {/* Autocomplete suggestions */}
                    {getAutocompleteSuggestions().length > 0 && (
                      <DivTag style={{ padding: '10px', borderBottom: '1px solid #f0f0f0' }}>
                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                          Suggestions
                        </div>
                        {getAutocompleteSuggestions().map((suggestion, index) => (
                          <div
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            style={{
                              padding: '8px 12px',
                              cursor: 'pointer',
                              borderRadius: '4px',
                              fontSize: '14px',
                              ':hover': { background: '#f5f5f5' }
                            }}
                          >
                            {suggestion}
                          </div>
                        ))}
                      </DivTag>
                    )}

                    {/* Instant search results */}
                    {instantResults.length > 0 && (
                      <DivTag style={{ padding: '10px' }}>
                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                          Quick Results
                        </div>
                        {instantResults.map((post, index) => (
                          <div
                            key={index}
                            onClick={() => handleInstantResultClick(post)}
                            style={{
                              padding: '12px',
                              cursor: 'pointer',
                              borderRadius: '4px',
                              borderBottom: index < instantResults.length - 1 ? '1px solid #f0f0f0' : 'none',
                              ':hover': { background: '#f5f5f5' }
                            }}
                          >
                            <div style={{ fontWeight: '500', fontSize: '14px', marginBottom: '4px' }}>
                              {post.title.rendered}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              {post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 100)}...
                            </div>
                          </div>
                        ))}
                      </DivTag>
                    )}
                  </DivTag>
                )}
              </DivTag>

              {/* Loading indicator */}
              {isTyping && (
                <DivTag style={{ textAlign: 'center', padding: '10px', color: '#666' }}>
                  <span>Searching...</span>
                </DivTag>
              )}

              {/* Error Message */}
              {error && (
                <DivTag className="error-message" style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
                  {error}
                </DivTag>
              )}

              {/* Search History */}
              {searchHistory.length > 0 && !searchTerm && (
                <DivTag className="search-history aligb" style={{ marginTop: '20px' }}>
                  <DivTag style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                    Recent Searches:
                  </DivTag>
                  <DivTag className="recent-search-query">
                    {searchHistory.slice(0, 5).map((query, index) => (
                      <span
                        key={index}
                        onClick={() => handleSuggestionClick(query)}
                        style={{
                          padding: '6px 12px',
                          background: '#f0f0f0',
                          borderRadius: '16px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                          ':hover': { background: '#e0e0e0' }
                        }}
                      >
                        {query}
                      </span>
                    ))}
                  </DivTag>
                </DivTag>
              )}

              {/* Suggestion Sliders */}
              <DivTag className="prompt-slider-container" style={{ marginTop: '30px' }}>
                <Slider {...sliderSettingsLTR} className="suggestion-slider">
                  {suggestions.slice(0, 6).map((item, index) => (
                    <div key={index} className="suggestion-item">
                      <Link
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSuggestionClick(item);
                        }}
                      >
                        {item}
                      </Link>
                    </div>
                  ))}
                </Slider>
              </DivTag>

              <DivTag className="prompt-slider-container" style={{ marginTop: '15px' }}>
                <Slider {...sliderSettingsRTL} className="suggestion-slider">
                  {suggestions.slice(6).map((item, index) => (
                    <div key={index} className="suggestion-item">
                      <Link
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSuggestionClick(item);
                        }}
                      >
                        {item}
                      </Link>
                    </div>
                  ))}
                </Slider>
              </DivTag>
            </DivTag>
          </DivTag>
        </DivTag>
      </DivTag>
    </SectionTag>
  );
}