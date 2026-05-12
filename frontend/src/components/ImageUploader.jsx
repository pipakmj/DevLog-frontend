import React, { useRef, useState } from 'react'
import { uploadImage } from '../utils/uploadImage';
import '../styles/ImageUploader.css';

function ImageUploader({ imageUrl, onImageUpload }) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFile = async (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        setIsUploading(true);
        const url = await uploadImage(file);
        if (url) {
            onImageUpload(url);
        }
        setIsUploading(false);
    };
    
    // 클릭으로 파일 선택
    const handleClick = () => {
        fileInputRef.current.click();
    };
    const handleChange = (e) => {
        handleFile(e.target.files[0]);
    };
    // 드래그 이벤트 핸들러
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };
    // 이미지 삭제
    const handleRemove = (e) => {
        e.stopPropagation();
        onImageUpload(null);
    };

  return (
      <div
          className={`image-uploader ${isDragging ? 'dragging' : ''} ${imageUrl ? 'has-image' : ''}`}
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
      >
          <input
              type="file"
              ref={fileInputRef}
              onChange={handleChange}
              accept="image/*"
              hidden
          />
          {isUploading ? (
              <div className="upload-status">
                  <div className="spinner" />
                  <p>업로드 중...</p>
              </div>
          ) : imageUrl ? (
              <div className="preview-container">
                  <img src={imageUrl} alt="썸네일 미리보기" className="preview-image" />
                  <div className="preview-overlay">
                      <span>🔄 변경하기</span>
                      <button className="remove-btn" onClick={handleRemove}>✕ 삭제</button>
                  </div>
              </div>
          ) : (
              <div className="upload-placeholder">
                  <span className="upload-icon">📷</span>
                  <p className="upload-text">클릭하여 이미지를를 업로드하세요</p>
                  <span className="upload-hint">JPG, PNG, WebP (최대 5MB)</span>
              </div>
          )}
      </div>
  )
}

export default ImageUploader