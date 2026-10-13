const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.escuelajs.co/api/v1"
).replace(/\/+$/, "");

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: {
    id: number;
    name: string;
    image: string;
  };
};

export type NewProduct = {
  title: string;
  price: number;
  description: string;
  categoryId: number;
  images: string[];
};

export type Category = {
  id: number;
  name: string;
  image: string;
};

export type NewCategory = {
  name: string;
  image: string;
};

export type StoreUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
};


async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const headers = new Headers(options?.headers);

  
  if (
    options?.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
  const errorDetails = await response.text();

  throw new Error(
    `API request failed (${response.status}): ${errorDetails}`
  );
}
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// PRODUCTS

export function getProducts(): Promise<Product[]> {
  return apiRequest<Product[]>("/products");
}

export function getProductById(
  id: number
): Promise<Product> {
  return apiRequest<Product>(`/products/${id}`);
}

export function createProduct(
  product: NewProduct
): Promise<Product> {
  return apiRequest<Product>("/products/", {
    method: "POST",
    body: JSON.stringify(product),
  });
}

export function updateProduct(
  id: number,
  product: Partial<NewProduct>
): Promise<Product> {
  return apiRequest<Product>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });
}
export function deleteProduct(id: number): Promise<void> {
  return apiRequest<void>(`/products/${id}`, {
    method: "DELETE",
  });
}


export async function uploadProductImage(
  file: File
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please select a valid image file.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("The image must be smaller than 5 MB.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/files/upload`, {
    method: "POST",
    body: formData,
    cache: "no-store",
  });

  if (!response.ok) {
    const details = await response.text();

    console.error("Image upload error:", response.status, details);

    throw new Error(
      `Image upload failed (${response.status}). ${
        details || "Please try again."
      }`
    );
  }

  const result: {
    location?: string;
    url?: string;
  } = await response.json();

  const imageUrl = result.location || result.url;

  if (!imageUrl) {
    throw new Error(
      "The upload API did not return a public image URL."
    );
  }

  return imageUrl;
}

// CATEGORIES

export function getCategories(): Promise<Category[]> {
  return apiRequest<Category[]>("/categories");
}

export function createCategory(
  category: NewCategory
): Promise<Category> {
  return apiRequest<Category>("/categories/", {
    method: "POST",
    body: JSON.stringify(category),
  });
}

export function updateCategory(
  id: number,
  category: Partial<NewCategory>
): Promise<Category> {
  return apiRequest<Category>(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(category),
  });
}

export function deleteCategory(id: number): Promise<void> {
  return apiRequest<void>(`/categories/${id}`, {
    method: "DELETE",
  });
}

// USERS

export function getUsers(): Promise<StoreUser[]> {
  return apiRequest<StoreUser[]>("/users");
}

export function getUserById(
  id: number
): Promise<StoreUser> {
  return apiRequest<StoreUser>(`/users/${id}`);
}

export function updateUser(
  id: number,
  user: Partial<StoreUser>
): Promise<StoreUser> {
  return apiRequest<StoreUser>(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(user),
  });
}

export function deleteUser(id: number): Promise<void> {
  return apiRequest<void>(`/users/${id}`, {
    method: "DELETE",
  });
}