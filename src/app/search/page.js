import { Suspense } from 'react';
import SearchResultsClient from './SearchResultsClient';

// Loading component for suspense fallback
function SearchLoading() {
  return (
    <>
      <style>{`
        .spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{ 
        textAlign: 'center', 
        padding: '60px 0',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        <div className="spinner" style={{ 
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #007cba',
          borderRadius: '50%',
          marginBottom: '20px'
        }}></div>
        <p>Loading search page...</p>
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchResultsClient />
    </Suspense>
  );
}