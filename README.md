# 🧴 Helsebutikk - Moderne Nettbutikk for Helse- og Skjønnhetsprodukter

En profesjonell, fullt responsiv nettbutikk bygget med Next.js 15, TypeScript og Tailwind CSS.

## ✨ Funksjoner

### 🛍️ Kjernefunksjonalitet
- **Moderne produktvisning** med filtrering og sortering
- **Handlekurv** med localStorage-persistering
- **Checkout-prosess** (klar for betalingsintegrasjon)
- **Produktdetaljsider** med bildegalleri og relaterte produkter
- **Kategoribasert navigasjon**

### 🎨 Design
- **Skandinavisk design** med myke, nøytrale farger
- **Fullt responsiv** - Mobile-first tilnærming
- **Smooth animasjoner** og hover-effekter
- **Moderne typografi** med Inter font

### 🔧 Teknologi
- **Next.js 15** (App Router)
- **TypeScript** for type-sikkerhet
- **Tailwind CSS v4** for styling
- **React Context API** for state management
- **Lucide React** for ikoner

## 🚀 Kom i gang

### Installer dependencies
```bash
npm install
```

### Kjør development server
```bash
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000) i nettleseren.

### Build for produksjon
```bash
npm run build
npm start
```

## 📁 Prosjektstruktur

```
helsebutikk/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Forside
│   ├── layout.tsx         # Root layout med Header/Footer
│   ├── produkter/         # Produktliste og detaljsider
│   ├── handlekurv/        # Handlekurv
│   ├── checkout/          # Checkout-prosess
│   ├── om-oss/            # Om oss-side
│   ├── kontakt/           # Kontaktskjema
│   ├── personvern/        # Personvernerklæring
│   └── vilkar/            # Vilkår og betingelser
├── components/            # React-komponenter
│   ├── Header.tsx         # Sticky header med navigasjon
│   ├── Footer.tsx         # Footer med lenker og nyhetsbrev
│   └── ProductCard.tsx    # Gjenbrukbart produktkort
├── context/               # React Context
│   └── CartContext.tsx    # Handlekurv state management
├── data/                  # Mock data
│   └── products.ts        # Produkter og kategorier
├── types/                 # TypeScript types
│   └── index.ts           # Alle type-definisjoner
└── public/                # Statiske filer
```

## 🎨 Fargepalett

- **Primary**: #88B5A0 (Nordisk grønn)
- **Primary Dark**: #6B9483
- **Secondary**: #F5F5F0 (Lys beige)
- **Accent**: #D4A574 (Gull)
- **Grays**: #FAFAFA til #262626

## 📦 Hovedkomponenter

### CartContext
Håndterer all handlekurv-logikk:
- Legg til/fjern produkter
- Oppdater mengde
- Persistering i localStorage
- Totalpris-beregning

### Header
- Sticky navigasjon
- Søkefunksjonalitet
- Handlekurv-ikon med antall
- Responsiv hamburger-meny

### ProductCard
- Produktbilde (placeholder)
- Pris med rabatt
- Rating og anmeldelser
- "Legg i handlekurv"-knapp
- Favoritt-funksjonalitet

## 🔮 Videre utvikling

### Foreslåtte forbedringer:
1. **Backend-integrasjon**
   - Node.js/Express API
   - PostgreSQL database
   - Autentisering (NextAuth.js)

2. **Betalingsintegrasjon**
   - Vipps
   - Stripe
   - Klarna

3. **Søkefunksjonalitet**
   - Full-text søk
   - Autocomplete
   - Søkeforslag

4. **Brukerkontoer**
   - Registrering/innlogging
   - Ordrehistorikk
   - Favoritter
   - Adressebok

5. **Admin-panel**
   - Produktadministrasjon
   - Ordrehåndtering
   - Kundeservice

6. **Tilleggsfunksjoner**
   - Produktanmeldelser
   - Wishlist
   - Dark mode
   - Flerspråklig støtte
   - E-postnotifikasjoner

## 📱 Responsivitet

- **Mobil** (< 640px): 1 kolonne, hamburger-meny
- **Tablet** (640px - 1024px): 2-3 kolonner
- **Desktop** (> 1024px): 4 kolonner, full navigasjon

## ⚡ Ytelse

- Lazy loading av bilder (klar for Next.js Image)
- Code splitting med Next.js
- Optimalisert CSS med Tailwind
- Minimal JavaScript bundle

## 📝 Notater

- Produktbilder er foreløpig placeholders (emojis)
- Betalingsfunksjonalitet er mock (demo)
- API-integrasjon må implementeres
- Mock produktdata i `data/products.ts`

## 👥 Kontakt

For spørsmål eller support:
- E-post: post@helsebutikk.no
- Telefon: +47 123 45 678

## 📄 Lisens

Dette er et demo-prosjekt.

