import Link from 'next/link';
import { Facebook, Instagram, Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#F8F6F3] to-[#FBF9F6] border-t border-stone-200">
      {/* Newsletter Section */}
      <div className="border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-3xl font-light text-stone-900 mb-3 tracking-tight">
              Hold deg oppdatert
            </h3>
            <p className="text-stone-600 mb-8 text-lg">
              Meld deg på nyhetsbrevet vårt og få eksklusive tilbud og tips om hudpleie
            </p>
            <form className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Din e-postadresse"
                className="flex-1 px-5 py-3.5 border border-stone-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2C5F4F] focus:border-transparent text-sm bg-white shadow-sm"
              />
              <button
                type="submit"
                className="px-7 py-3.5 gradient-primary text-white rounded-full hover:shadow-lg transition-all font-medium inline-flex items-center gap-2 shadow-md"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Abonner</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Om Peersen & Co */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <div className="flex flex-col">
                <span className="text-2xl font-light tracking-wider text-[#2C5F4F]">
                  PEERSEN
                </span>
                <span className="text-[10px] tracking-[0.3em] text-[#C9A067] font-medium -mt-1">
                  & COMPANY
                </span>
              </div>
            </div>
            <p className="text-stone-600 text-sm leading-relaxed mb-6">
              Din kilde til eksklusiv hudpleie og velværeprodukter. Kvalitet og eleganse i hver detalj.
            </p>
            <div className="flex space-x-3">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 hover:border-[#2C5F4F] hover:text-[#2C5F4F] hover:bg-[#2C5F4F]/5 transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 hover:border-[#2C5F4F] hover:text-[#2C5F4F] hover:bg-[#2C5F4F]/5 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Kundeservice */}
          <div>
            <h3 className="text-sm font-semibold text-stone-900 mb-5 tracking-wide uppercase">
              Kundeservice
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Kontakt oss', href: '/kontakt' },
                { name: 'Ofte stilte spørsmål', href: '/faq' },
                { name: 'Levering', href: '/levering' },
                { name: 'Retur & Bytte', href: '/retur' },
                { name: 'Vilkår', href: '/vilkar' },
                { name: 'Personvern', href: '/personvern' }
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className="text-sm text-stone-600 hover:text-[#2C5F4F] transition-colors inline-flex items-center group"
                  >
                    <span className="border-b border-transparent group-hover:border-[#2C5F4F] transition-all">
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kategorier */}
          <div>
            <h3 className="text-sm font-semibold text-stone-900 mb-5 tracking-wide uppercase">
              Produkter
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Ansiktskrem', href: '/kategorier/ansiktskrem' },
                { name: 'Kroppspleie', href: '/kategorier/kroppspleie' },
                { name: 'Helsekost', href: '/kategorier/helsekost' },
                { name: 'Kosttilskudd', href: '/kategorier/kosttilskudd' },
                { name: 'Nye produkter', href: '/nyheter' },
                { name: 'Bestselgere', href: '/bestselgere' }
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className="text-sm text-stone-600 hover:text-[#2C5F4F] transition-colors inline-flex items-center group"
                  >
                    <span className="border-b border-transparent group-hover:border-[#2C5F4F] transition-all">
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontaktinfo */}
          <div>
            <h3 className="text-sm font-semibold text-stone-900 mb-5 tracking-wide uppercase">
              Kontakt
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm text-stone-600">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#2C5F4F]" />
                <a href="mailto:post@peersenco.no" className="hover:text-[#2C5F4F] transition-colors">
                  post@peersenco.no
                </a>
              </li>
              <li className="flex items-start space-x-3 text-sm text-stone-600">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#2C5F4F]" />
                <a href="tel:+4712345678" className="hover:text-[#2C5F4F] transition-colors">
                  +47 123 45 678
                </a>
              </li>
              <li className="flex items-start space-x-3 text-sm text-stone-600">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#2C5F4F]" />
                <span>Storgata 1<br />0123 Oslo, Norge</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-stone-600">
            &copy; {currentYear} Peersen & Company. Alle rettigheter reservert.
          </p>
          <div className="flex items-center gap-6 text-sm text-stone-600">
            <span className="flex items-center gap-2">
              <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none">
                <rect width="32" height="20" rx="2" fill="#1434CB"/>
                <path d="M13 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" fill="#EB001B"/>
                <path d="M19 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" fill="#F79E1B"/>
              </svg>
              <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none">
                <rect width="32" height="20" rx="2" fill="#0A2540"/>
                <path d="M8 6h16v8H8z" fill="#635BFF"/>
              </svg>
            </span>
            <span className="text-xs">Sikker betaling</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
