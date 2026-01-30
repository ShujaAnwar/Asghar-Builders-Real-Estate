
import React, { useState, useEffect, useRef } from 'react';

interface CounterProps {
  end: number;
  suffix?: string;
  duration?: number;
}

const Counter: React.FC<CounterProps> = ({ end, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const countRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const increment = end / (duration / 16); // 60fps approx
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  return (
    <div ref={countRef} className="text-5xl md:text-7xl font-black text-white dark:text-white mb-2 tracking-tighter transition-colors">
      {count}{suffix}
    </div>
  );
};

const StatsSection: React.FC = () => {
  const stats = [
    { label: 'Years of Experience', value: 25, suffix: '+' },
    { label: 'Delivered Projects', value: 12, suffix: '' },
    { label: 'Ongoing Projects', value: 5, suffix: '' },
    { label: 'Trusted Clients', value: 300, suffix: '+' },
  ];

  return (
    <section className="py-24 bg-slate-950 dark:bg-slate-950 light:bg-gray-50 relative border-y border-white/5 dark:border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((item, idx) => (
            <div key={idx} className="text-center group">
              <Counter end={item.value} suffix={item.suffix} />
              <div className="text-[10px] font-black text-gray-500 dark:text-gray-500 uppercase tracking-[0.4em]">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
