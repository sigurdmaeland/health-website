import { Product, Category } from '@/types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Ansiktskrem',
    slug: 'ansiktskrem',
    image: '/images/categories/face.jpg',
    description: 'Hudpleie for ansiktet tilpasset nordiske forhold'
  },
  {
    id: '2',
    name: 'Kroppspleie',
    slug: 'kroppspleie',
    image: '/images/categories/body.jpg',
    description: 'Fuktighetsgivende og nærende produkter for kroppen'
  },
  {
    id: '3',
    name: 'Helsekost',
    slug: 'helsekost',
    image: '/images/categories/health.jpg',
    description: 'Naturlige produkter for helse og velvære'
  },
  {
    id: '4',
    name: 'Kosttilskudd',
    slug: 'kosttilskudd',
    image: '/images/categories/supplements.jpg',
    description: 'Vitaminer og mineraler for optimal helse'
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Nordic Glow Dagkrem',
    slug: 'nordic-glow-dagkrem',
    description: 'Lett dagkrem med naturlige ingredienser og SPF 15. Perfekt for nordisk klima med ekstra fuktighet.',
    price: 299,
    originalPrice: 399,
    image: '/images/products/face-cream-1.jpg',
    images: [
      '/images/products/face-cream-1.jpg',
      '/images/products/face-cream-1-alt.jpg'
    ],
    category: 'Ansiktskrem',
    brand: 'Nordic Beauty',
    rating: 4.5,
    reviews: 124,
    inStock: true,
    ingredients: ['Hyaluronsyre', 'Vitamin E', 'Sheasmør', 'Naturlige oljer'],
    usage: 'Påfør på renset ansikt morgen og kveld. Masser forsiktig inn i huden.',
    tags: ['Bestselger', 'Vegansk', 'Norsk']
  },
  {
    id: '2',
    name: 'Havtorn Ansiktsserum',
    slug: 'havtorn-ansiktsserum',
    description: 'Intensivt ansiktsserum med norsk havtorn. Rik på vitamin C og antioksidanter.',
    price: 449,
    image: '/images/products/serum-1.jpg',
    images: ['/images/products/serum-1.jpg'],
    category: 'Ansiktskrem',
    brand: 'Pure Nordic',
    rating: 4.8,
    reviews: 89,
    inStock: true,
    ingredients: ['Havtornolje', 'Vitamin C', 'Hyaluronsyre', 'Aloe vera'],
    usage: 'Bruk 2-3 dråper på fuktig hud før du påfører krem.',
    tags: ['Nyhet', 'Økologisk']
  },
  {
    id: '3',
    name: 'Bodylotion med Lavendel',
    slug: 'bodylotion-med-lavendel',
    description: 'Beroligende bodylotion med nordisk lavendel. Gir langvarig fuktighet.',
    price: 249,
    image: '/images/products/body-lotion-1.jpg',
    category: 'Kroppspleie',
    brand: 'Scandi Care',
    rating: 4.3,
    reviews: 67,
    inStock: true,
    ingredients: ['Lavendelolje', 'Sheasmør', 'Kokosolje', 'Glycerin'],
    usage: 'Masser inn i fuktig hud etter dusj.',
    tags: ['Beroligende']
  },
  {
    id: '4',
    name: 'Bringebær Håndkrem',
    slug: 'bringebaer-haandkrem',
    description: 'Næring for tørre hender med norsk bringebærekstrakt.',
    price: 149,
    originalPrice: 199,
    image: '/images/products/hand-cream-1.jpg',
    category: 'Kroppspleie',
    brand: 'Nordic Beauty',
    rating: 4.6,
    reviews: 156,
    inStock: true,
    ingredients: ['Bringebærekstrakt', 'Sheasmør', 'Vitamin E', 'Beeswax'],
    usage: 'Påfør etter håndvask eller ved behov.',
    tags: ['Populær']
  },
  {
    id: '5',
    name: 'Omega-3 Premium',
    slug: 'omega-3-premium',
    description: 'Høykvalitets omega-3 fra norsk fisk. 1000mg per kapsel.',
    price: 349,
    image: '/images/products/omega3.jpg',
    category: 'Kosttilskudd',
    brand: 'Health Nordic',
    rating: 4.7,
    reviews: 234,
    inStock: true,
    usage: 'Ta 1-2 kapsler daglig med mat.',
    tags: ['Bestselger', 'Norsk fisk']
  },
  {
    id: '6',
    name: 'D-vitamin 75μg',
    slug: 'd-vitamin-75ug',
    description: 'Ekstra D-vitamin for nordiske forhold. Viktig vinterstid.',
    price: 199,
    image: '/images/products/vitamin-d.jpg',
    category: 'Kosttilskudd',
    brand: 'Health Nordic',
    rating: 4.5,
    reviews: 189,
    inStock: true,
    usage: 'Ta 1 tablett daglig.',
    tags: ['Vinter', 'Anbefalt']
  },
  {
    id: '7',
    name: 'Tranebær Urinveier',
    slug: 'tranebaer-urinveier',
    description: 'Konsentrert tranebærekstrakt for god urinveishelse.',
    price: 279,
    image: '/images/products/cranberry.jpg',
    category: 'Helsekost',
    brand: 'Pure Nordic',
    rating: 4.4,
    reviews: 92,
    inStock: true,
    usage: 'Ta 1-2 kapsler daglig.',
    tags: ['Naturlig']
  },
  {
    id: '8',
    name: 'Nattekrem med Retinol',
    slug: 'nattekrem-med-retinol',
    description: 'Anti-age nattekrem med retinol og peptider. For moden hud.',
    price: 549,
    image: '/images/products/night-cream.jpg',
    category: 'Ansiktskrem',
    brand: 'Age Defense',
    rating: 4.9,
    reviews: 78,
    inStock: true,
    ingredients: ['Retinol', 'Peptider', 'Hyaluronsyre', 'Niacinamid'],
    usage: 'Påfør på renset ansikt før sengetid.',
    tags: ['Anti-age', 'Premium']
  }
];
