
import Link from 'next/link';
import { fetchCategories } from '@/lib/wordpress';
import { DivTag, H3Tag, H4Tag, LITag, SectionTag, SpanTag, ULTag } from '../Common/HTMLTags';

export default async function BlogCategoryList({ currentCategory = null, showPostCount = true }) {
    try {
        const categories = await fetchCategories();
        if (!categories || categories.length === 0) {
            return null;
        }
        return (
            <>
                <SectionTag className="blog-categories">
                    <DivTag className="container">
                        <DivTag className="sub-section">
                            <DivTag className="row">
                                <DivTag className="col-md-12">
                                <H4Tag> Search By Category</H4Tag>
                                <ULTag className="list-group list-group-horizontal">
                                    <LITag className={`${!currentCategory ? 'active-category' : ''
                                        }`}>
                                        <Link
                                            href="/blog"
                                            className={`text-decoration-none`}
                                        >
                                            <SpanTag>All Posts</SpanTag>
                                        </Link>
                                    </LITag>
                                    {categories.map((category) => (
                                        <LITag key={category.id} className={` ${currentCategory === category.slug ? 'active-category' : ''
                                            }`}>
                                            <Link
                                                href={`/blog/category/${category.slug}`}
                                                className={`text-decoration-none`}
                                            >
                                                <SpanTag>{category.name}</SpanTag>
                                            </Link>
                                        </LITag>
                                    ))}
                                </ULTag>
                            </DivTag>
                            </DivTag>
                        </DivTag>
                    </DivTag>
                </SectionTag>

            </>
        );
    } catch (error) {
        console.error('Error fetching categories:', error);
        return null;
    }
}