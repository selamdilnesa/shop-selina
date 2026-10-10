const API_URL = "https://api.escuelajs.co/api/v1";

export async function getProducts() {
  const response = await fetch(`${API_URL}/products`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}
