import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900">Get in Touch</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Have questions regarding HealthTrack or diagnostic services? Send us a message.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Info */}
        <div className="md:col-span-5 bg-sky-900 text-white p-8 rounded-3xl space-y-6">
          <h3 className="text-xl font-bold">Contact Information</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Our support desk is available 24/7 for patient inquiries and technical assistance.
          </p>

          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-xl">
                <Phone className="h-4 w-4 text-sky-400" />
              </div>
              <span>+1 800-555-HEALTH (24/7 Support)</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-xl">
                <Mail className="h-4 w-4 text-sky-400" />
              </div>
              <span>support@healthtrack.demo</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-white/10 rounded-xl mt-0.5">
                <MapPin className="h-4 w-4 text-sky-400" />
              </div>
              <span>HealthTrack Medical Complex, 500 Digital Ave, Tech City</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-7 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">Message Sent Successfully!</h3>
              <p className="text-xs text-slate-500">Thank you for reaching out. Our healthcare team will respond shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
              >
                <Send className="h-4 w-4" /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
