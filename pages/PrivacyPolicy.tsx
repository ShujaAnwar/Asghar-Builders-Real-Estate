import React, { useEffect } from 'react';
import { useData } from '../context/DataContext.tsx';
import { Shield, Lock, Eye, FileText, CheckCircle } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const { siteContent } = useData();

  useEffect(() => {
    document.title = `Privacy Protocols | ${siteContent.global.siteName}`;
    window.scrollTo(0, 0);
  }, [siteContent]);

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-32 pb-24 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full z-0"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
          <div className="inline-flex items-center px-4 py-2 glass rounded-full border border-white/5 text-amber-500 text-xs font-black uppercase tracking-[0.3em] mb-6">
            <Shield size={14} className="mr-2" />
            Security & Trust Node
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent">
            PRIVACY <span className="text-amber-500">PROTOCOLS</span>
          </h1>
          <p className="text-gray-400 text-md max-w-2xl mx-auto leading-relaxed">
            Asghar Builders and its affiliates enforce strict state-of-the-art parameters ensuring total privacy and asset protection.
          </p>
        </div>

        {/* Content Box */}
        <div className="glass border border-white/10 rounded-[2.5rem] p-8 md:p-12 space-y-12 shadow-2xl backdrop-blur-md">
          {/* Section 1 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center text-amber-400">
              <Lock className="mr-3 text-amber-500 shrink-0" size={20} />
              1. Information Collection & Parameters
            </h2>
            <div className="text-gray-400 text-sm md:text-base leading-relaxed space-y-3 pl-8">
              <p>
                We collect personal information directly from you when you register an inquiry, schedule a layout walkthrough, or enter commercial contracts. This parameters include:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Primary Communication Identifiers (Full name, CNIC number, residential details).</li>
                <li>Digital Contacts (Active email address, WhatsApp numbers, phone lines).</li>
                <li>Project Specifications & Financial Options (Property size preferences, downpayment options, preferred installment cycles).</li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center text-amber-400">
              <Eye className="mr-3 text-amber-500 shrink-0" size={20} />
              2. Data Utilization Models
            </h2>
            <div className="text-gray-400 text-sm md:text-base leading-relaxed space-y-3 pl-8">
              <p>
                Your data underpins secure developer-investor pipelines. Under no circumstances is your information sold, rented, or distributed to non-affiliated brokers. Core operations include:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Validating ownership and registry records within standard Karachi construction bounds.</li>
                <li>Processing allocation, lease, and sub-lease registrations.</li>
                <li>Direct communication protocols regarding construction milestones of current developments.</li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center text-amber-400">
              <Shield className="mr-3 text-amber-500 shrink-0" size={20} />
              3. Secure Escrow & Storage Matrix
            </h2>
            <div className="text-gray-400 text-sm md:text-base leading-relaxed space-y-3 pl-8">
              <p>
                Digital records are encrypted utilizing high-grade TLS protocols and stored behind next-generation endpoint defenses. Hard copies of title registrations, allotment papers, and transfer protocols are maintained securely within our corporate headquarters.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center text-amber-400">
              <FileText className="mr-3 text-amber-500 shrink-0" size={20} />
              4. Cookies & Digital Footprint Tracking
            </h2>
            <div className="text-gray-400 text-sm md:text-base leading-relaxed space-y-3 pl-8">
              <p>
                Our digital portal employs strict, non-tracking architectural telemetry to measure performance metrics and optimize user experience (such as image gallery caching). These cookies do not harvest personal details or track downstream browsing behavior.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center text-amber-400">
              <CheckCircle className="mr-3 text-amber-500 shrink-0" size={20} />
              5. Legal Compliance & Jurisdiction
            </h2>
            <div className="text-gray-400 text-sm md:text-base leading-relaxed space-y-3 pl-8">
              <p>
                These protocols conform strictly to the Electronic Transactions Ordinance and personal safety legislation of the Islamic Republic of Pakistan. Queries regarding data removal, CNIC verification, or transfer options should be directed to our general contact hub or through corporate legal representatives.
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

export default PrivacyPolicy;
