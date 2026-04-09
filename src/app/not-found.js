import { DivTag, H1Tag, PTag } from '@/components/Common/HTMLTags';
import { ArrowLeftWhite } from '@/components/Common/Icons';
import Link from 'next/link';

export default function Custom404() {
  return (
    <DivTag className="d-flex flex-column justify-content-center align-items-center text-center min-vh-100 not-found-page">
      <H1Tag className="display-4">404 - Page Not Found</H1Tag>
      <PTag className="lead">Sorry, the page you are looking for does not exist.</PTag>
      <Link href="/" className="btn primary-btn mt-3">
        <ArrowLeftWhite className="white-color" /> Go Back Homes
      </Link>
    </DivTag>
  );
}
