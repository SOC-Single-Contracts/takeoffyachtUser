import Experience from "@/components/lp/Experience";
import Featured from "@/components/lp/Featured";
import Hero from "@/components/lp/Hero";
import Journal from "@/components/lp/Journal";
import Footer from "@/components/lp/shared/Footer";
import Header from "@/components/lp/shared/Header";
import MaximizeExp from "@/components/lp/MaximizeExp";
import ListExperience from "@/components/lp/ListExperience";
import Gallery from "@/components/lp/Gallery";
import FormulaOne from "@/components/lp/FormulaOne";
import Events from "@/components/lp/Events";
import FormulaOneDashboard from "@/components/lp/FormulaOneDashboard";

export const metadata = {
  metadataBase: new URL('https://takeoffyachts.com/'),
  title: {
    default: 'Take Off Yachts - Luxury Maritime Adventures & Yacht Charters',
    template: '%s | Take Off Yachts Home'
  },
  description: 'Embark on extraordinary maritime journeys. Discover luxury yacht charters, exclusive Formula One experiences, and unforgettable global adventures. Your dream voyage starts here.',
  applicationName: 'Take Off Yachts',
  authors: [{ name: 'Take Off Yachts Team', url: 'https://takeoffyachts.com/' }],
  generator: 'Next.js',
  keywords: [
    'luxury yacht charter',
    'maritime adventures',
    'Formula One yacht experiences',
    'luxury travel',
    'yacht rental',
    'exclusive maritime events',
    'global yacht experiences'
  ],
  referrer: 'origin',
  colorScheme: 'light dark',
  creator: 'Take Off Yachts Team',
  publisher: 'Take Off Yachts',
  category: 'Travel and Leisure',
  classification: 'Luxury Yacht Experiences',
  openGraph: {
    title: 'Take Off Yachts - Luxury Maritime Adventures',
    description: 'Discover the world\'s most exclusive maritime experiences. Luxury yacht charters, Formula One events, and unforgettable global adventures.',
    url: 'https://takeoffyachts.com/',
    siteName: 'Take Off Yachts',
    images: [
      {
        url: '/og-home-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Luxury Yacht Experiences - Your Ultimate Maritime Adventure'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Take Off Yachts - Luxury Maritime Adventures',
    description: 'Explore the world\'s most exclusive maritime experiences. Luxury yacht charters and global adventures await.',
    images: ['/twitter-home-image.jpg']
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: 'your-google-site-verification-code',
    bing: 'your-bing-site-verification-code'
  },
  alternates: {
    canonical: 'https://takeoffyachts.com/',
    languages: {
      'en-US': 'https://takeoffyachts.com/en-us',
      'en-GB': 'https://takeoffyachts.com/en-gb'
    }
  }
};

export default function Home() {
  return (
    <div className="bg-[#E2E2E2] dark:bg-gray-900 ">
      <Header />
      <main className="bg-[#E2E2E2] dark:bg-gray-900">
        <div className="mt-10 md:mt-0">
          <Hero />
          <Gallery />
          <Featured />
          <FormulaOneDashboard/>
          {/* <FormulaOne /> */}
          <Events />
          <Experience />
          <MaximizeExp />
          <Journal />
          <ListExperience />
        </div>

      </main>
      <Footer />
    </div>
  );
}
