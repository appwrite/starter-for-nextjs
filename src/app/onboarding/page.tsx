'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { MenuBar } from '@/components/MenuBar';
import { User, BookOpen, Code, CheckCircle } from 'lucide-react';
import clsx from 'clsx';
import { useAuth, useRequireAuth } from '@/components/AuthProvider';
import { PERMISSIONS } from '@/lib/rbac';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const steps = [
  {
    label: 'Personal Details',
    description: 'Tell us about yourself including your name, degree programme, and gender identity.',
    icon: User,
  },
  {
    label: 'Profile Picture (Optional)',
    description: 'Add a profile picture now, or skip and change it later.',
    icon: User,
  },
  {
    label: 'Experience',
    description: 'Share your background in computer science and programming experience.',
    icon: BookOpen,
  },
  {
    label: 'Coding Quiz',
    description: 'Answer a couple of quick questions to help us assess your programming skills.',
    icon: Code,
  },
  {
    label: 'Complete',
    description: 'Finish your onboarding and get access to your personalised dashboard.',
    icon: CheckCircle,
  },
];

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    upi: '',
    degreeProgramme: '',
    gender: '',
    studiedCS: false,
    yearsExperience: 0,
    quizAnswers: {} as Record<string, string>,
  });
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);

  const [profilePicVersion, setProfilePicVersion] = useState(Date.now());

  // Pre-populate name and upi from user when available
  React.useEffect(() => {
    if (user && !loading) {
      setForm(f => ({
        ...f,
        name: user.full_name || '',
        upi: user.upi || '',
      }));
    }
  }, [user, loading]);

  // Redirect to dashboard if already onboarded
  React.useEffect(() => {
    if (!loading && user) {
      fetch('/api/onboarding/status')
        .then(res => res.json())
        .then(data => {
          if (data.onboarded) {
            router.replace('/dashboard');
          }
        });
    }
  }, [user, loading, router]);

  // Dummy quiz questions
  const quizQuestions = [
    { id: 'q1', question: 'What is the output of 2 + 2?', options: ['3', '4', '5'], answer: '4' },
    { id: 'q2', question: 'Which is a valid variable name in Python?', options: ['1var', 'var_1', 'var-1'], answer: 'var_1' },
  ];

  // Font classes
  const literata = 'font-literata';
  const mono = 'font-geist-mono';

  // Require authentication and user:update permission
  useRequireAuth({ requiredPermission: PERMISSIONS.USER_UPDATE });

  // Stepper
  const Stepper = () => (
    <div className="hidden md:flex flex-col gap-8 p-8 bg-gradient-to-b from-[#f7f8fa] to-[#f7f8fa]/60 rounded-2xl shadow-sm min-w-[270px] max-w-xs w-full">
      <div className={clsx('mb-2 text-gray-500 text-sm', mono)}>Complete your onboarding to get started with your personalised programming mentor experience.</div>
      {steps.map((s, idx) => {
        const Icon = s.icon;
        const active = idx === step;
        const completed = idx < step;
        return (
          <div key={s.label} className="flex items-start gap-4 group">
            <div className={clsx(
              'rounded-full border-2 flex items-center justify-center w-10 h-10 transition-all',
              active ? 'bg-white border-[#002248] shadow-lg' : 
              completed ? 'bg-[#002248] border-[#002248]' : 
              'bg-gray-100 border-gray-200',
            )}>
              <Icon className={clsx(
                'w-5 h-5', 
                active ? 'text-[#002248]' : 
                completed ? 'text-white' : 
                'text-gray-400'
              )} />
            </div>
            <div>
              <div className={clsx(literata, 'text-base font-bold', active ? 'text-[#002248]' : 'text-gray-900')}>{s.label}</div>
              <div className={clsx(mono, 'text-sm text-gray-500 mt-1')}>{s.description}</div>
            </div>
          </div>
        );
      })}
    </div>
  );

  // Animation helpers
  const animateToStep = (nextStep: number) => {
    setIsVisible(false);
    setTimeout(() => {
      setStep(nextStep);
      setIsVisible(true);
    }, 200);
  };

  const handleNext = () => animateToStep(step + 1);
  const handleBack = () => animateToStep(step - 1);
  const handleSubmit = async () => {
    setIsVisible(false);
    
    await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    
    // Upload profile picture if present
    if (profilePic) {
      const formData = new FormData();
      formData.append('profilePic', profilePic);
      await fetch('/api/user', { method: 'POST', body: formData });
      setProfilePicVersion(Date.now());
    }
    
    setTimeout(() => {
      setStep((s) => s + 1);
      setIsVisible(true);
    }, 200);
  };

  // Step form area
  let content;
  if (step === 0) {
    content = (
      <>
        <div className={clsx(literata, 'text-2xl font-bold mb-2 text-gray-900')}>Personal Details</div>
        <div className={clsx(mono, 'mb-6 text-gray-600')}>Let&apos;s get to know you! Please fill in your details below.</div>
        <label className={clsx('block font-bold mb-1', literata)}>Name</label>
        <input
          className={clsx('w-full border px-2 py-2 mb-4 rounded-lg bg-gray-100', mono)}
          value={form.name}
          readOnly
          disabled
        />
        <label className={clsx('block font-bold mb-1', literata)}>UPI</label>
        <input
          className={clsx('w-full border px-2 py-2 mb-4 rounded-lg bg-gray-100', mono)}
          value={form.upi}
          readOnly
          disabled
        />
        <label className={clsx('block font-bold mb-1', literata)}>Degree Programme</label>
        <select className={clsx('w-full border px-2 py-2 mb-4 rounded-lg', mono)} value={form.degreeProgramme} onChange={e => setForm(f => ({ ...f, degreeProgramme: e.target.value }))}>
          <option value="">Select...</option>
          <option>BSc Computer Science</option>
          <option>MEng Computer Science</option>
          <option>MEng CS and Maths</option>
          <option>MEng Robotics and AI</option>
        </select>
        <label className={clsx('block font-bold mb-1', literata)}>Gender You Best Identify With</label>
        <select className={clsx('w-full border px-2 py-2 mb-4 rounded-lg', mono)} value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
          <option value="">Select...</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
          <option>Prefer not to say</option>
        </select>
        <Button onClick={handleNext} disabled={!form.name || !form.upi || !form.degreeProgramme || !form.gender} className={clsx('mt-4 w-full py-3 text-base', mono, 'transition-all duration-200')}>Next →</Button>
      </>
    );
  } else if (step === 1) {
    content = (
      <>
        <div className={clsx(literata, 'text-2xl font-bold mb-2 text-gray-900')}>Add a Profile Picture (Optional)</div>
        <div className={clsx(mono, 'mb-4 text-gray-600')}>You can upload a profile picture now, or skip and add/change it later from your profile page.</div>
        <div className="flex flex-col items-center gap-4 mb-4">
          <Avatar className="w-24 h-24 ring-2 ring-[#002248]">
            <AvatarImage src={profilePicUrl ? profilePicUrl : (user ? `/api/user/profile-pic/${user.upi}?v=${profilePicVersion}` : undefined)} alt={form.name} />
            <AvatarFallback className="bg-[#002248] text-white text-3xl font-bold">?</AvatarFallback>
          </Avatar>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="onboarding-profile-pic"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                setProfilePic(file);
                setProfilePicUrl(URL.createObjectURL(file));
                // Do NOT upload here anymore
              }
            }}
          />
          <Button
            size="sm"
            variant="outline"
            className="font-geist-mono text-xs px-3 py-1"
            onClick={() => document.getElementById('onboarding-profile-pic')?.click()}
          >
            {profilePic ? 'Change Picture' : 'Upload Picture'}
          </Button>
          {profilePic && (
            <Button
              size="sm"
              variant="secondary"
              className="font-geist-mono text-xs px-3 py-1"
              onClick={() => {
                setProfilePic(null);
                setProfilePicUrl(null);
                setProfilePicVersion(Date.now());
              }}
            >
              Remove
            </Button>
          )}
        </div>
        <div className="flex justify-between w-full">
          <Button variant="secondary" onClick={handleBack} className={clsx(mono, 'transition-all duration-200')}>Back</Button>
          <Button onClick={() => animateToStep(step + 1)} className={clsx(mono, 'transition-all duration-200')}>Continue →</Button>
        </div>
      </>
    );
  } else if (step === 2) {
    content = (
      <>
        <div className={clsx(literata, 'text-2xl font-bold mb-2 text-gray-900')}>Experience</div>
        <div className={clsx(mono, 'mb-6 text-gray-600')}>Tell us about your background in computer science and programming.</div>
        <div className="mb-4">
          <div className={clsx('font-bold mb-2', literata)}>Have you formally studied CS before?</div>
          <div className="flex gap-4 mb-4">
            <label className={clsx('flex items-center gap-2', mono)}>
              <input type="radio" checked={form.studiedCS === true} onChange={() => setForm(f => ({ ...f, studiedCS: true }))} /> Yes
            </label>
            <label className={clsx('flex items-center gap-2', mono)}>
              <input type="radio" checked={form.studiedCS === false} onChange={() => setForm(f => ({ ...f, studiedCS: false }))} /> No
            </label>
          </div>
        </div>
        <div className="mb-4">
          <div className={clsx('font-bold mb-2', literata)}>How many years of programming experience have you had (in any language)?</div>
          <input type="range" min={0} max={4} value={form.yearsExperience} onChange={e => setForm(f => ({ ...f, yearsExperience: Number(e.target.value) }))} className="w-full" />
          <div className={clsx('flex justify-between text-xs mt-1', mono)}>
            <span>0</span><span>1</span><span>2</span><span>3</span><span>4+</span>
          </div>
        </div>
        <div className="flex justify-between">
          <Button variant="secondary" onClick={handleBack} className={clsx(mono, 'transition-all duration-200')}>Back</Button>
          <Button onClick={handleNext} disabled={form.studiedCS === undefined} className={clsx(mono, 'transition-all duration-200')}>Next →</Button>
        </div>
      </>
    );
  } else if (step === 3) {
    content = (
      <>
        <div className={clsx(literata, 'text-2xl font-bold mb-2 text-gray-900')}>Coding Quiz</div>
        <div className={clsx(mono, 'mb-6 text-gray-600')}>Answer a couple of quick questions to help us assess your programming skills.</div>
        {quizQuestions.map((q, idx) => (
          <div key={q.id} className="mb-4">
            <div className={clsx(mono, 'mb-1')}>{idx + 1}. {q.question}</div>
            <select className={clsx('w-full border px-2 py-2 rounded-lg', mono)} value={form.quizAnswers[q.id] || ''} onChange={e => setForm(f => ({ ...f, quizAnswers: { ...f.quizAnswers, [q.id]: e.target.value } }))}>
              <option value="">Select...</option>
              {q.options.map(opt => <option key={opt}>{opt}</option>)}
            </select>
          </div>
        ))}
        <div className="flex justify-between">
          <Button variant="secondary" onClick={handleBack} className={clsx(mono, 'transition-all duration-200')}>Back</Button>
          <Button onClick={handleSubmit} disabled={quizQuestions.some(q => !form.quizAnswers[q.id])} className={clsx(mono, 'transition-all duration-200')}>Complete →</Button>
        </div>
      </>
    );
  } else if (step === 4) {
    content = (
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-[#002248]" />
        </div>
        <div className={clsx(literata, 'text-3xl font-bold mb-4 text-[#002248]')}>Thank you.</div>
        <div className={clsx(mono, 'mb-6 text-gray-600 max-w-sm mx-auto')}>Your results have been recorded and your account has been successfully activated.<br /><br/>Welcome to UCL Computer Science and the Programming Mentor programme!</div>
        <Button asChild className={clsx(mono, 'transition-all duration-200')}><a href="/dashboard">Go to Dashboard →</a></Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f8fa]">
      {/* MenuBar with only Log Out button */}
      <div className="border-b bg-white">
        <MenuBar hideSignInButton hideNavLinks showLogoutOnly />
      </div>
      <div className="flex-1 flex flex-col md:flex-row items-stretch justify-center max-w-5xl mx-auto w-full py-8 md:py-16 gap-8">
        {/* Stepper (left) */}
        <div className="md:w-1/2 flex flex-col justify-center items-center">
          <div className="flex items-center gap-3 mb-8">
            <Image src="/myPM-logo.png" alt="myPM Logo" width={60} height={60} />
            <div className={clsx(literata, 'text-3xl font-bold text-[#002248]')}>myPM</div>
          </div>
          <Stepper />
        </div>
        {/* Form (right) */}
        <div className="md:w-1/2 flex flex-col justify-center items-center">
          <Card className="w-full max-w-lg p-8 shadow-xl bg-white/90"> 
            <CardContent className={clsx(
              'p-0 min-h-[400px] flex flex-col justify-center transition-opacity duration-300 ease-in-out',
              isVisible ? 'opacity-100' : 'opacity-0'
            )}>
              {content}
            </CardContent>
          </Card>
        </div>
      </div>
      <style jsx global>{`
        .font-literata { font-family: 'Literata', serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
        .font-geist-mono { font-family: 'Geist Mono', monospace; }
      `}</style>
    </div>
  );
}