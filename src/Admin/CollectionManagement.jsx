import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Plus, Edit, Trash2, X, Image as ImageIcon } from 'lucide-react';

const emptyForm = { name: '', tagline: '', image: '', count: 0 };

const CollectionManagement = ({ onStatsUpdate }) => {
  const [collections, setCollections] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchCollections(); }, []);

  const fetchCollections = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setCollections(data || []);
    setLoading(false);
  };

  const uploadImage = async (file) => {
    const ext = file.name.split('.').pop();
    const path = `collections/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('product-images').upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    return data.publicUrl;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = formData.image;
      if (imageFile) imageUrl = await uploadImage(imageFile);

      const payload = {
        ...formData,
        image: imageUrl,
        updated_at: new Date().toISOString(),
      };

      if (editingCollection) {
        const { error } = await supabase
          .from('collections')
          .update(payload)
          .eq('doc_id', editingCollection.doc_id);
        if (error) throw error;
      } else {
        payload.created_at = new Date().toISOString();
        const { error } = await supabase.from('collections').insert([payload]);
        if (error) throw error;
      }

      resetForm();
      setShowForm(false);
      fetchCollections();
      onStatsUpdate();
    } catch (error) {
      console.error('Error saving collection:', error);
      alert('Error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (coll) => {
    setEditingCollection(coll);
    setFormData({ name: coll.name, tagline: coll.tagline, image: coll.image, count: coll.count });
    setImagePreview(coll.image || null);
    setShowForm(true);
  };

  const handleDelete = async (coll) => {
    if (!window.confirm(`Delete "${coll.name}" collection?`)) return;
    const { error } = await supabase.from('collections').delete().eq('doc_id', coll.doc_id);
    if (error) alert('Delete failed: ' + error.message);
    else { fetchCollections(); onStatsUpdate(); }
  };

  const resetForm = () => {
    setFormData({ ...emptyForm });
    setEditingCollection(null);
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-serif text-stone-800 mb-2">Collections Management</h2>
          <p className="text-stone-600">{collections.length} total collections</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Collection
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-stone-600 mt-4">Loading collections...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((coll) => (
            <div key={coll.doc_id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-[3/4] bg-stone-100 relative">
                {coll.image && (
                  <img src={coll.image} alt={coll.name} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-serif text-xl mb-1">{coll.name}</h3>
                  <p className="text-sm text-white/90">{coll.tagline}</p>
                  <p className="text-xs mt-2">{coll.count} pieces</p>
                </div>
              </div>
              <div className="p-4 flex gap-2">
                <button
                  onClick={() => handleEdit(coll)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors text-sm"
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(coll)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-serif text-stone-800">
                {editingCollection ? 'Edit Collection' : 'Add New Collection'}
              </h3>
              <button
                onClick={() => { setShowForm(false); resetForm(); }}
                className="p-2 hover:bg-stone-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {[
                { key: 'name', label: 'Collection Name', placeholder: 'Festive Sarees', required: true },
                { key: 'tagline', label: 'Tagline', placeholder: 'Elegance for Every Celebration', required: true },
              ].map(({ key, label, placeholder, required }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-stone-700 mb-2">{label} {required && '*'}</label>
                  <input
                    type="text"
                    required={required}
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Number of Items</label>
                <input
                  type="number"
                  min="0"
                  value={formData.count}
                  onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Collection Image</label>
                <div className="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center hover:border-amber-500 transition-colors">
                  {imagePreview ? (
                    <div>
                      <img src={imagePreview} alt="preview" className="w-full h-48 object-cover rounded-lg mb-2" />
                      <label htmlFor="coll-image" className="text-xs text-amber-600 cursor-pointer hover:underline">
                        Change image
                      </label>
                    </div>
                  ) : (
                    <label htmlFor="coll-image" className="cursor-pointer block">
                      <ImageIcon className="w-12 h-12 text-stone-400 mx-auto mb-3" />
                      <p className="text-sm text-stone-600">Click to upload collection image</p>
                      <p className="text-xs text-stone-400 mt-1">Recommended: 800×1200px (3:4 ratio)</p>
                    </label>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="coll-image"
                  />
                </div>
              </div>

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
                  {uploading ? 'Uploading...' : editingCollection ? 'Update Collection' : 'Add Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionManagement;
