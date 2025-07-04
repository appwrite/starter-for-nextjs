"use client";

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MenuBar } from '@/components/MenuBar';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { user } = useAuth();
  const buttonText = user ? 'Go to Dashboard' : 'Sign In';
  const buttonHref = user ? '/dashboard' : '/login';
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach(section => observer.observe(section));

    // Trigger hero animation immediately
    setTimeout(() => {
      setIsVisible(prev => ({ ...prev, hero: true }));
    }, 100);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#002248] flex flex-col">
      <MenuBar />

      <main className="flex-1 w-full">
        {/* === Hero Section === */}
        <section className="w-full bg-[#002248] text-white overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-16 px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            
            {/* Text Content */}
            <div 
              className={`text-center lg:text-left transform transition-all duration-1000 ease-out ${
                isVisible.hero 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-10 opacity-0'
              }`}
            >
              <h1 
                className={`text-4xl sm:text-5xl lg:text-6xl font-light mb-6 leading-tight max-w-2xl transform transition-all duration-1200 ease-out delay-200 ${
                  isVisible.hero 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-10 opacity-0'
                }`}
                style={{ fontFamily: 'Literata, serif' }}
              >
                All-in-one platform for Programming Mentorship, <span className="font-bold">myPM.</span>
              </h1>
              <p 
                className={`text-lg text-gray-300 max-w-lg mx-auto lg:mx-0 mb-8 transform transition-all duration-1000 ease-out delay-400 ${
                  isVisible.hero 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-10 opacity-0'
                }`}
              >
                Peer-to-peer support for new UCL Computer Science undergraduates.
              </p>
              <div 
                className={`transform transition-all duration-1000 ease-out delay-600 ${
                  isVisible.hero 
                    ? 'translate-y-0 opacity-100 scale-100' 
                    : 'translate-y-10 opacity-0 scale-95'
                }`}
              >
                <Link href={buttonHref}>
                  <Button 
                    size="lg" 
                    className="bg-white text-[#002248] font-mono font-bold py-3 px-8 rounded-md hover:bg-gray-200 hover:scale-105 transition-all duration-300 ease-out hover:shadow-lg text-lg transform active:scale-95"
                  >
                    {buttonText}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Logo */}
            <div 
              className={`hidden lg:flex justify-center items-center gap-6 transform transition-all duration-1000 ease-out delay-800 ${
                isVisible.hero 
                  ? 'translate-x-0 opacity-100' 
                  : 'translate-x-10 opacity-0'
              }`}
            >
              <img 
                src="/uclcs-logo.jpeg" 
                alt="UCL CS Logo" 
                className="w-40 h-40 border-1 border-white flex-shrink-0 bg-white p-2 rounded-md hover:scale-110 transition-all duration-500 ease-out hover:shadow-2xl hover:rotate-2" 
              />
              <span className="text-4xl font-bold text-white animate-pulse">×</span>
              <img 
                src="/myPM-logo.png" 
                alt="myPM Logo" 
                className="w-40 h-40 border-1 border-white flex-shrink-0 bg-white p-2 rounded-md hover:scale-110 transition-all duration-500 ease-out hover:shadow-2xl hover:-rotate-2" 
              />
            </div>
          </div>
        </section>

        
        {/* === "How It Works" Section === */}
        <section 
          className="w-full bg-white"
          id="how-it-works"
          data-animate
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <h2 
              className={`text-4xl md:text-4xl font-light text-center text-[#002248] mb-12 transform transition-all duration-1000 ease-out ${
                isVisible['how-it-works'] 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-10 opacity-0'
              }`}
            >
              How the Programming Mentor Scheme Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  emoji: '🤝',
                  title: 'Peer Support',
                  description: 'Senior students help first-years with programming, coursework, and university life.',
                  delay: 'delay-200'
                },
                {
                  emoji: '👩‍💻',
                  title: 'Weekly Sessions',
                  description: 'Drop-in style sessions, both in-person and online, for questions, advice, and collaboration.',
                  delay: 'delay-400'
                },
                {
                  emoji: '🌱',
                  title: 'Grow Together',
                  description: 'Build skills, confidence, and community as you progress through your UCL journey.',
                  delay: 'delay-600'
                }
              ].map((item, index) => (
                <Card 
                  key={index}
                  className={`text-center shadow-sm hover:shadow-lg transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-2 group transform ${
                    isVisible['how-it-works'] 
                      ? `translate-y-0 opacity-100 ${item.delay}` 
                      : 'translate-y-10 opacity-0'
                  }`}
                >
                  <CardContent className="p-8">
                    <div className="mx-auto bg-indigo-100 rounded-full w-20 h-20 flex items-center justify-center mb-6 text-4xl group-hover:bg-indigo-200 group-hover:scale-110 transition-all duration-300 ease-out">
                      {item.emoji}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-[#002248]">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* === Testimonials Section === */}
        <section 
          className="w-full bg-[#002248] border-y"
          id="testimonials"
          data-animate
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <h2 
              className={`text-3xl md:text-4xl font-light text-center text-[#ffffff] mb-12 transform transition-all duration-1000 ease-out ${
                isVisible.testimonials 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-10 opacity-0'
              }`}
            >
              What Students Say
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[
                {
                  quote: "I had a really great programming tutor in my first year... These sessions are very welcome by the tutees and the tutors enjoy supporting their peers. People find it useful in general.",
                  author: "Kelly Ding, Senior Programming Tutor",
                  delay: 'delay-200'
                },
                {
                  quote: "Throughout my first year, I found it extremely helpful to speak to someone who had gone through the exact same modules as me... Being both a tutee and a tutor has enriched my UCL CS journey.",
                  author: "Eluri Laasya, Programming Mentor",
                  delay: 'delay-400'
                }
              ].map((testimonial, index) => (
                <Card 
                  key={index}
                  className={`shadow-sm hover:shadow-xl transition-all duration-500 ease-out hover:scale-105 transform ${
                    isVisible.testimonials 
                      ? `translate-y-0 opacity-100 ${testimonial.delay}` 
                      : 'translate-y-10 opacity-0'
                  }`}
                >
                  <CardContent className="p-8">
                    <p className="text-gray-700 italic mb-6 leading-relaxed">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <p className="font-semibold text-[#002248] text-right">
                      - {testimonial.author}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* === Footer === */}
        <footer 
          className="w-full text-center text-gray-500 text-sm py-8 px-4 bg-white"
          id="footer"
          data-animate
        >
          <div 
            className={`transform transition-all duration-1000 ease-out ${
              isVisible.footer 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-5 opacity-0'
            }`}
          >
            University College London, Gower Street, London, WC1E 6BT &copy; {new Date().getFullYear()} UCL
          </div>
        </footer>
      </main>
    </div>
  );
}