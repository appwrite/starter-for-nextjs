"use client";

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MenuBar } from '@/components/MenuBar';

export default function HomePage() {
  const { user } = useAuth();
  const buttonText = user ? 'Go to Dashboard' : 'Sign In';
  const buttonHref = user ? '/dashboard' : '/login';

  return (
    <div className="min-h-screen bg-[#002248] flex flex-col">
      <MenuBar />

      <main className="flex-1 w-full">
        {/* === Hero Section === */}
        <section className="w-full bg-[#002248] text-white">
          {/* This container now switches to a row and justifies at the lg breakpoint */}
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-16 px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            
            {/* Text Content: Centered by default, left-aligned on large screens */}
            <div className="text-center lg:text-left">
              <h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-light mb-6 leading-tight max-w-2xl" 
                style={{ fontFamily: 'Literata, serif' }}
              >
                All-in-one platform for Programming Mentorship, <span className="font-bold">myPM.</span>
              </h1>
              <p className="text-lg text-gray-300 max-w-lg mx-auto lg:mx-0 mb-8">
                Peer-to-peer support for new UCL Computer Science undergraduates.
              </p>
              <Link href={buttonHref}>
                <Button size="lg" className="bg-white text-[#002248] font-mono font-bold py-3 px-8 rounded-md hover:bg-gray-200 transition-colors text-lg">
                  {buttonText}
                </Button>
              </Link>
            </div>

            {/* Logo: Hidden by default, appears as a flex item on large screens */}
            <div className="hidden lg:flex justify-center items-center gap-6">
              <img 
                src="/uclcs-logo.jpeg" 
                alt="UCL CS Logo" 
                className="w-40 h-40 border-1 border-white flex-shrink-0 bg-white p-2 rounded-md" 
              />
              <span className="text-4xl font-bold text-white">×</span>
              <img 
                src="/myPM-logo.png" 
                alt="myPM Logo" 
                className="w-40 h-40 border-1 border-white flex-shrink-0 bg-white p-2 rounded-md" 
              />
            </div>
          </div>
        </section>

        
        {/* === "How It Works" Section === */}
        <section className="w-full bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <h2 className="text-4xl md:text-4xl font-light text-center text-[#002248] mb-12">
              How the Programming Mentor Scheme Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center shadow-sm">
                <CardContent className="p-8">
                  <div className="mx-auto bg-indigo-100 rounded-full w-20 h-20 flex items-center justify-center mb-6 text-4xl">🤝</div>
                  <h3 className="text-xl font-semibold mb-2 text-[#002248]">Peer Support</h3>
                  <p className="text-gray-600">Senior students help first-years with programming, coursework, and university life.</p>
                </CardContent>
              </Card>
              <Card className="text-center shadow-sm">
                <CardContent className="p-8">
                  <div className="mx-auto bg-indigo-100 rounded-full w-20 h-20 flex items-center justify-center mb-6 text-4xl">👩‍💻</div>
                  <h3 className="text-xl font-semibold mb-2 text-[#002248]">Weekly Sessions</h3>
                  <p className="text-gray-600">Drop-in style sessions, both in-person and online, for questions, advice, and collaboration.</p>
                </CardContent>
              </Card>
              <Card className="text-center shadow-sm">
                <CardContent className="p-8">
                  <div className="mx-auto bg-indigo-100 rounded-full w-20 h-20 flex items-center justify-center mb-6 text-4xl">🌱</div>
                  <h3 className="text-xl font-semibold mb-2 text-[#002248]">Grow Together</h3>
                  <p className="text-gray-600">Build skills, confidence, and community as you progress through your UCL journey.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* === Testimonials Section === */}
        <section className="w-full bg-[#002248] border-y">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <h2 className="text-3xl md:text-4xl font-light text-center text-[#ffffff] mb-12">What Students Say</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="shadow-sm">
                        <CardContent className="p-8">
                            <p className="text-gray-700 italic mb-6">“I had a really great programming tutor in my first year... These sessions are very welcome by the tutees and the tutors enjoy supporting their peers. People find it useful in general.”</p>
                            <p className="font-semibold text-[#002248] text-right">- Kelly Ding, Senior Programming Tutor</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="p-8">
                            <p className="text-gray-700 italic mb-6">“Throughout my first year, I found it extremely helpful to speak to someone who had gone through the exact same modules as me... Being both a tutee and a tutor has enriched my UCL CS journey.”</p>
                            <p className="font-semibold text-[#002248] text-right">- Eluri Laasya, Programming Mentor</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

        {/* === Footer === */}
        <footer className="w-full text-center text-gray-500 text-sm py-8 px-4 bg-white">
            University College London, Gower Street, London, WC1E 6BT &copy; {new Date().getFullYear()} UCL
        </footer>
      </main>
    </div>
  );
}