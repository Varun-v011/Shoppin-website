import React, { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Upload, 
  Image as ImageIcon,
  Search,
  Filter
} from 'lucide-react';

const ProductManagement = ({ onStatsUpdate }) => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOccasion, setFilterOccasion] = useState('all');
  
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    collection: '',
    priceRange: '',
    sizes: [],
    occasion: 'festive',
    style: 'traditional',
    image: '',
    images: [],
    fabric: '',
    fit: '',
    care: '',
    stock: '',
    description: ''
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsRef = collection(db, 'products');
      const snapshot = await getDocs(productsRef);
      const productsData = snapshot.docs.map(doc => ({
        docId: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const uploadImage = async (file, path) => {
    const storageRef = ref(storage, `products/${path}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleImageUpload = (e, type = 'main') => {
    const files = Array.from(e.target.files);
    if (type === 'main') {
      setMainImageFile(files[0]);
    } else {
      setImageFiles(files);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadProgress(true);

    try {
      let imageUrl = formData.image;
      let imageUrls = formData.images;

      // Upload main image if new file selected
      if (mainImageFile) {
        imageUrl = await uploadImage(mainImageFile, 'main');
      }

      // Upload additional images if new files selected
      if (imageFiles.length > 0) {
        imageUrls = await Promise.all(
          imageFiles.map(file => uploadImage(file, 'gallery'))
        );
      }

      const productData = {
        ...formData,
        image: imageUrl,
        images: imageUrls.length > 0 ? imageUrls : [imageUrl],
        updatedAt: serverTimestamp()
      };

      if (editingProduct) {
        // Update existing product
        await updateDoc(doc(db, 'products', editingProduct.docId), productData);
      } else {
        // Add new product
        productData.createdAt = serverTimestamp();
        await addDoc(collection(db, 'products'), productData);
      }

      // Reset form
      resetForm();
      fetchProducts();
      onStatsUpdate();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    } finally {
      setUploadProgress(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      id: product.id,
      title: product.title,
      collection: product.collection,
      priceRange: product.priceRange,
      sizes: product.sizes,
      occasion: product.occasion,
      style: product.style,
      image: product.image,
      images: product.images || [],
      fabric: product.fabric,
      fit: product.fit,
      care: product.care,
      stock: product.stock,
      description: product.description
    });
    setShowForm(true);
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'products', product.docId));
      fetchProducts();
      onStatsUpdate();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      collection: '',
      priceRange: '',
      sizes: [],
      occasion: 'festive',
      style: 'traditional',
      image: '',
      images: [],
      fabric: '',
      fit: '',
      care: '',
      stock: '',
      description: ''
    });
    setEditingProduct(null);
    setMainImageFile(null);
    setImageFiles([]);
  };

  const handleSizeToggle = (size) => {
    const sizes = formData.sizes.includes(size)
      ? formData.sizes.filter(s => s !== size)
      : [...formData.sizes, size];
    setFormData({ ...formData, sizes });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterOccasion === 'all' || product.occasion === filterOccasion;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-serif text-stone-800 mb-2">Products Management</h2>
          <p className="text-stone-600">{products.length} total products</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Search and Filter */}
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
          <div className="inline-block w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-stone-600 mt-4">Loading products...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.docId} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-[3/4] bg-stone-100 relative">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
                  {product.id}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-serif text-lg text-stone-800 mb-1">{product.title}</h3>
                <p className="text-amber-700 font-medium mb-2">{product.priceRange}</p>
                <div className="flex items-center gap-2 text-xs text-stone-500 mb-4">
                  <span className="capitalize">{product.occasion}</span>
                  <span>•</span>
                  <span>{product.stock}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
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

      {/* Add/Edit Product Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-serif text-stone-800">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Product ID */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Product Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="SAR001"
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Silk Chanderi Saree"
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Collection */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Collection *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.collection}
                    onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                    placeholder="Festive Sarees"
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Price Range *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.priceRange}
                    onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                    placeholder="₹3,500 - ₹4,200"
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Occasion */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Occasion *
                  </label>
                  <select
                    required
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="festive">Festive</option>
                    <option value="casual">Casual</option>
                  </select>
                </div>

                {/* Style */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Style *
                  </label>
                  <select
                    required
                    value={formData.style}
                    onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="traditional">Traditional</option>
                    <option value="contemporary">Contemporary</option>
                  </select>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Available Sizes *
                </label>
                <div className="flex flex-wrap gap-2">
                  {['S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
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
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Main Image *
                  </label>
                  <div className="border-2 border-dashed border-stone-300 rounded-lg p-4 text-center hover:border-amber-500 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'main')}
                      className="hidden"
                      id="main-image"
                    />
                    <label htmlFor="main-image" className="cursor-pointer">
                      <ImageIcon className="w-12 h-12 text-stone-400 mx-auto mb-2" />
                      <p className="text-sm text-stone-600">
                        {mainImageFile ? mainImageFile.name : 'Click to upload main image'}
                      </p>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Gallery Images
                  </label>
                  <div className="border-2 border-dashed border-stone-300 rounded-lg p-4 text-center hover:border-amber-500 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e, 'gallery')}
                      className="hidden"
                      id="gallery-images"
                    />
                    <label htmlFor="gallery-images" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-stone-400 mx-auto mb-2" />
                      <p className="text-sm text-stone-600">
                        {imageFiles.length > 0 ? `${imageFiles.length} files selected` : 'Click to upload gallery images'}
                      </p>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Fabric */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Fabric *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    placeholder="Pure Chanderi Silk"
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Fit */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Fit *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fit}
                    onChange={(e) => setFormData({ ...formData, fit: e.target.value })}
                    placeholder="Traditional 6-yard drape"
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Care */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Care Instructions *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.care}
                    onChange={(e) => setFormData({ ...formData, care: e.target.value })}
                    placeholder="Dry clean only"
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Stock Status *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="In Stock - 3 pieces"
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Elegant chanderi silk saree..."
                  rows={4}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadProgress}
                  className="flex-1 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
                >
                  {uploadProgress ? 'Uploading...' : (editingProduct ? 'Update Product' : 'Add Product')}
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