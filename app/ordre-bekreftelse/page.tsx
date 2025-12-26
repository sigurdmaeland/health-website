'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Truck, Mail, ArrowRight } from 'lucide-react';

export default function OrdreBekreftelsePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    if (!orderId) {
      router.push('/');
      return;
    }
    setOrderNumber(orderId);
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6 animate-scale-in">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-light text-stone-900 mb-3">
            Takk for din bestilling!
          </h1>
          <p className="text-lg text-stone-600">
            Vi har mottatt ordren din og behandler den nå
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-3xl shadow-elegant border border-stone-200 p-8 mb-6">
          <div className="border-b border-stone-200 pb-6 mb-6">
            <p className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-2">
              Ordrenummer
            </p>
            <p className="text-2xl font-bold text-[#2C5F4F]">
              #{orderNumber}
            </p>
          </div>

          <div className="space-y-6">
            {/* Email Confirmation */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#2C5F4F]/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-[#2C5F4F]" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-900 mb-1">
                  Bekreftelse sendt
                </h3>
                <p className="text-stone-600 text-sm">
                  En ordrebekreftelse er sendt til din e-postadresse med alle detaljer.
                </p>
              </div>
            </div>

            {/* Processing */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#2C5F4F]/10 flex items-center justify-center flex-shrink-0">
                <Package className="w-6 h-6 text-[#2C5F4F]" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-900 mb-1">
                  Behandler ordre
                </h3>
                <p className="text-stone-600 text-sm">
                  Din ordre er nå under behandling. Vi pakker produktene dine med omhu.
                </p>
              </div>
            </div>

            {/* Shipping */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#2C5F4F]/10 flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-[#2C5F4F]" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-900 mb-1">
                  Forventet levering
                </h3>
                <p className="text-stone-600 text-sm">
                  2-4 virkedager. Du vil motta en sporingslenke når pakken er sendt.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/konto/ordrer"
            className="flex-1 px-6 py-4 gradient-primary text-white rounded-xl hover:shadow-elegant-lg transition-all font-semibold text-center"
          >
            Se ordrehistorikk
          </Link>
          <Link
            href="/produkter"
            className="flex-1 px-6 py-4 border-2 border-stone-300 text-stone-700 rounded-xl hover:bg-stone-50 transition-all font-semibold text-center flex items-center justify-center gap-2"
          >
            <span>Fortsett å handle</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Support Info */}
        <div className="mt-8 p-6 bg-stone-100 rounded-2xl text-center">
          <p className="text-sm text-stone-600">
            Har du spørsmål om ordren din?{' '}
            <a href="mailto:post@peersenco.no" className="text-[#2C5F4F] font-semibold hover:underline">
              Kontakt kundeservice
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
