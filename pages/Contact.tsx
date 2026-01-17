import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, Building2, Map } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Simulate API call
    setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setSubmitted(false);
        alert("Thank you! Your message has been sent.");
    }, 2000);
  };

  return (
    <div className="bg-white min-h-screen pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-slate-900 font-heading mb-4">Get in Touch</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Have questions about your order, products, or just want to say hello? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 font-heading">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-3 rounded-full text-indigo-600 mt-1">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Email Us</h3>
                    <p className="text-lg font-medium text-slate-900 mt-1">rbskkhaniyadhana@gmail.com</p>
                    <p className="text-sm text-slate-500 mt-1">We usually respond within 24 hours.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-orange-100 p-3 rounded-full text-orange-600 mt-1">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Branch Office</h3>
                    <p className="text-lg font-medium text-slate-900 mt-1">Shyam Nagar</p>
                    <p className="text-slate-600">Indore, Madhya Pradesh</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-full text-green-600 mt-1">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Corporate Office</h3>
                    <p className="text-lg font-medium text-slate-900 mt-1">Bengaluru</p>
                    <p className="text-slate-600">Karnataka, India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[2rem] text-white overflow-hidden relative">
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-2">Need immediate assistance?</h3>
                    <p className="text-indigo-100 mb-6">Our support team is available Mon-Sat, 9am - 6pm IST.</p>
                    <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-indigo-50 transition-colors">
                        Chat Support
                    </button>
                </div>
                <div className="absolute -bottom-10 -right-10 opacity-20">
                    <Map className="w-40 h-40" />
                </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 font-heading">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
                <select
                    id="subject"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                >
                    <option value="">Select a topic</option>
                    <option value="order">Order Inquiry</option>
                    <option value="product">Product Information</option>
                    <option value="return">Returns & Refunds</option>
                    <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitted}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center space-x-2"
              >
                {submitted ? (
                    <span>Sending...</span>
                ) : (
                    <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                    </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;