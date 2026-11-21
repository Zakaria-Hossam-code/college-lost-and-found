import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit2, Trash2, X, Check, Loader2 } from 'lucide-react';
import { categoriesApi } from '../../api/commonApi';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useNotification } from '../../context/NotificationContext';

export const ManageCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const { showToast } = useNotification();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (err) {
      showToast('Error loading categories.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setCreating(true);
    try {
      await categoriesApi.create({ name: newCategoryName.trim() });
      showToast('Category created successfully.', 'success');
      setNewCategoryName('');
      fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create category.', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleStartEdit = (cat) => {
    setEditingId(cat.categoryID);
    setEditName(cat.name);
  };

  const handleSaveEdit = async (id) => {
    if (!editName.trim()) return;
    try {
      await categoriesApi.update(id, { name: editName.trim() });
      showToast('Category updated successfully.', 'success');
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update category.', 'error');
    }
  };

  const handleDelete = async (id, name, reportsCount) => {
    if (reportsCount > 0) {
      showToast(`Cannot delete category "${name}" because ${reportsCount} reports are currently assigned to it.`, 'error');
      return;
    }
    if (!window.confirm(`Delete category "${name}"?`)) return;

    try {
      await categoriesApi.delete(id);
      showToast('Category deleted successfully.', 'success');
      setCategories((prev) => prev.filter((c) => c.categoryID !== id));
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete category.', 'error');
    }
  };

  return (
    <div style={{ maxWidth: '850px' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="title-lg" style={{ color: 'var(--navy-900)' }}>
          Manage Item Categories
        </h1>
        <p className="subtitle">
          Configure taxonomy for lost and found reports (Electronics, Keys, IDs, Wallets, etc.).
        </p>
      </div>

      {/* Add New Category Card */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', backgroundColor: '#ffffff' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.75rem' }}>
          Add New Category
        </h3>
        <form onSubmit={handleCreate} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Sports Equipment, Musical Instruments..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            required
            style={{ flex: 1 }}
          />
          <button type="submit" disabled={creating} className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
            <Plus size={16} />
            <span>{creating ? 'Adding...' : 'Add Category'}</span>
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="card" style={{ backgroundColor: '#ffffff', overflow: 'hidden' }}>
        {loading ? (
          <LoadingSpinner text="Loading categories..." />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)', color: 'var(--slate-600)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.04em' }}>
                <th style={{ padding: '0.85rem 1.25rem' }}>Category Name</th>
                <th style={{ padding: '0.85rem 1rem' }}>Associated Reports</th>
                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.categoryID} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    {editingId === c.categoryID ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.85rem' }}
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(c.categoryID)}
                          className="btn btn-sm btn-success"
                          style={{ padding: '0.35rem 0.6rem' }}
                        >
                          <Check size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="btn btn-sm btn-ghost"
                          style={{ padding: '0.35rem 0.6rem' }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Tag size={15} style={{ color: 'var(--blue-600)' }} />
                        <strong style={{ color: 'var(--navy-900)' }}>{c.name}</strong>
                      </div>
                    )}
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <span className="badge badge-active">{c.reportsCount} items</span>
                  </td>

                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(c)}
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--blue-600)', padding: '0.4rem' }}
                        title="Edit Category Name"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c.categoryID, c.name, c.reportsCount)}
                        className="btn btn-ghost btn-sm"
                        style={{ color: '#ef4444', padding: '0.4rem' }}
                        title="Delete Category"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
