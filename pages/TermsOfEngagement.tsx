import React, { useEffect } from 'react';
import { useData } from '../context/DataContext.tsx';
import { Scale, Milestone, HardHat, FileCheck, HelpCircle } from 'lucide-react';

const TermsOfEngagement: React.FC = () => {
  const { siteContent } = useData();

  useEffect(() => {
    document.title = `Terms of Engagement | ${siteContent.global.siteName}`;
    window.scrollTo(0, 0);
  }, [siteContent]);

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-32 pb-24 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full z-0"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full z-0"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
          <div className="inline-flex items-center px-4 py-2 glass rounded-full border border-white/5 text-amber-500 text-xs font-black uppercase tracking-[0.3em] mb-6">
            <Scale size={14} className="mr-2" />
            Corporate Legal Registry
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent">
            TERMS OF <span className="text-amber-500">ENGAGEMENT</span>
          </h1>
          <p className="text-gray-400 text-md max-w-2xl mx-auto leading-relaxed">
            These guidelines dictate acquisition, bookings, payment structures, and legal covenants governing client-developer transactions.
          </p>
        </div>

        {/* Content Box */}
        <div className="glass border border-white/10 rounded-[2.5rem] p-8 md:p-12 space-y-12 shadow-2xl backdrop-blur-md">
          {/* Section 1 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center text-amber-400">
              <FileCheck className="mr-3 text-amber-500 shrink-0" size={20} />
              1. Bookings, Allotments & Registration Covenants
            </h2>
            <div className="text-gray-400 text-sm md:text-base leading-relaxed space-y-3 pl-8">
              <p>
                All project bookings, including premium developments like Ali Arcade Karachi or Al Kauser Residency, are subject to formal downpayment validation.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Booking validation requires submission of a completed official registration form, designated CNIC details, and direct bank instruments.</li>
                <li>An allotment letter is generated post-clearance of initial validation fees, conveying specific property coordinates (unit number, block number, square footage).</li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center text-amber-400">
              <Milestone className="mr-3 text-amber-500 shrink-0" size={20} />
              2. Payment Frameworks & Surcharges on Default
            </h2>
            <div className="text-gray-400 text-sm md:text-base leading-relaxed space-y-3 pl-8">
              <p>
                Installment operations represent the lifeblood of structural procurement timelines.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Payment cycles are dictated strictly by the chosen project's customized payment plan (e.g., quarterly installments, construction-linked tiers).</li>
                <li>A grace period of exactly 15 days is permitted for overdue payments. Following this, a warning schedule is issued. Standard late charges apply on cumulative overdue balances.</li>
                <li>In cases of persistent defaults beyond standard warning schedules, allotments are subject to cancellation protocols under strict legal terms, with refund rules applied after legitimate administrative subtractions.</li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center text-amber-400">
              <HardHat className="mr-3 text-amber-500 shrink-0" size={20} />
              3. Handover Schedules, Utility Connections & Possession
            </h2>
            <div className="text-gray-400 text-sm md:text-base leading-relaxed space-y-3 pl-8">
              <p>
                Target possession timelines are outlined inside project deeds. While Asghar Builders maintains a spotless record of on-time deliveries, standard provisions exist for force majeure (such as utility connection delays, municipal grid allocations, or provincial policy shifts).
              </p>
              <p>
                Physical possession is handed over to the allottee only upon full ledger clearance, including complete settlement of basic construction fees, documented utility connection charges (KE, Gas, Water boards), and formal verification checks.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center text-amber-400">
              <Scale className="mr-3 text-amber-500 shrink-0" size={20} />
              4. Dispute Arbitration & Board Jurisdiction
            </h2>
            <div className="text-gray-400 text-sm md:text-base leading-relaxed space-y-3 pl-8">
              <p>
                Any conflict arising from layout alterations, payment deadlines, or general site maintenance schedules is settled amicably through corporate legal counsel. Unresolved matters fall within the legal jurisdiction of Karachi courts and regional builder authorities (including SBCA).
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center text-amber-400">
              <HelpCircle className="mr-3 text-amber-500 shrink-0" size={20} />
              5. Developer Modifications & Material Substitutions
            </h2>
            <div className="text-gray-400 text-sm md:text-base leading-relaxed space-y-3 pl-8">
              <p>
                Asghar Builders reserves the right to authorize minor layout improvements or material replacements during build cycles when mandated by structural calculations, material supply issues, or municipal regulations, ensuring equal or higher grade structural integrity at all times.
              </p>
            </div>
          </div>
        </div>

        {/* Footer/Back Button */}
        <div className="text-center mt-12">
          <a
            href="#/"
            className="inline-flex items-center text-xs font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors duration-300"
          >
            ← Return to Main Portal
          </a>
        </div>
      </div>
    </div>
  );
};

export default TermsOfEngagement;
