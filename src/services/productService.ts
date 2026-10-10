const API_URL = "https://api.escuelajs.co/api/v1";


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
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    cache: "no-store",
  });

      if (!response.ok) {
  const errorDetails = await response.text();

  console.error("API Error:", response.status, errorDetails);

  throw new Error(
    `Request failed (${response.status}): ${errorDetails}`
  );
} 

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}


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