export interface GistFile {
  filename: string;
  content: string;
}

export interface GistResponse {
  id: string;
  html_url: string;
  files: Record<string, { filename: string; content: string }>;
}

export async function createGist(
  files: GistFile[],
  description: string = '',
  isPublic: boolean = false,
  token?: string
): Promise<GistResponse> {
  if (!token) {
    throw new Error('GitHub Personal Access Token não configurado');
  }

  const response = await fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: {
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json'
    },
    body: JSON.stringify({
      description,
      public: isPublic,
      files: files.reduce((acc, file) => {
        acc[file.filename] = { content: file.content };
        return acc;
      }, {} as Record<string, { content: string }>)
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao criar gist');
  }

  return response.json();
}

export async function getGists(token: string): Promise<GistResponse[]> {
  const response = await fetch('https://api.github.com/gists', {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao buscar gists');
  }

  return response.json();
}
