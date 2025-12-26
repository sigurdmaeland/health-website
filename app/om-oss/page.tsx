'use client';

import Link from 'next/link';
import { Award, Heart, Leaf, Shield, Sparkles, Users } from 'lucide-react';

export default function OmOssPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2C5F4F] via-[#3A7860] to-[#2C5F4F] text-white py-32 md:py-40">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#C9A067] rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
            <Sparkles className="w-4 h-4 text-[#C9A067]" />
            <span className="text-sm font-medium">Siden 2020</span>
          </div>
          <div className="flex flex-col items-center mb-8">
            <span className="text-6xl md:text-7xl font-light tracking-wider mb-3">
              PEERSEN
            </span>
            <span className="text-base md:text-lg tracking-[0.5em] text-[#C9A067] font-medium">
              & COMPANY
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-light mb-6 tracking-tight leading-tight">
            Eleganse i hver detalj
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Vi kuraterer de fineste hudpleie- og velværeproduktene
            for det nordiske klimaet.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Story Section with Image */}
        <section className="py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="space-y-6 animate-fade-in order-2 md:order-1">
              <span className="text-[#C9A067] font-medium text-sm tracking-wider uppercase block">
                Vår Historie
              </span>
              <h2 className="text-4xl md:text-5xl font-light text-stone-900 tracking-tight">
                En lidenskap for
                <span className="block font-semibold mt-2">naturlig skjønnhet</span>
              </h2>
              <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                <p>
                  Peersen & Company ble født ut av en dyp overbevisning om at hudpleie skal være mer 
                  enn bare rutine – det skal være en opplevelse av luksus og velvære.
                </p>
                <p>
                  Grunnlagt i 2020 av hudpleieentusiaster med over 15 års erfaring i skjønnhetsindustrien, 
                  har vi kuratert et eksklusivt utvalg av produkter som kombinerer naturlige ingredienser 
                  med vitenskapelig innovasjon.
                </p>
                <p>
                  Vårt nordiske arv former alt vi gjør. Vi forstår utfordringene det nordiske klimaet 
                  byr på, og velger derfor kun produkter som er testet og godkjent for våre unike forhold.
                </p>
              </div>
            </div>
            
            <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-elegant order-1 md:order-2">
              <img
                src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=1200"
                alt="Peersen & Company"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C5F4F]/30 to-transparent" />
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 md:py-28 bg-white rounded-3xl shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#C9A067] font-medium text-sm tracking-wider uppercase block mb-4">
                Våre Verdier
              </span>
              <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-6 tracking-tight">
                Det vi står for
              </h2>
              <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                Hver beslutning vi tar er forankret i disse kjerneverdiene
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group text-center p-8 rounded-2xl hover:bg-stone-50 transition-all">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">Premium Kvalitet</h3>
                <p className="text-stone-600 leading-relaxed">
                  Hver produkt er håndplukket og testet for å sikre høyeste standard
                </p>
              </div>
              
              <div className="group text-center p-8 rounded-2xl hover:bg-stone-50 transition-all">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">Naturlige Ingredienser</h3>
                <p className="text-stone-600 leading-relaxed">
                  Vi prioriterer rene, effektive ingredienser fra naturen
                </p>
              </div>
              
              <div className="group text-center p-8 rounded-2xl hover:bg-stone-50 transition-all">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">Bærekraft</h3>
                <p className="text-stone-600 leading-relaxed">
                  Miljøvennlige valg i produkter, emballasje og forretningspraksis
                </p>
              </div>
              
              <div className="group text-center p-8 rounded-2xl hover:bg-stone-50 transition-all">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">Eksklusiv Service</h3>
                <p className="text-stone-600 leading-relaxed">
                  Personlig rådgivning og førsteklasses kundeopplevelse
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 md:py-28">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#2C5F4F] mb-2">2020</div>
              <p className="text-stone-600 font-medium">Etablert</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#2C5F4F] mb-2">5000+</div>
              <p className="text-stone-600 font-medium">Fornøyde kunder</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#2C5F4F] mb-2">200+</div>
              <p className="text-stone-600 font-medium">Premium produkter</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#2C5F4F] mb-2">100%</div>
              <p className="text-stone-600 font-medium">Naturlige ingredienser</p>
            </div>
          </div>
        </section>

        {/* Image Gallery */}
        <section className="py-20 md:py-28">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="relative h-[300px] rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=800"
                alt="Våre produkter"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="relative h-[300px] rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1571875257727-256c39da42af?q=80&w=800"
                alt="Hudpleie"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="relative h-[300px] rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800"
                alt="Velvære"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#2C5F4F] to-[#3A7860] rounded-3xl p-12 md:p-20 text-white text-center">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#C9A067] rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-tight">
                Opplev Peersen & Company
              </h2>
              <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                Besøk vår kolleksjon og oppdag hvorfor tusenvis av kunder stoler på oss for 
                deres daglige hudpleierutine.
              </p>
              <Link 
                href="/produkter" 
                className="inline-flex items-center gap-2 px-10 py-5 bg-white text-[#2C5F4F] rounded-full hover:shadow-elegant-lg transition-all font-semibold text-lg hover:scale-105"
              >
                Utforsk produktene våre
              </Link>
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section className="py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-light text-stone-900 mb-8">Kontakt oss</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-stone-900 mb-2">E-post</h4>
                <a href="mailto:post@peersenco.no" className="text-stone-600 hover:text-[#2C5F4F] transition-colors">
                  post@peersenco.no
                </a>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-stone-900 mb-2">Telefon</h4>
                <a href="tel:+4712345678" className="text-stone-600 hover:text-[#2C5F4F] transition-colors">
                  +47 123 45 678
                </a>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-stone-900 mb-2">Adresse</h4>
                <p className="text-stone-600">
                  Storgata 1<br/>0123 Oslo, Norge
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
