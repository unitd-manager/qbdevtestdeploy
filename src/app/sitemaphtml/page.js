import { DivTag, H1Tag, H2Tag, LITag, SectionTag, SpanTag, ULTag } from '@/components/Common/HTMLTags';
import { fetchFieldsPages, fetchFieldsPosts } from '@/lib/wordpress';
import Link from 'next/link';

export const metadata = {
    title: 'Sitemap',
    description: 'HTML Sitemap of the website',
};

export default async function SitemapPage() {
    // Fetch pages and posts
    const [pages, posts] = await Promise.all([fetchFieldsPages(), fetchFieldsPosts()]);

    if (!pages.length && !posts.length) {
        return <p>Failed to load sitemap.</p>;
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Function to build hierarchical page structure
    const buildPageHierarchy = (pages) => {
        const pageMap = {};
        const rootPages = [];

        // Create a map of all pages
        pages.forEach(page => {
            pageMap[page.id] = { ...page, children: [] };
        });

        // Build the hierarchy
        pages.forEach(page => {
            if (page.parent && pageMap[page.parent]) {
                pageMap[page.parent].children.push(pageMap[page.id]);
            } else {
                rootPages.push(pageMap[page.id]);
            }
        });

        return rootPages;
    };

    // Recursive component to render page hierarchy
    const PageItem = ({ page, level = 0 }) => {
        const indentClass = level > 0 ? `ml-${level * 6}` : '';

        return (
            <>
                <LITag className={`page-item ${indentClass}`}>
                    <Link
                        href={page.url}
                        className="page-link"
                    >
                        <SpanTag dangerouslySetInnerHTML={{ __html: page.title }} />
                    </Link>
                    {page.date && (
                        <SpanTag className="page-date">
                            ({formatDate(page.date)})
                        </SpanTag>
                    )}
                </LITag>
                {page.children && page.children.length > 0 &&
                    page.children.map((child, i) => (
                        <PageItem key={child.id} page={child} level={level + 1} />
                    ))
                }
            </>
        );
    };

    const hierarchicalPages = buildPageHierarchy(pages);

    return (
        <SectionTag className="sitemap-html-section">
            <DivTag className="container">
                <DivTag className="sub-section">
                <H1Tag className="main-title">Sitemap</H1Tag>
                {pages.length > 0 && (
                    <DivTag>
                        <H2Tag className="section-title">Pages</H2Tag>
                        <ULTag className="sitemap-list">
                            {hierarchicalPages.map((page) => (
                                <PageItem key={page.id} page={page} />
                            ))}
                        </ULTag>
                    </DivTag>
                )}

                {posts.length > 0 && (
                    <DivTag>
                        <H2Tag className="section-title">Posts</H2Tag>
                        <ULTag className="sitemap-list">
                            {posts.map((post, i) => (
                                <LITag key={i} className="page-item">
                                    <Link
                                        href={post.url}
                                        className="page-link"
                                    >
                                        <SpanTag dangerouslySetInnerHTML={{ __html: post.title }} />
                                    </Link>
                                    {post.date && (
                                        <SpanTag className="page-date">
                                            ({formatDate(post.date)})
                                        </SpanTag>
                                    )}
                                </LITag>
                            ))}
                        </ULTag>
                    </DivTag>
                )}
                <DivTag className="sitemap-footer">
                    Total: {pages.length + posts.length} pages
                </DivTag>
            </DivTag>
            </DivTag>
        </SectionTag>
    );
}