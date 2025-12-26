'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { uploadProductImage } from '@/lib/supabase/storage';
import { Plus, Edit2, Trash2, FolderOpen, Upload, X } from 'lucide-react';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  created_at: string;
}

export default function AdminCategoriesPage() {
  const supabase = createClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  }

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', slug: '', description: '', image: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '', image: '' });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[æ]/g, 'ae')
        .replace(/[ø]/g, 'o')
        .replace(/[å]/g, 'a')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      const url = await uploadProductImage(file);
      if (url) {
        setFormData((prev) => ({ ...prev, image: url }));
      } else {
        alert('Kunne ikke laste opp bilde');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Kunne ikke laste opp bilde');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        // Update
        const { error } = await supabase
          .from('categories')
          .update(formData)
          .eq('id', editingCategory.id);

        if (error) throw error;
        alert('Kategori oppdatert!');
      } else {
        // Insert
        const { error } = await supabase.from('categories').insert([formData]);

        if (error) throw error;
        alert('Kategori opprettet!');
      }

      fetchCategories();
      closeModal();
    } catch (error: any) {
      console.error('Error saving category:', error);
      alert('Kunne ikke lagre kategori: ' + error.message);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Er du sikker på at du vil slette kategorien "${name}"?`)) return;

    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);

      if (error) throw error;

      setCategories(categories.filter((c) => c.id !== id));
      alert('Kategori slettet!');
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Kunne ikke slette kategori');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light text-stone-900">Kategorier</h1>
          <p className="text-stone-600 mt-1">Administrer produktkategorier</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2C5F4F] text-white rounded-xl hover:bg-[#234d3f] transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Ny Kategori</span>
        </button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 animate-pulse"
            >
              <div className="aspect-square bg-stone-200 rounded-xl mb-4"></div>
              <div className="h-4 bg-stone-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-stone-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-stone-200 text-center">
          <FolderOpen className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-stone-900 mb-2">
            Ingen kategorier ennå
          </h3>
          <p className="text-stone-600 mb-6">
            Kom i gang ved å opprette din første kategori
          </p>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2C5F4F] text-white rounded-xl hover:bg-[#234d3f] transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Opprett kategori</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-all group"
            >
              {/* Category Image */}
              <div className="relative aspect-square bg-stone-100">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FolderOpen className="w-16 h-16 text-stone-300" />
                  </div>
                )}
              </div>

              {/* Category Info */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-medium text-stone-900 mb-1 group-hover:text-[#2C5F4F] transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-stone-600 line-clamp-2">
                    {category.description}
                  </p>
                </div>

                <div className="text-xs text-stone-500 font-mono">
                  /{category.slug}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-stone-200">
                  <button
                    onClick={() => openModal(category)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span className="font-medium">Rediger</span>
                  </button>
                  <button
                    onClick={() => handleDelete(category.id, category.name)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-medium text-stone-900 mb-6">
              {editingCategory ? 'Rediger Kategori' : 'Ny Kategori'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Kategorinavn *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5F4F] focus:border-transparent"
                  placeholder="F.eks. Kosttilskudd"
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
                  placeholder="kosttilskudd"
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
                  rows={3}
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5F4F] focus:border-transparent resize-none"
                  placeholder="En kort beskrivelse av kategorien..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Kategori bilde *
                </label>
                
                {!formData.image ? (
                  <label className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-stone-300 rounded-xl cursor-pointer hover:border-[#2C5F4F] hover:bg-stone-50 transition-all">
                    <Upload className="w-5 h-5 text-stone-600" />
                    <span className="text-stone-700 font-medium">
                      {uploadingImage ? 'Laster opp...' : 'Velg bilde fra PC'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative aspect-video rounded-xl overflow-hidden group">
                    <Image
                      src={formData.image}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[#2C5F4F] text-white rounded-xl hover:bg-[#234d3f] transition-all font-medium"
                >
                  {editingCategory ? 'Lagre Endringer' : 'Opprett Kategori'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 bg-stone-100 text-stone-700 rounded-xl hover:bg-stone-200 transition-all font-medium"
                >
                  Avbryt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
