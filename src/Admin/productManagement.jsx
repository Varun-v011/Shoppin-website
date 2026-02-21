import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import {
  Plus,
  Edit,
  Trash2,
  X,
  Upload,
  Image as ImageIcon,
  Search,
  Star,
} from 'lucide-react';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

const emptyForm = {
  id: '',
  title: '',
  collection: '',
  original_price: '',
  discounted_price: '',
  sizes: [],
  occasion: 'festive',
  style: 'traditional',
  image: '',
  images: [],
  fabric: '',
  fit: '',
  care: '',
  stock: '',
  description: '',
  is_best_seller: false,
};

const ProductManagement = ({ onStatsUpdate }) => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOccasion, setFilterOccasion] = useState('all');
  const [formData, setFormData] = useState({ ...emptyForm });
  const [mainImageFile, setMainImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [mainPreview, setMainPreview] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setProducts(data || []);
    setLoading(false);
  };

  const uploadFile = async (file, folder) => {
    const ext = file.name.split('.').pop();
    const path = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('product-images').upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    return data.publicUrl;
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMainImageFile(file);
    setMainPreview(URL.createObjectURL(file));
  };

  const handleGalleryChange = (e) => {
    setGalleryFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = formData.image;
      let imageUrls = formData.images || [];

      if (mainImageFile) {
        imageUrl = await uploadFile(mainImageFile, 'main');
      }
      if (galleryFiles.length > 0) {
        imageUrls = await Promise.all(galleryFiles.map((f) => uploadFile(f, 'gallery')));
      }

      const payload = {
        ...formData,
        id: formData.id.toUpperCase(),
        image: imageUrl,
        images: imageUrls.length > 0 ? imageUrls : imageUrl ? [imageUrl] : [],
        original_price: parseFloat(formData.original_price) || 0,
        discounted_price: formData.discounted_price ? parseFloat(formData.discounted_price) : null,
        updated_at: new Date().toISOString(),
      };

      if (editingProduct) {
        const { error } = await supabase.from('products').update(payload).eq('doc_id', editingProduct.doc_id);
        if (error) throw error;
      } else {
        payload.created_at = new Date().toISOString();
        const { error } = await supabase.from('products').insert([payload]);
        if (error) throw error;
      }

      resetForm();
      setShowForm(false);
      fetchProducts();
      onStatsUpdate();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      id: product.id,
      title: product.title,
      collection: product.collection,
      original_price: product.original_price || '',
      discounted_price: product.discounted_price || '',
      sizes: product.sizes || [],
      occasion: product.occasion || 'festive',
      style: product.style || 'traditional',
      image: product.image || '',
      images: product.images || [],
      fabric: product.fabric || '',
      fit: product.fit || '',
      care: product.care || '',
      stock: product.stock || '',
      description: product.description || '',
      is_best_seller: product.is_best_seller || false,
    });
    setMainPreview(product.image || null);
    setShowForm(true);
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('products').delete().eq('doc_id', product.doc_id);
    if (error) alert('Delete failed: ' + error.message);
    else {
      fetchProducts();
      onStatsUpdate();
    }
  };

  const resetForm = () => {
    setFormData({ ...emptyForm });
    setEditingProduct(null);
    setMainImageFile(null);
    setGalleryFiles([]);
    setMainPreview(null);
  };

  const handleSizeToggle = (size) => {
    const sizes = formData.sizes.includes(size)
      ? formData.sizes.filter((s) => s !== size)
      : [...formData.sizes, size];
    setFormData({ ...formData, sizes });
  };

  const filtered = products.filter((p) => {
    const matchSearch =
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchOcc = filterOccasion === 'all' || p.occasion === filterOccasion;
    return matchSearch && matchOcc;
  });

  const inputClass =
    'w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-serif text-stone-800 mb-2">Products Management</h2>
          <p className="text-stone-600">{products.length} total products</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-xl p-4 mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <select
          value={filterOccasion}
          onChange={(e) => setFilterOccasion(e.target.value)}
          className="px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="all">All Occasions</option>
          <option value="festive">Festive</option>
          <option value="casual">Casual</option>
        </select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-stone-600 mt-4">Loading products...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <div
              key={product.doc_id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-[3/4] bg-stone-100 relative">
                {product.image && (
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                )}
                <div className="absolute top-2 left-2 right-2 flex justify-between">
                  <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-mono font-medium">
                    {product.id}
                  </div>
                  {product.is_best_seller && (
                    <div className="bg-amber-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Best Seller
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-serif text-lg text-stone-800 mb-1">{product.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  {product.discounted_price ? (
                    <>
                      <span className="text-amber-700 font-semibold">
                        ₹{Number(product.discounted_price).toLocaleString('en-IN')}
                      </span>
                      <span className="text-stone-400 text-sm line-through">
                        ₹{Number(product.original_price).toLocaleString('en-IN')}
                      </span>
                    </>
                  ) : (
                    <span className="text-amber-700 font-semibold">
                      ₹{Number(product.original_price).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 mb-4 capitalize">{product.occasion} • {product.stock}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-2xl font-serif text-stone-800">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => { setShowForm(false); resetForm(); }}
                className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Row 1: Code + Title */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Product Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="SAR001"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Silk Chanderi Saree"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Row 2: Original Price + Discounted Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Original Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    placeholder="4500"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Discounted Price (₹)
                    <span className="text-stone-400 font-normal"> (optional)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.discounted_price}
                    onChange={(e) => setFormData({ ...formData, discounted_price: e.target.value })}
                    placeholder="3800"
                    className={inputClass}
                  />
                  {formData.discounted_price && formData.original_price && (
                    <p className="text-xs text-green-600 mt-1">
                      {Math.round(
                        ((formData.original_price - formData.discounted_price) /
                          formData.original_price) *
                          100
                      )}
                      % discount
                    </p>
                  )}
                </div>
              </div>

              {/* Row 3: Collection + Occasion + Style */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Collection *</label>
                  <input
                    type="text"
                    required
                    value={formData.collection}
                    onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                    placeholder="Festive Sarees"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Occasion *</label>
                  <select
                    required
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                    className={inputClass}
                  >
                    <option value="festive">Festive</option>
                    <option value="casual">Casual</option>
                    <option value="wedding">Wedding</option>
                    <option value="party">Party</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Style *</label>
                  <select
                    required
                    value={formData.style}
                    onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                    className={inputClass}
                  >
                    <option value="traditional">Traditional</option>
                    <option value="contemporary">Contemporary</option>
                    <option value="fusion">Fusion</option>
                  </select>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Available Sizes *</label>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors text-sm ${
                        formData.sizes.includes(size)
                          ? 'border-amber-600 bg-amber-50 text-amber-700'
                          : 'border-stone-300 hover:border-stone-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Main Image *</label>
                  <div className="border-2 border-dashed border-stone-300 rounded-lg p-4 text-center hover:border-amber-500 transition-colors">
                    {mainPreview ? (
                      <div className="relative">
                        <img src={mainPreview} alt="preview" className="w-full h-40 object-cover rounded-lg mb-2" />
                        <label htmlFor="main-image" className="text-xs text-amber-600 cursor-pointer hover:underline">
                          Change image
                        </label>
                      </div>
                    ) : (
                      <label htmlFor="main-image" className="cursor-pointer block">
                        <ImageIcon className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                        <p className="text-sm text-stone-600">Click to upload main image</p>
                      </label>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageChange}
                      className="hidden"
                      id="main-image"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Gallery Images</label>
                  <div className="border-2 border-dashed border-stone-300 rounded-lg p-4 text-center hover:border-amber-500 transition-colors cursor-pointer">
                    <label htmlFor="gallery-images" className="cursor-pointer block">
                      <Upload className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                      <p className="text-sm text-stone-600">
                        {galleryFiles.length > 0
                          ? `${galleryFiles.length} file(s) selected`
                          : 'Click to upload gallery images'}
                      </p>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryChange}
                      className="hidden"
                      id="gallery-images"
                    />
                  </div>
                </div>
              </div>

              {/* Fabric, Fit, Care, Stock */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'fabric', label: 'Fabric', placeholder: 'Pure Chanderi Silk' },
                  { key: 'fit', label: 'Fit', placeholder: 'Traditional 6-yard drape' },
                  { key: 'care', label: 'Care Instructions', placeholder: 'Dry clean only' },
                  { key: 'stock', label: 'Stock Status', placeholder: 'In Stock - 3 pieces' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-stone-700 mb-2">{label}</label>
                    <input
                      type="text"
                      value={formData[key]}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      placeholder={placeholder}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Elegant chanderi silk saree..."
                  rows={3}
                  className={inputClass}
                />
              </div>

              {/* Best Seller Toggle */}
              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <Star className="w-5 h-5 text-amber-600" />
                <div className="flex-1">
                  <p className="font-medium text-stone-800 text-sm">Mark as Best Seller</p>
                  <p className="text-xs text-stone-500">Best sellers are featured on the home page</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_best_seller}
                    onChange={(e) => setFormData({ ...formData, is_best_seller: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:ring-2 peer-focus:ring-amber-500 rounded-full peer peer-checked:bg-amber-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                </label>
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); resetForm(); }}
                  className="flex-1 px-6 py-3 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
