import React, { useEffect } from 'react';
import { useData } from '../context/DataContext.tsx';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

const Contact: React.FC = () => {
  const { siteContent } = useData();

  useEffect(() => {
    document.title = "Contact Us | Invest with Asghar Builders";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you! Your inquiry has been sent to Asghar Builders. We will contact you shortly.");
  };

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <h1 className="text-5xl md:text-8xl font-black text-white mb-6">Get In <span className="text-amber-500">Touch</span></h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-xl leading-relaxed">
            Have questions about a project? Our expert consultants are available 24/7 to help you make the right investment decision.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-20">
          {/* Form */}
          <div className="glass p-8 md:p-16 rounded-[3.5rem] border border-white/10 shadow-2xl relative">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full"></div>
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Full Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="John Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 focus:outline-none focus:border-amber-500 text-white transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Phone Number</label>
                  <input 
                    required
                    type="tel" 
                    placeholder="+92 3XX XXXXXXX"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 focus:outline-none focus:border-amber-500 text-white transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Email Address</label>
                <input 
                  required
                  type="email" 
                  placeholder="john@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 focus:outline-none focus:border-amber-500 text-white transition-all shadow-inner"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Message</label>
                <textarea 
                  required
                  rows={5}
                  placeholder="I am interested in..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 focus:outline-none focus:border-amber-500 text-white transition-all resize-none shadow-inner"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full py-6 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-3 shadow-2xl shadow-amber-500/30 text-lg"
              >
                <span>Send Inquiry</span>
                <Send size={20} />
              </button>
            </form>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-10">
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="glass p-10 rounded-[2.5rem] border border-white/10 group hover:border-amber-500/20 transition-all">
                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 text-amber-500 group-hover:scale-110 transition-transform">
                  <Phone size={24} />
                </div>
                <h4 className="text-white font-black text-xl mb-4">Call Us</h4>
                <p className="text-gray-400 text-sm font-medium">{siteContent.contact.phone}</p>
                <p className="text-gray-400 text-sm font-medium mt-1">{siteContent.contact.phoneSecondary}</p>
              </div>
              <div className="glass p-10 rounded-[2.5rem] border border-white/10 group hover:border-amber-500/20 transition-all">
                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 text-amber-500 group-hover:scale-110 transition-transform">
                  <Mail size={24} />
                </div>
                <h4 className="text-white font-black text-xl mb-4">Email Us</h4>
                <p className="text-gray-400 text-sm font-medium">{siteContent.contact.email}</p>
              </div>
            </div>

            <div className="glass p-10 rounded-[2.5rem] border border-white/10 flex items-start space-x-6 group hover:border-amber-500/20 transition-all">
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 shrink-0 group-hover:scale-110 transition-transform">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="text-white font-black text-xl mb-3">Head Office</h4>
                <p className="text-gray-400 text-lg leading-relaxed">
                  {siteContent.contact.address}
                </p>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a 
              href={`https://wa.me/${siteContent.contact.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600/10 border border-green-500/20 p-10 rounded-[2.5rem] flex items-center justify-between group hover:bg-green-600/20 transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/40 group-hover:scale-110 transition-transform">
                   <MessageSquare size={32} />
                </div>
                <div>
                   <h4 className="text-white font-black text-2xl">Fast WhatsApp Chat</h4>
                   <p className="text-green-400 font-bold tracking-widest text-xs uppercase mt-1">Response in &lt; 5 mins</p>
                </div>
              </div>
              <div className="hidden sm:flex px-8 py-3 bg-green-500 text-white rounded-full font-black text-sm transition-all transform group-hover:scale-105">
                 Chat Now
              </div>
            </a>

            {/* Map Placeholder */}
            <div className="h-80 rounded-[3rem] overflow-hidden glass border border-white/10 shadow-2xl relative group">
               <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108841.077218693!2d74.22554768393539!3d31.516335191599587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919045a28148381%3A0xc3485c290132c3f1!2sGulberg%2C%20Lahore%2C%20Punjab!5e0!3m2!1sen!2s!4v1714498302195!5m2!1sen!2s" 
                className="w-full h-full grayscale opacity-60 group-hover:opacity-80 group-hover:grayscale-0 transition-all duration-700"
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy">
              </iframe>
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/40 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;