"use client";
import MenuBar from '@/components/MenuBar';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  const { user } = useAuth();
  const buttonText = user ? 'Go to Dashboard' : 'Sign In';
  const buttonHref = user ? '/dashboard' : '/login';

  return (
    <div className="min-h-screen bg-white">
      <MenuBar />
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-4 bg-[#f5f7fa] border-b border-[#e5e1ff]">
        <h1 className="text-5xl md:text-6xl font-bold text-[#002855] mb-6">Welcome to myPM</h1>
        <p className="text-xl md:text-2xl text-[#333] max-w-2xl mb-8">
          The all-in-one platform for the UCL Computer Science Programming Tutor Scheme.
        </p>
        <Link href={buttonHref}>
          <Button size="lg" className="bg-[#002855] text-white text-lg font-semibold rounded-full px-8 py-4 shadow hover:bg-[#003366] transition">
            {buttonText}
          </Button>
        </Link>
      </section>

      {/* How It Works Section */}
      <section className="max-w-5xl mx-auto py-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-[#002855] mb-8 text-center">How the Programming Tutor Scheme Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="flex flex-col items-center">
            <CardContent className="flex flex-col items-center p-6">
              <div className="bg-[#e5e1ff] rounded-full w-16 h-16 flex items-center justify-center mb-4 text-2xl">👩‍💻</div>
              <h3 className="font-semibold text-lg mb-2">Peer Support</h3>
              <p className="text-gray-600 text-center">Senior students help first-years with programming, coursework, and university life.</p>
            </CardContent>
          </Card>
          <Card className="flex flex-col items-center">
            <CardContent className="flex flex-col items-center p-6">
              <div className="bg-[#e5e1ff] rounded-full w-16 h-16 flex items-center justify-center mb-4 text-2xl">🤝</div>
              <h3 className="font-semibold text-lg mb-2">Weekly Sessions</h3>
              <p className="text-gray-600 text-center">Drop-in style sessions, both in-person and online, for questions, advice, and collaboration.</p>
            </CardContent>
          </Card>
          <Card className="flex flex-col items-center">
            <CardContent className="flex flex-col items-center p-6">
              <div className="bg-[#e5e1ff] rounded-full w-16 h-16 flex items-center justify-center mb-4 text-2xl">🌱</div>
              <h3 className="font-semibold text-lg mb-2">Grow Together</h3>
              <p className="text-gray-600 text-center">Build skills, confidence, and community as you progress through your UCL journey.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-[#f5f7fa] py-16 px-4 border-t border-[#e5e1ff]">
        <h2 className="text-3xl md:text-4xl font-bold text-[#002855] mb-10 text-center">What Students Say</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <Card className="flex flex-col">
            <CardContent className="p-6 flex flex-col">
              <p className="text-gray-700 italic mb-4">“I had a really great programming tutor in my first year when I was struggling with my studies. I would like to be a good programming tutor like her. These sessions are very welcome by the tutees and the tutors enjoy supporting their peers. People find it useful in general.”</p>
              <span className="font-semibold text-[#002855]">Kelly Ding, Senior Programming Tutor</span>
            </CardContent>
          </Card>
          <Card className="flex flex-col">
            <CardContent className="p-6 flex flex-col">
              <p className="text-gray-700 italic mb-4">“Throughout my first year, I found it extremely helpful to speak to someone who had gone through the exact same modules as me for their advice and resources. Their first-hand experience was incredibly insightful. Being both a tutee and a tutor has enriched my UCL CS journey.”</p>
              <span className="font-semibold text-[#002855]">Eluri Laasya, Programming Mentor</span>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-8 border-t border-[#e5e1ff] mt-8">
        University College London, Gower Street, London, WC1E 6BT &copy; {new Date().getFullYear()} UCL
      </footer>
    </div>
  );
}
