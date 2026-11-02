import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PublishData() {
  const navigate = useNavigate();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [showSecretKey, setShowSecretKey] = useState(false);
  const fileInputRef = useRef(null);

  const [uploadForm, setUploadForm] = useState({
    datasetName: '',
    description: '',
    category: '',
    dataFormat: '',
    accessLevel: 'Restricted'  // Added Access Level with default
  });

  // Generate secret key on mount
  useEffect(() => {
    generateSecretKey();
  }, []);

  const generateSecretKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = '';
    for (let i = 0; i < 7; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSecretKey(key);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUploadForm(prev => ({ ...prev, [name]: value }));
  };

  const allowedExtensions = ['.csv', '.xlsx', '.xls', '.json', '.pdf', '.zip', '.jpg', '.jpeg', '.png', '.tiff', '.dcm', '.parquet', '.xml', '.txt'];

  const validateFiles = (files) => {
    const validFiles = [];
    const invalidFiles = [];
    const maxTotalSize = 100 * 1024 * 1024 * 1024; // 100GB
    let totalSize = selectedFiles.reduce((sum, f) => sum + f.size, 0);

    for (const file of files) {
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      totalSize += file.size;

      if (totalSize > maxTotalSize) {
        setUploadError('Total size exceeds 100GB limit');
        return [];
      }
      if (allowedExtensions.includes(ext)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    }

    if (invalidFiles.length > 0) {
      setUploadError(`Invalid file types: ${invalidFiles.join(', ')}`);
    }

    return validFiles;
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = validateFiles(files);
    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      setUploadError('');
    }
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const validFiles = validateFiles(files);
    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      setUploadError('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTotalSize = () => {
    return selectedFiles.reduce((sum, file) => sum + file.size, 0);
  };

const handleUpload = async () => {
  if (selectedFiles.length === 0) {
    setUploadError('Please select at least one file');
    return;
  }

  if (!isFormValid) {
    setUploadError('Please fill all required fields');
    return;
  }

  setIsUploading(true);
  setUploadProgress({});
  setUploadError('');

  const formData = new FormData();

  // ✅ Backend supports ONLY ONE file
  formData.append('file', selectedFiles[0]);

// ✅ MUST match @RequestParam names EXACTLY
formData.append('dataName', uploadForm.datasetName);
formData.append('dataCategory', uploadForm.category);
formData.append('description', uploadForm.description);
formData.append('dataFormat', uploadForm.dataFormat);
formData.append('accessLevel', uploadForm.accessLevel);

// ✅ ADD THIS LINE (REQUIRED by backend)
formData.append('location', uploadForm.location || 'Unknown');



// ✅ FIX: extract email from sessionStorage user object
const userStr = sessionStorage.getItem('user');

if (!userStr) {
  setUploadError('Session expired. Please login again.');
  setIsUploading(false);
  return;
}

const user = JSON.parse(userStr);
const uploaderEmail = user.email;

if (!uploaderEmail) {
  setUploadError('Session expired. Please login again.');
  setIsUploading(false);
  return;
}

formData.append('uploaderEmail', uploaderEmail);




  formData.append('secretKey', secretKey);

  try {
    const response = await fetch('http://localhost:2021/api/data/upload', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Upload failed');
    }

    alert(
      `Dataset uploaded successfully!\n\n` +
      `Dataset: ${uploadForm.datasetName}\n` +
      `Uploader: ${uploaderEmail}\n` +
      `Access Level: ${uploadForm.accessLevel}\n` +
      `Secret Key: ${secretKey}\n\n` +
      `Save this key securely!`
    );

    // Reset form
    setSelectedFiles([]);
    setUploadForm({
      datasetName: '',
      description: '',
      category: '',
      dataFormat: '',
      accessLevel: 'Restricted'
    });

    generateSecretKey();
    setShowUploadModal(false);

  } catch (error) {
    console.error('Upload error:', error);
    setUploadError(error.message || 'Upload failed');
  } finally {
    setIsUploading(false);
  }
};



  const copyKey = () => {
    navigator.clipboard.writeText(secretKey);
    alert('Secret key copied to clipboard!');
  };

  const isFormValid = uploadForm.datasetName && 
                     uploadForm.description && 
                     uploadForm.category && 
                     uploadForm.dataFormat;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
      padding: '2rem 1rem'
    }}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />

      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
          <div>
            <h1 className="display-5 fw-bold text-white mb-2">
              Publish New Dataset
            </h1>
            <p className="text-white-50 lead">Share your healthcare data securely</p>
          </div>
          <button
            className="btn btn-outline-light btn-lg"
            onClick={() => navigate('/dataprovider')}
          >
            <i className="bi bi-arrow-left me-2"></i> Back to Dashboard
          </button>
        </div>

        <div className="row g-5">
          <div className="col-lg-8">
            <div className="card border-0 shadow-lg" style={{
              background: 'rgba(30, 41, 59, 0.9)',
              backdropFilter: 'blur(16px)',
              borderRadius: '1.5rem'
            }}>
              <div className="card-header border-0 py-4 text-white" style={{
                background: 'linear-gradient(90deg, #2563eb, #06b6d4)',
                borderRadius: '1.5rem 1.5rem 0 0'
              }}>
                <h4 className="mb-0 fw-bold">
                  <i className="bi bi-database-fill-up me-3"></i> Dataset Details
                </h4>
              </div>

              <div className="card-body p-5">
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="text-white fw-semibold">Dataset Name *</label>
                    <input
                      type="text"
                      name="datasetName"
                      className="form-control form-control-lg"
                      placeholder="e.g., EU Health Records 2025"
                      value={uploadForm.datasetName}
                      onChange={handleChange}
                      style={{ background: '#1e293b', border: '1px solid #475569', color: 'white' }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="text-white fw-semibold">Category *</label>
                    <select
                      name="category"
                      className="form-select form-select-lg"
                      value={uploadForm.category}
                      onChange={handleChange}
                      style={{ background: '#1e293b', border: '1px solid #475569', color: 'white' }}
                    >
                      <option value="">Select category</option>
                      <option>Medical Records</option>
                      <option>Epidemiology</option>
                      <option>Genomics</option>
                      <option>Clinical Trials</option>
                      <option>Medical Imaging</option>
                      <option>Public Health</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-white fw-semibold">Description *</label>
                  <textarea
                    rows={4}
                    name="description"
                    className="form-control"
                    placeholder="Describe your dataset, sources, anonymization, etc."
                    value={uploadForm.description}
                    onChange={handleChange}
                    style={{ background: '#1e293b', border: '1px solid #475569', color: 'white', resize: 'none' }}
                  />
                </div>

                <div className="row g-4 mt-4">
                  <div className="col-md-6">
                    <label className="text-white fw-semibold">Primary Format *</label>
                    <select
                      name="dataFormat"
                      className="form-select form-select-lg"
                      value={uploadForm.dataFormat}
                      onChange={handleChange}
                      style={{ background: '#1e293b', border: '1px solid #475569', color: 'white' }}
                    >
                      <option value="">Select format</option>
                      <option>CSV</option>
                      <option>Excel</option>
                      <option>JSON</option>
                      <option>Parquet</option>
                      <option>DICOM</option>
                      <option>PDF</option>
                      <option>ZIP</option>
                    </select>
                  </div>
                  

                  {/* Access Level Added Here */}
                  <div className="col-md-6">
                    <label className="text-white fw-semibold">Access Level</label>
                    <select
                      name="accessLevel"
                      className="form-select form-select-lg"
                      value={uploadForm.accessLevel}
                      onChange={handleChange}
                      style={{ background: '#1e293b', border: '1px solid #475569', color: 'white' }}
                    >
                  
                      <option value="Restricted">Restricted (Approval Required)</option>
                    </select>
                  </div>
                </div>

                <div className="row g-4 mt-4">
                  <div className="col-md-12">
                    <label className="text-white fw-semibold">Secret Key (Auto-generated)</label>
                    <div className="input-group input-group-lg">
                      <input
                        type={showSecretKey ? "text" : "password"}
                        className="form-control"
                        value={secretKey}
                        readOnly
                        style={{ background: '#1e293b', border: '1px solid #475569', color: 'white', fontFamily: 'monospace' }}
                      />
                      <button className="btn btn-outline-secondary" type="button" onClick={() => setShowSecretKey(!showSecretKey)}>
                        <i className={`bi ${showSecretKey ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                      <button className="btn btn-outline-info" type="button" onClick={copyKey}>
                        <i className="bi bi-clipboard"></i>
                      </button>
                      <button className="btn btn-outline-warning" type="button" onClick={generateSecretKey}>
                        <i className="bi bi-arrow-clockwise"></i>
                      </button>
                    </div>
                    <small className="text-info">Save this key — required for dataset management</small>
                  </div>
                </div>
                <div className="row g-4 mt-4">
  <div className="col-md-6">
    <label className="text-white fw-semibold">Location (Country/Region) *</label>
    <select
      name="location"
      className="form-select form-select-lg"
      value={uploadForm.location || ''}
      onChange={handleChange}
      style={{ background: '#1e293b', border: '1px solid #475569', color: 'white' }}
      required
    >
      <option value="">Select location</option>
      <option value="United States">United States</option>
      <option value="European Union">European Union</option>
      <option value="United Kingdom">United Kingdom</option>
      <option value="Canada">Canada</option>
      <option value="India">India</option>
      <option value="Australia">Australia</option>
      <option value="Japan">Japan</option>
      <option value="Brazil">Brazil</option>
      <option value="South Africa">South Africa</option>
      <option value="China">China</option>
      <option value="Global">Global (Multi-region)</option>
      <option value="Other">Other</option>
    </select>
    <small className="text-white-50">Where the data was primarily collected or applies to</small>
  </div>

  <div className="col-md-6">
    {/* You can leave this empty or add another field later */}
    <div style={{ height: '100%' }}></div>
  </div>
</div>

                <div className="text-center mt-5">
                  <button
                    className="btn btn-primary btn-lg px-5 py-3 fw-bold shadow-lg"
                    onClick={() => setShowUploadModal(true)}
                    disabled={!isFormValid}
                    style={{
                      background: isFormValid ? 'linear-gradient(90deg, #2563eb, #06b6d4)' : '#4b5563',
                      border: 'none',
                      borderRadius: '50px'
                    }}
                  >
                    <i className="bi bi-cloud-arrow-up-fill me-3"></i>
                    {selectedFiles.length > 0 ? `Upload ${selectedFiles.length} File${selectedFiles.length > 1 ? 's' : ''}` : 'Select Files to Upload'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Compliance & Storage */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-lg mb-4" style={{
              background: 'rgba(16, 185, 129, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <div className="card-body p-4">
                <h5 className="text-success fw-bold mb-3">
                  <i className="bi bi-check-circle-fill me-2"></i> Ready to Publish
                </h5>
                <ul className="list-unstyled text-white-50">
                  <li className="mb-2">✓ Max 100GB per dataset</li>
                  <li className="mb-2">✓ All common formats supported</li>
                  <li className="mb-2">✓ End-to-end encryption</li>
                  <li>✓ GDPR & HIPAA compliant</li>
                </ul>
              </div>
            </div>

            <div className="card border-0 shadow-lg" style={{
              background: 'rgba(30, 41, 59, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem'
            }}>
              <div className="card-body text-center p-4">
                <i className="bi bi-hdd-stack-fill text-info" style={{ fontSize: '3rem' }}></i>
                <h3 className="text-white mt-3">8.2 TB</h3>
                <p className="text-white-50">of 12 TB used</p>
                <div className="progress mt-3" style={{ height: '10px' }}>
                  <div className="progress-bar bg-info" style={{ width: '68%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.8)' }} tabIndex="-1">
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content border-0" style={{ background: '#1e293b', borderRadius: '1.5rem' }}>
              <div className="modal-header border-0 py-4" style={{
                background: 'linear-gradient(90deg, #2563eb, #06b6d4)',
                borderRadius: '1.5rem 1.5rem 0 0'
              }}>
                <h4 className="modal-title text-white fw-bold">
                  <i className="bi bi-cloud-upload-fill me-3"></i> Upload Files
                </h4>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowUploadModal(false)}
                  disabled={isUploading}
                ></button>
              </div>

              <div className="modal-body p-5">
                {uploadError && (
                  <div className="alert alert-danger">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {uploadError}
                  </div>
                )}

                <div
                  className="border border-3 border-dashed rounded-4 p-5 text-center mb-4"
                  style={{
                    borderColor: isDragging ? '#06b6d4' : '#475569',
                    background: isDragging ? 'rgba(6, 182, 212, 0.1)' : 'rgba(15, 23, 42, 0.4)',
                    cursor: 'pointer'
                  }}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input ref={fileInputRef} type="file" multiple className="d-none" onChange={handleFileSelect} />
                  <i className="bi bi-cloud-arrow-up-fill display-1 text-info mb-3"></i>
                  <h4 className="text-white">Drop files here or click to browse</h4>
                  <p className="text-white-50">CSV, Excel, JSON, PDF, Images, ZIP, DICOM, Parquet supported</p>
                </div>

                {selectedFiles.length > 0 && (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="text-white mb-0">
                        Selected Files ({selectedFiles.length}) — {formatFileSize(getTotalSize())}
                      </h5>
                      {!isUploading && (
                        <button className="btn btn-outline-danger btn-sm" onClick={() => setSelectedFiles([])}>
                          Clear All
                        </button>
                      )}
                    </div>

                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="card bg-dark border-0 mb-3">
                          <div className="card-body p-3 d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                              <i className="bi bi-file-earmark-fill fs-3 text-info me-3"></i>
                              <div>
                                <div className="text-white fw-semibold">{file.name}</div>
                                <small className="text-white-50">{formatFileSize(file.size)}</small>
                              </div>
                            </div>
                            {!isUploading && (
                              <button className="btn btn-outline-danger btn-sm" onClick={() => removeFile(index)}>
                                <i className="bi bi-x"></i>
                              </button>
                            )}
                            {isUploading && (
                              <div className="progress w-25" style={{ height: '8px' }}>
                                <div
                                  className="progress-bar bg-info progress-bar-striped progress-bar-animated"
                                  style={{ width: `${uploadProgress[index] || 0}%` }}
                                >
                                  {Math.round(uploadProgress[index] || 0)}%
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="modal-footer border-0 p-4">
                <button
                  className="btn btn-secondary px-4"
                  onClick={() => setShowUploadModal(false)}
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary btn-lg px-5"
                  onClick={handleUpload}
                  disabled={selectedFiles.length === 0 || isUploading}
                  style={{ background: 'linear-gradient(90deg, #2563eb, #06b6d4)', border: 'none' }}
                >
                  {isUploading ? 'Uploading...' : `Start Upload (${selectedFiles.length})`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PublishData;