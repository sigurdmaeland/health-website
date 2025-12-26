'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { uploadProductImage } from '@/lib/supabase/storage';
import { ArrowLeft, X, Plus, Upload } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  category: string;
  images: string[];
  ingredients: string;
  usage: string;
  in_stock: boolean;
  featured: boolean;
  faqs: { question: string; answer: string }[];
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    compare_at_price: '',
    category: '',
    ingredients: '',
    usage: '',
    in_stock: true,
    featured: false,
  });

  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  async function fetchProduct() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          name: data.name,
          slug: data.slug,
          description: data.description,
          price: data.price.toString(),
          compare_at_price: data.compare_at_price ? data.compare_at_price.toString() : '',
          category: data.category,
          ingredients: data.ingredients || '',
          usage: data.usage || '',
          in_stock: data.in_stock,
          featured: data.featured,
        });
        setImageUrls(data.images || []);
        setFaqs(data.faqs || []);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Kunne ikke hente produkt');
    } finally {
      setFetching(false);
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const url = await uploadProductImage(file);
        return url;
      });

      const urls = await Promise.all(uploadPromises);
      const validUrls = urls.filter((url): url is string => url !== null);
      
      setImageUrls([...imageUrls, ...validUrls]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Kunne ikke laste opp bilder');
    } finally {
      setUploadingImage(false);
      e.target.value = ''; // Reset file input
    }
  };

  const handleRemoveImage = (url: string) => {
    setImageUrls(imageUrls.filter((img) => img !== url));
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index][field] = value;
    setFaqs(updatedFaqs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          price: parseFloat(formData.price),
          compare_at_price: formData.compare_at_price
            ? parseFloat(formData.compare_at_price)
            : null,
          category: formData.category,
          images: imageUrls,
          ingredients: formData.ingredients,
          usage: formData.usage,
          in_stock: formData.in_stock,
          featured: formData.featured,
          faqs: faqs,
        })
        .eq('id', params.id);

      if (error) throw error;

      alert('Produkt oppdatert!');
      router.push('/admin/produkter');
    } catch (error: any) {
      console.error('Error updating product:', error);
      alert('Kunne ikke oppdatere produkt: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-stone-200 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#2C5F4F] border-t-transparent rounded-full mx-auto"></div>
          <p className="text-stone-600 mt-4">Laster produkt...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/produkter"
          className="p-2 hover:bg-stone-100 rounded-lg transition-all"
        >
          <ArrowLeft className="w-6 h-6 text-stone-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-light text-stone-900">Rediger Produkt</h1>
          <p className="text-stone-600 mt-1">Oppdater produktinformasjon</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 space-y-6">
          <h2 className="text-xl font-medium text-stone-900">Grunnleggende informasjon</h2>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Produktnavn *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5F4F] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Slug (URL-vennlig navn) *
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5F4F] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Beskrivelse *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5F4F] focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Kategori *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5F4F] focus:border-transparent"
            >
              <option value="">Velg kategori</option>
              <option value="Kosttilskudd">Kosttilskudd</option>
              <option value="Vitaminer">Vitaminer</option>
              <option value="Mineraler">Mineraler</option>
              <option value="Proteiner">Proteiner</option>
              <option value="Omega-3">Omega-3</option>
              <option value="Helsekost">Helsekost</option>
            </select>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 space-y-6">
          <h2 className="text-xl font-medium text-stone-900">Priser</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Pris (kr) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5F4F] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Sammenlign til pris (kr)
              </label>
              <input
                type="number"
                name="compare_at_price"
                value={formData.compare_at_price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5F4F] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 space-y-6">
          <h2 className="text-xl font-medium text-stone-900">Bilder</h2>

          <div className="flex flex-col gap-4">
            <label className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-stone-300 rounded-xl cursor-pointer hover:border-[#2C5F4F] hover:bg-stone-50 transition-all">
              <Upload className="w-5 h-5 text-stone-600" />
              <span className="text-stone-700 font-medium">
                {uploadingImage ? 'Laster opp...' : 'Velg bilder fra PC'}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>
            <p className="text-xs text-stone-500 text-center">
              Du kan velge flere bilder samtidig. Støttede formater: JPG, PNG, WebP
            </p>
          </div>

          {imageUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative group aspect-square">
                  <Image
                    src={url}
                    alt={`Product ${index + 1}`}
                    fill
                    className="object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(url)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 space-y-6">
          <h2 className="text-xl font-medium text-stone-900">Produktdetaljer</h2>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Ingredienser
            </label>
            <textarea
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5F4F] focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Bruksanvisning
            </label>
            <textarea
              name="usage"
              value={formData.usage}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5F4F] focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 space-y-4">
          <h2 className="text-xl font-medium text-stone-900">Status</h2>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="in_stock"
              checked={formData.in_stock}
              onChange={handleChange}
              className="w-5 h-5 text-[#2C5F4F] border-stone-300 rounded focus:ring-2 focus:ring-[#2C5F4F]"
            />
            <span className="text-stone-700 font-medium">På lager</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-5 h-5 text-[#2C5F4F] border-stone-300 rounded focus:ring-2 focus:ring-[#2C5F4F]"
            />
            <span className="text-stone-700 font-medium">Featured produkt</span>
          </label>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-stone-900">Ofte stilte spørsmål (FAQ)</h2>
            <button
              type="button"
              onClick={handleAddFaq}
              className="flex items-center gap-2 px-4 py-2 bg-[#2C5F4F] text-white rounded-lg hover:bg-[#234d3f] transition-all"
            >
              <Plus className="w-4 h-4" />
              Legg til spørsmål
            </button>
          </div>

          {faqs.length === 0 ? (
            <p className="text-stone-500 text-center py-8">
              Ingen spørsmål lagt til ennå. Klikk på "Legg til spørsmål" for å starte.
            </p>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="p-4 border border-stone-200 rounded-xl space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-sm font-medium text-stone-500">Spørsmål {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(index)}
                      className="p-1 hover:bg-red-50 rounded transition-all text-red-500"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Spørsmål
                    </label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                      placeholder="F.eks: Hvordan bruker jeg produktet?"
                      className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5F4F] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Svar
                    </label>
                    <textarea
                      value={faq.answer}
                      onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                      placeholder="Skriv svaret her..."
                      rows={3}
                      className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5F4F] focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-4 bg-[#2C5F4F] text-white rounded-xl hover:bg-[#234d3f] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Lagrer...' : 'Lagre Endringer'}
          </button>
          <Link
            href="/admin/produkter"
            className="px-6 py-4 bg-stone-100 text-stone-700 rounded-xl hover:bg-stone-200 transition-all font-medium"
          >
            Avbryt
          </Link>
        </div>
      </form>
    </div>
  );
}
