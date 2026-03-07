export async function uploadToImgbb(file: File): Promise<string> {
  const imgbbApiKey = localStorage.getItem('dict-imgbb-api-key');
  
  if (!imgbbApiKey) {
    throw new Error('API key do ImgBB não configurada. Configure nas Configurações.');
  }

  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
    { method: 'POST', body: formData }
  );

  const data = await response.json();
  
  if (data.success) {
    return data.data.url;
  } else {
    throw new Error(data.error?.message || 'Erro ao fazer upload da imagem');
  }
}
