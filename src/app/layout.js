import 'bootstrap/dist/css/bootstrap.min.css'
import { Inter, Chivo_Mono, Geist, Roboto } from 'next/font/google';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './styles/default.css';
import './styles/style.css';
import './styles/responsive.css';
import './styles/custom.css';
import './styles/custom-responsive.css';
import { fetchThemeSettings, fetchMenus, fetchPageBySlug } from '@/lib/wordpress'
import Header from '@/components/Common/Header'
import Footer from '@/components/Common/Footer'
import ClientScripts from '@/components/Common/ClientScripts'

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap'
})

const chivoMono = Chivo_Mono({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-chivo-mono',
  display: 'swap'
})

const geistSans = Geist({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-geist-sans',
  display: 'swap'
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-roboto',
  display: 'swap'
});

// Add error handling for data fetching
async function getThemeData() {
  try {
 
    
    const [
      themeSettings,
      primaryMenu,
      firstFooterMenu,
      secondFooterMenu,
      thirdFooterMenu,
      fourthFooterMenu
    ] = await Promise.allSettled([
      fetchThemeSettings(),
      fetchMenus('primary-menu'),
      fetchMenus('solutions'),
      fetchMenus('services'),
      fetchMenus('company'),
      fetchMenus('resources'),
    ]);

    return {
      themeSettings: themeSettings.status === 'fulfilled' ? themeSettings.value : {},
      primaryMenu: primaryMenu.status === 'fulfilled' ? primaryMenu.value : [],
      firstFooterMenu: firstFooterMenu.status === 'fulfilled' ? firstFooterMenu.value : [],
      secondFooterMenu: secondFooterMenu.status === 'fulfilled' ? secondFooterMenu.value : [],
      thirdFooterMenu: thirdFooterMenu.status === 'fulfilled' ? thirdFooterMenu.value : [],
      fourthFooterMenu: fourthFooterMenu.status === 'fulfilled' ? fourthFooterMenu.value : []
    };
  } catch (error) {
    console.error('Error fetching theme data:', error);
    return {
      themeSettings: {},
      primaryMenu: [],
      firstFooterMenu: [],
      secondFooterMenu: [],
      thirdFooterMenu: [],
      fourthFooterMenu: []
    };
  }
}

export default async function RootLayout({ children }) {
  const {
    themeSettings,
    primaryMenu,
    firstFooterMenu,
    secondFooterMenu,
    thirdFooterMenu,
    fourthFooterMenu
  } = await getThemeData();
  return (
    <html lang="en" className={`${inter.variable} ${chivoMono.variable} ${geistSans.variable} ${roboto.variable}`}>
      <head>
        {themeSettings?.site_icon && (
          <>
            <link rel="icon" href={themeSettings.site_icon} />
            <link rel="apple-touch-icon" href={themeSettings.site_icon} />
            <link rel="shortcut icon" href={themeSettings.site_icon} />
          </>
        )}
        
        {themeSettings?.header_script && (
         <ClientScripts headerScript={themeSettings?.header_script} />
        )}
      </head>
      <body className="" suppressHydrationWarning>
        <Header
          themeSettings={themeSettings}
          navigationData={primaryMenu}
        />
        <main className="flex-grow-1">{children}</main>
        <Footer
          themeSettings={themeSettings} 
          footerMenus={{
            first: firstFooterMenu,
            second: secondFooterMenu,
            third: thirdFooterMenu,
            fourth: fourthFooterMenu
          }}
        />
        
        <ClientScripts footerScript={themeSettings?.footer_script} />
      </body>
    </html>
  )
}