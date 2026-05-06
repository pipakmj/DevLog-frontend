export const uploadImage = async (imageFile) => {
    const presetName = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', presetName);

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const response = await fetch(
        url,
        {
            method: 'POST',
            body: formData,
        }
    );
    const data = await response.json();
    return data.secure_url;
};