import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL;

export async function POST(request) {
  try {
    const { slug, password } = await request.json();

    console.log('Verifying password for slug:', slug);

    if (!password) {
      return NextResponse.json({ success: false, message: 'Password required' });
    }

    // Verify password by fetching with it
    const url = `${WP_API_URL}/wp/v2/pages?slug=${slug}&status=publish&password=${password}`;
   
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json({ success: false, message: 'Failed to verify password' });
    }

    const data = await response.json();
  
    const pageData = data[0];

    if (!pageData) {
      return NextResponse.json({ success: false, message: 'Page not found' });
    }

    // Check multiple conditions for successful authentication
    const isAuthenticated = 
      (pageData.content && !pageData.content.protected) || // Content not protected anymore
      (pageData.content && pageData.content.rendered && pageData.content.rendered.length > 0); // Has actual content

    if (isAuthenticated) {
     
      // Store password in cookie
      const cookieStore = await cookies();
      cookieStore.set(`page_password_${slug}`, password, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, message: 'Incorrect password' });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}