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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { 
  Plus, 
  Edit, 
  Trash2, 
  X,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

const CollectionManagement = ({ onStatsUpdate }) => {
  const [collections, setCollections] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    image: '',
    count: 0
  });

  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(false);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const collectionsRef = collection(db, 'collections');
      const snapshot = await getDocs(collectionsRef);
      const collectionsData = snapshot.docs.map(doc => ({
        docId: doc.id,
        ...doc.data()
      }));
      setCollections(collectionsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching collections:', error);
      setLoading(false);
    }
  };

  const uploadImage = async (file) => {
    const storageRef = ref(storage, `collections/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadProgress(true);

    try {
      let imageUrl = formData.image;

      // Upload image if new file selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const collectionData = {
        ...formData,
        image: imageUrl,
        updatedAt: serverTimestamp()
      };

      if (editingCollection) {
        // Update existing collection
        await updateDoc(doc(db, 'collections', editingCollection.docId), collectionData);
      } else {
        // Add new collection
        collectionData.createdAt = serverTimestamp();
        await addDoc(collection(db, 'collections'), collectionData);
      }

      // Reset form
      resetForm();
      fetchCollections();
      onStatsUpdate();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving collection:', error);
      alert('Error saving collection. Please try again.');
    } finally {
      setUploadProgress(false);
    }
  };

  const handleEdit = (coll) => {
    setEditingCollection(coll);
    setFormData({
      name: coll.name,
      tagline: coll.tagline,
      image: coll.image,
      count: coll.count
    });
    setShowForm(true);
  };

  const handleDelete = async (coll) => {
    if (!window.confirm(`Delete "${coll.name}" collection? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'collections', coll.docId));
      fetchCollections();
      onStatsUpdate();
    } catch (error) {
      console.error('Error deleting collection:', error);
      alert('Error deleting collection. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      tagline: '',
      image: '',
      count: 0
    });
    setEditingCollection(null);
    setImageFile(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-serif text-stone-800 mb-2">Collections Management</h2>
          <p className="text-stone-600">{collections.length} total collections</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Collection
        </button>
      </div>

      {/* Collections Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-stone-600 mt-4">Loading collections...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((coll) => (
            <div key={coll.docId} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-[3/4] bg-stone-100 relative">
                <img
                  src={coll.image}
                  alt={coll.name}
                  className="w-full h-full object-cover"
                />
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
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(coll)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Collection Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-serif text-stone-800">
                {editingCollection ? 'Edit Collection' : 'Add New Collection'}
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
              {/* Collection Name */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Collection Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Festive Sarees"
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Tagline *
                </label>
                <input
                  type="text"
                  required
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Elegance for Every Celebration"
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Item Count */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Number of Items *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.count}
                  onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) })}
                  placeholder="24"
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Collection Image */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Collection Image *
                </label>
                <div className="border-2 border-dashed border-stone-300 rounded-lg p-8 text-center hover:border-amber-500 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="collection-image"
                  />
                  <label htmlFor="collection-image" className="cursor-pointer">
                    <ImageIcon className="w-16 h-16 text-stone-400 mx-auto mb-4" />
                    <p className="text-sm text-stone-600 mb-2">
                      {imageFile ? imageFile.name : 'Click to upload collection image'}
                    </p>
                    <p className="text-xs text-stone-500">
                      Recommended: 800x1200px or 3:4 ratio
                    </p>
                  </label>
                </div>
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
                  {uploadProgress ? 'Uploading...' : (editingCollection ? 'Update Collection' : 'Add Collection')}
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