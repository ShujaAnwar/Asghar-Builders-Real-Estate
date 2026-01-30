
import React from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

const Contact: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you! Your inquiry has been sent to Asghar Builders. We will contact you shortly.");
  };

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6">Get In <span className="text-amber-500">Touch</span></h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Have questions about a project? Our expert consultants are available 24/7 to help you make the right investment decision.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Form */}
          <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-white/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 px-1">Full Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="John Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-amber-500 text-white transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 px-1">Phone Number</label>
                  <input 
                    required
                    type="tel" 
                    placeholder="+92 3XX XXXXXXX"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-amber-500 text-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 px-1">Email Address</label>
                <input 
                  required
                  type="email" 
                  placeholder="john@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-amber-500 text-white transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 px-1">Message</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="I am interested in..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-amber-500 text-white transition-all resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 shadow-xl shadow-amber-500/20"
              >
                <span>Send Inquiry</span>
                <Send size={18} />
              </button>
            </form>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-8">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="glass p-8 rounded-3xl border border-white/10">
                <Phone className="text-amber-500 mb-4" size={24} />
                <h4 className="text-white font-bold mb-2">Call Us</h4>
                <p className="text-gray-400 text-sm">+92 (300) 123-4567</p>
                <p className="text-gray-400 text-sm">+92 (42) 345-6789</p>
              </div>
              <div className="glass p-8 rounded-3xl border border-white/10">
                <Mail className="text-amber-500 mb-4" size={24} />
                <h4 className="text-white font-bold mb-2">Email Us</h4>
                <p className="text-gray-400 text-sm">sales@asgharbuilders.com</p>
                <p className="text-gray-400 text-sm">info@asgharbuilders.com</p>
              </div>
            </div>

            <div className="glass p-8 rounded-3xl border border-white/10 flex items-start space-x-4">
              <MapPin className="text-amber-500 shrink-0" size={24} />
              <div>
                <h4 className="text-white font-bold mb-2">Head Office</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Suite 502, Platinum Tower, Gulberg III, Lahore, Pakistan.
                </p>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-green-600/10 border border-green-500/20 p-8 rounded-3xl flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                   <MessageSquare size={24} />
                </div>
                <div>
                   <h4 className="text-white font-bold">Fast WhatsApp Chat</h4>
                   <p className="text-green-400 text-sm font-medium">Response in &lt; 5 mins</p>
                </div>
              </div>
              <button className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold text-sm transition-all">
                 Chat Now
              </button>
            </div>

            {/* Map Placeholder */}
            <div className="h-64 rounded-[2rem] overflow-hidden glass border border-white/10">
               <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108841.077218693!2d74.22554768393539!3d31.516335191599587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919045a28148381%3A0xc3485c290132c3f1!2sGulberg%2C%20Lahore%2C%20Punjab!5e0!3m2!1sen!2s!4v1714498302195!5m2!1sen!2s" 
                className="w-full h-full grayscale opacity-60"
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
