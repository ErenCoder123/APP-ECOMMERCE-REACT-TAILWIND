const BASE_URL = 'http://localhost:3001';

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `Erro HTTP: ${response.status}`);
  }
  return response.json();
}

export async function getProdutos() {
  const response = await fetch(`${BASE_URL}/produtos`);
  return handleResponse(response);
}

export async function getProdutoById(id) {
  const response = await fetch(`${BASE_URL}/produtos/${id}`);
  return handleResponse(response);
}

export async function createProduto(produto) {
  const response = await fetch(`${BASE_URL}/produtos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(produto),
  });
  return handleResponse(response);
}

export async function updateProduto(id, produto) {
  const response = await fetch(`${BASE_URL}/produtos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(produto),
  });
  return handleResponse(response);
}

export async function deleteProduto(id) {
  const response = await fetch(`${BASE_URL}/produtos/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}

export async function getUsuarios() {
  const response = await fetch(`${BASE_URL}/usuarios`);
  return handleResponse(response);
}
