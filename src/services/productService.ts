const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.escuelajs.co/api/v1"
).replace(/\/+$/, "");

// Local storage keys for Shop Selina demo data
const PRODUCTS_KEY = "shop-selina-demo-products-v1";
const CATEGORIES_KEY = "shop-selina-demo-categories-v1";


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
    !(options.body instanceof FormData)
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

  return response.json() as Promise<T>;
}



function readLocalData<T>(key: string): T[] | null {
  if (typeof window === "undefined") {
    return null;
  }

  const savedData = localStorage.getItem(key);

  if (savedData === null) {
    return null;
  }

  try {
    return JSON.parse(savedData) as T[];
  } catch {
    throw new Error(
      `Could not read saved Shop Selina data for ${key}.`
    );
  }
}

function saveLocalData<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") {
    throw new Error(
      "Local demo changes can only be saved in the browser."
    );
  }

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    throw new Error(
      "Could not save your changes in the browser. Storage may be full."
    );
  }
}

function getNextId<T extends { id: number }>(
  items: T[]
): number {
  return items.reduce(
    (highest, item) => Math.max(highest, item.id),
    0
  ) + 1;
}

// products

export async function getProducts(): Promise<Product[]> {
  const savedProducts = readLocalData<Product>(PRODUCTS_KEY);

  if (savedProducts !== null) {
    return savedProducts;
  }

  const products = await apiRequest<Product[]>("/products");

  saveLocalData(PRODUCTS_KEY, products);

  return products;
}

export async function getProductById(
  id: number
): Promise<Product> {
  const products = await getProducts();

  const product = products.find((item) => item.id === id);

  if (!product) {
    throw new Error("Product not found.");
  }

  return product;
}

// Create a product locally.

export async function createProduct(
  product: NewProduct
): Promise<Product> {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const category = categories.find(
    (item) => item.id === product.categoryId
  );

  if (!category) {
    throw new Error(
      "Category not found. Please select a valid category."
    );
  }

  const newProduct: Product = {
    id: getNextId(products),
    title: product.title,
    price: product.price,
    description: product.description,
    images: product.images,
    category,
  };

  saveLocalData(PRODUCTS_KEY, [
    ...products,
    newProduct,
  ]);

  return newProduct;
}

// Update a product locally.

export async function updateProduct(
  id: number,
  updates: Partial<NewProduct>
): Promise<Product> {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const existingProduct = products.find(
    (item) => item.id === id
  );

  if (!existingProduct) {
    throw new Error("Product not found.");
  }

  let updatedCategory = existingProduct.category;

  if (updates.categoryId !== undefined) {
    const category = categories.find(
      (item) => item.id === updates.categoryId
    );

    if (!category) {
      throw new Error(
        "Category not found. Please select a valid category."
      );
    }

    updatedCategory = category;
  }

  const updatedProduct: Product = {
    ...existingProduct,
    ...(updates.title !== undefined && {
      title: updates.title,
    }),
    ...(updates.price !== undefined && {
      price: updates.price,
    }),
    ...(updates.description !== undefined && {
      description: updates.description,
    }),
    ...(updates.images !== undefined && {
      images: updates.images,
    }),
    category: updatedCategory,
  };

  const updatedProducts = products.map((item) =>
    item.id === id ? updatedProduct : item
  );

  saveLocalData(PRODUCTS_KEY, updatedProducts);

  return updatedProduct;
}

// Delete a product locally.

export async function deleteProduct(
  id: number
): Promise<void> {
  const products = await getProducts();

  const exists = products.some((item) => item.id === id);

  if (!exists) {
    throw new Error("Product not found.");
  }

  const updatedProducts = products.filter(
    (item) => item.id !== id
  );

  saveLocalData(PRODUCTS_KEY, updatedProducts);
}

// product image
export async function uploadProductImage(
  _file: File
): Promise<string> {
  throw new Error(
    "Image uploads are disabled in safe demo mode. Please use a public image URL."
  );
}

// categories
export async function getCategories(): Promise<Category[]> {
  const savedCategories =
    readLocalData<Category>(CATEGORIES_KEY);

  if (savedCategories !== null) {
    return savedCategories;
  }

  const categories =
    await apiRequest<Category[]>("/categories");

  saveLocalData(CATEGORIES_KEY, categories);

  return categories;
}

// Create a category locally.


export async function createCategory(
  category: NewCategory
): Promise<Category> {
  const categories = await getCategories();

  const newCategory: Category = {
    id: getNextId(categories),
    name: category.name,
    image: category.image,
  };

  saveLocalData(CATEGORIES_KEY, [
    ...categories,
    newCategory,
  ]);

  return newCategory;
}

// Update a category locally.

export async function updateCategory(
  id: number,
  updates: Partial<NewCategory>
): Promise<Category> {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  const existingCategory = categories.find(
    (item) => item.id === id
  );

  if (!existingCategory) {
    throw new Error("Category not found.");
  }

  const updatedCategory: Category = {
    ...existingCategory,
    ...updates,
  };

  const updatedCategories = categories.map((item) =>
    item.id === id ? updatedCategory : item
  );

  const updatedProducts = products.map((product) => {
    if (product.category.id !== id) {
      return product;
    }

    return {
      ...product,
      category: updatedCategory,
    };
  });

  saveLocalData(CATEGORIES_KEY, updatedCategories);
  saveLocalData(PRODUCTS_KEY, updatedProducts);

  return updatedCategory;
}

// Delete a category locally.

export async function deleteCategory(
  id: number
): Promise<void> {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  const exists = categories.some(
    (item) => item.id === id
  );

  if (!exists) {
    throw new Error("Category not found.");
  }

  const categoryIsUsed = products.some(
    (product) => product.category.id === id
  );

  if (categoryIsUsed) {
    throw new Error(
      "FOREIGN KEY constraint failed: this category is used by existing products. Move or delete those products first."
    );
  }

  const updatedCategories = categories.filter(
    (item) => item.id !== id
  );

  saveLocalData(CATEGORIES_KEY, updatedCategories);
}

// users

export async function getUsers(): Promise<StoreUser[]> {
  return apiRequest<StoreUser[]>("/users");
}

export async function getUserById(
  id: number
): Promise<StoreUser> {
  return apiRequest<StoreUser>(`/users/${id}`);
}
// block user change
export async function updateUser(
  _id: number,
  _user: Partial<StoreUser>
): Promise<never> {
  throw new Error(
    "Editing shared API users is disabled to protect existing accounts."
  );
}

export async function deleteUser(
  _id: number
): Promise<never> {
  throw new Error(
    "Deleting shared API users is disabled to protect existing accounts."
  );
}