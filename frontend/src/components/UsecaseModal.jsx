import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

const UsecaseModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return;
    
    setIsSubmitting(true);
    await onSubmit({ title, description, image: imagePreview });
    setIsSubmitting(false);
    
    // Reset form
    setTitle('');
    setDescription('');
    setImagePreview(null);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ background: 'var(--bg-color)' }}>
        <div className="modal-header">
          <h3>Add New Usecase</h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Usecase Title</label>
            <input 
              type="text" 
              placeholder="e.g. E-commerce Platform Architecture" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea 
              placeholder="Briefly describe what this prompt generates..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="form-input"
              rows={4}
            />
          </div>
          
          <div className="form-group">
            <label>Cover Image</label>
            <div className="image-upload-area">
              <input 
                type="file" 
                id="file-upload" 
                accept="image/*" 
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="file-upload" className="upload-label">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                ) : (
                  <div className="upload-placeholder">
                    <ImageIcon size={32} />
                    <span>Click to upload image</span>
                    <span className="upload-hint">PNG, JPG up to 5MB</span>
                  </div>
                )}
              </label>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting || !title || !description}>
              {isSubmitting ? 'Saving...' : 'Add Usecase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsecaseModal;
