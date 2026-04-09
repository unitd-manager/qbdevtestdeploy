import { fetchPageBySlug } from '@/lib/wordpress';
import QubiNext15Client from './QubiNext15Client';

// Import styles
import './styles.css';

export default async function QubiNext15Page() {
  let pageSections = [];

  try {
    const pageData = await fetchPageBySlug('qubi-agentic-ai-platform');
    console.log('\n===== PAGE.JS START =====');
    console.log('📡 Full Page Data:', pageData);
    console.log('📋 ACF Object:', pageData?.acf);
    console.log('🔍 page_sections field:', pageData?.acf?.page_sections);
    
    // WordPress ACF returns page_sections field
    pageSections = pageData?.acf?.page_sections || [];
    console.log('✅ Assigned pageSections:', pageSections);
    console.log('📊 pageSections length:', pageSections.length);
    console.log('📝 pageSections type:', Array.isArray(pageSections) ? 'Array' : typeof pageSections);
    
    if (Array.isArray(pageSections) && pageSections.length > 0) {
      console.log('🎯 First section:', pageSections[0]);
      console.log('🏷️ First section layout:', pageSections[0].acf_fc_layout);
    } else {
      console.log('⚠️ No sections array or empty');
    }
    console.log('===== PAGE.JS END =====\n');
  } catch (error) {
    console.error('❌ Error fetching page data:', error);
  }

  return <QubiNext15Client pageSections={pageSections} />;
}