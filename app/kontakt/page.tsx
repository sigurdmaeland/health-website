'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Sparkles, Clock, MessageCircle } from 'lucide-react';

export default function KontaktPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Her ville du sendt skjemaet til en backend
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2C5F4F] via-[#3A7860] to-[#2C5F4F] text-white py-20 md:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#C9A067] rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <Sparkles className="w-4 h-4 text-[#C9A067]" />
            <span className="text-sm font-medium">Vi er her for deg</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 tracking-tight">
            Kontakt oss
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Har du spørsmål eller trenger hjelp? Vårt team står klare til å bistå deg
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-8 rounded-3xl shadow-elegant text-center border border-stone-200 hover:shadow-elegant-lg transition-all">
            <div className="inline-flex items-center justify-center w-16 h-16 gradient-primary rounded-2xl mb-6">
              <Mail className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-semibold text-stone-900 mb-2 text-lg">E-post</h3>
            <a href="mailto:post@peersenco.no" className="text-[#2C5F4F] hover:text-[#3A7860] transition-colors font-medium">
              post@peersenco.no
            </a>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-elegant text-center border border-stone-200 hover:shadow-elegant-lg transition-all">
            <div className="inline-flex items-center justify-center w-16 h-16 gradient-primary rounded-2xl mb-6">
              <Phone className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-semibold text-stone-900 mb-2 text-lg">Telefon</h3>
            <a href="tel:+4712345678" className="text-[#2C5F4F] hover:text-[#3A7860] transition-colors font-medium">
              +47 123 45 678
            </a>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-elegant text-center border border-stone-200 hover:shadow-elegant-lg transition-all">
            <div className="inline-flex items-center justify-center w-16 h-16 gradient-primary rounded-2xl mb-6">
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-semibold text-stone-900 mb-2 text-lg">Adresse</h3>
            <p className="text-stone-600">Storgata 1<br/>0123 Oslo, Norge</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Column - Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-elegant border border-stone-200">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-[#2C5F4F]" />
                <h3 className="text-xl font-semibold text-stone-900">Åpningstider</h3>
              </div>
              <div className="space-y-3 text-stone-600">
                <div className="flex justify-between">
                  <span>Mandag - Fredag</span>
                  <span className="font-semibold text-stone-900">09:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Lørdag</span>
                  <span className="font-semibold text-stone-900">10:00 - 15:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Søndag</span>
                  <span className="font-semibold text-stone-900">Stengt</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#2C5F4F] to-[#3A7860] p-8 rounded-3xl text-white shadow-elegant">
              <MessageCircle className="w-10 h-10 mb-4 opacity-80" />
              <h3 className="text-xl font-semibold mb-3">Ofte stilte spørsmål</h3>
              <p className="text-white/80 mb-4">
                Besøk vår FAQ-side for raske svar på vanlige spørsmål om produkter, levering og mer.
              </p>
              <a href="#" className="inline-block px-6 py-3 bg-white text-[#2C5F4F] rounded-full hover:shadow-lg transition-all font-semibold text-sm">
                Gå til FAQ
              </a>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-3 bg-white p-10 rounded-3xl shadow-elegant border border-stone-200">
            {submitted && (
              <div className="mb-8 p-5 glass-effect bg-[#2C5F4F] text-white rounded-2xl flex items-center gap-4 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <p className="font-semibold mb-1">Takk for din henvendelse!</p>
                  <p className="text-white/90 text-sm">Vi kommer tilbake til deg snart.</p>
                </div>
              </div>
            )}

            <h2 className="text-2xl font-semibold text-stone-900 mb-6">Send oss en melding</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-stone-900 mb-2">
                    Navn *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-[#2C5F4F] transition-colors bg-white text-stone-900"
                    placeholder="Ditt fulle navn"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-900 mb-2">
                    E-post *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-[#2C5F4F] transition-colors bg-white text-stone-900"
                    placeholder="din@epost.no"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-2">
                  Emne *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-[#2C5F4F] transition-colors bg-white text-stone-900"
                  placeholder="Hva gjelder henvendelsen?"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-2">
                  Melding *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-5 py-4 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-[#2C5F4F] transition-colors bg-white text-stone-900 resize-none"
                  placeholder="Skriv din melding her..."
                />
              </div>

              <button
                type="submit"
                className="w-full gradient-primary text-white px-8 py-4 rounded-xl hover:shadow-elegant-lg transition-all flex items-center justify-center gap-3 font-semibold text-lg group"
              >
                <span>Send melding</span>
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
