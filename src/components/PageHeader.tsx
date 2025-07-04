import React from 'react';

export function PageHeader({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle?: string }) {
  return (
    <section className="w-full bg-gradient-to-b from-[#e3eafc] to-[#f7f8fa] border-b mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center gap-4">
        <div className="text-[#009688]">{icon}</div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-literata text-[#002248]">{title}</h1>
          {subtitle && <div className="text-lg text-gray-600 font-inter mt-1">{subtitle}</div>}
        </div>
      </div>
    </section>
  );
} 