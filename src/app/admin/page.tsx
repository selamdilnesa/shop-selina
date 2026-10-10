"use client";

import { useEffect, useState, type FormEvent } from "react";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getUsers,
  type Product,
  type Category,
  type StoreUser,
} from "@/services/productService";

import { getOrders, type DemoOrder } from "@/lib/orders";

const menuItems = [
  { name: "Overview", icon: "📊" },
  { name: "Products", icon: "🛍️" },
  { name: "Categories", icon: "📂" },
  { name: "Users", icon: "👥" },
  { name: "Orders", icon: "📦" },
];

type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered";

type ManagedOrder = DemoOrder & {
  status: OrderStatus;
};

const ORDER_STATUS_KEY = "shop-selina-order-statuses";

const inputStyle =
  "w-full rounded-lg border border-[#eadfce] bg-white px-4 py-3 text-sm text-[#402b20] outline-none focus:border-[#a78655]";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("Overview");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<StoreUser[]>([]);
  const [orders, setOrders] = useState<ManagedOrder[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(
    null
  );

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("1");
  const [imageUrl, setImageUrl] = useState("");

  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState("");

  // Load orders stored in this browser.
  function loadOrders() {
    try {
      const savedOrders = getOrders();

      let savedStatuses: Record<string, OrderStatus> = {};

      try {
        const storedStatuses = localStorage.getItem(ORDER_STATUS_KEY);

        if (storedStatuses) {
          savedStatuses = JSON.parse(storedStatuses) as Record<
            string,
            OrderStatus
          >;
        }
      } catch {
        savedStatuses = {};
      }

      setOrders(
        savedOrders.map((order) => ({
          ...order,
          status: savedStatuses[order.orderNumber] || "Pending",
        }))
      );
    } catch {
      setError("Unable to load orders from this browser.");
    }
  }

  // Update an order's status.
  function handleStatusChange(
    orderNumber: string,
    status: OrderStatus
  ) {
    try {
      const storedStatuses = localStorage.getItem(ORDER_STATUS_KEY);

      const savedStatuses = storedStatuses
        ? (JSON.parse(storedStatuses) as Record<string, OrderStatus>)
        : {};

      savedStatuses[orderNumber] = status;

      localStorage.setItem(
        ORDER_STATUS_KEY,
        JSON.stringify(savedStatuses)
      );

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.orderNumber === orderNumber
            ? { ...order, status }
            : order
        )
      );

      setSuccessMessage(`Order ${orderNumber} updated to ${status}.`);
      setError("");
    } catch {
      setError("Unable to save the order status in this browser.");
    }
  }

  // Load dashboard data.
  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const results = await Promise.allSettled([
        getProducts(),
        getCategories(),
        getUsers(),
      ]);

      if (results[0].status === "fulfilled") {
        setProducts(results[0].value);
      }

      if (results[1].status === "fulfilled") {
        setCategories(results[1].value);
      }

      if (results[2].status === "fulfilled") {
        setUsers(results[2].value);
      }

      if (results.some((result) => result.status === "rejected")) {
        setError(
          "Some dashboard data could not be loaded. Please try refreshing."
        );
      }

      loadOrders();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();

    function handleStorageChange() {
      loadOrders();
    }

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Reset the product form.
  function resetProductForm() {
    setTitle("");
    setPrice("");
    setDescription("");
    setCategoryId(String(categories[0]?.id ?? 1));
    setImageUrl("");
    setEditingProduct(null);
    setShowAddProduct(false);
  }

  // Prepare a product for editing.
  function startEditProduct(product: Product) {
    setEditingProduct(product);
    setTitle(product.title);
    setPrice(String(product.price));
    setDescription(product.description);
    setCategoryId(String(product.category?.id ?? categories[0]?.id ?? 1));
    setImageUrl(product.images?.[0] ?? "");
    setShowAddProduct(true);
    setShowAddCategory(false);
    setActiveTab("Products");
    setError("");
    setSuccessMessage("");
  }

  // Add or update a product.
  async function handleSaveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !description.trim() || !imageUrl.trim()) {
      setError("Please complete all product fields.");
      return;
    }

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      setError("Please enter a valid price greater than zero.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccessMessage("");

    const selectedCategory = categories.find(
      (category) => category.id === Number(categoryId)
    );

    const productData = {
      title: title.trim(),
      price: numericPrice,
      description: description.trim(),
      categoryId: Number(categoryId),
      images: [imageUrl.trim()],
    };

    try {
      if (editingProduct) {
        const updatedProduct = await updateProduct(
          editingProduct.id,
          productData
        );

        setProducts((currentProducts) =>
          currentProducts.map((product) =>
            product.id === editingProduct.id
              ? {
                  ...product,
                  ...updatedProduct,
                  title: productData.title,
                  price: productData.price,
                  description: productData.description,
                  images: productData.images,
                  category: selectedCategory ?? product.category,
                }
              : product
          )
        );

        setSuccessMessage("Product updated successfully!");
      } else {
        const createdProduct = await createProduct(productData);

        setProducts((currentProducts) => [
          {
            ...createdProduct,
            title: productData.title,
            price: productData.price,
            description: productData.description,
            images: productData.images,
            category: selectedCategory ?? createdProduct.category,
          },
          ...currentProducts,
        ]);

        setSuccessMessage("Product added successfully!");
      }

      resetProductForm();
    } catch (error) {
      console.error("Save product error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to save the product. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  // Delete a product.
  async function handleDeleteProduct(product: Product) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.title}"?`
    );

    if (!confirmed) return;

    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      await deleteProduct(product.id);

      setProducts((currentProducts) =>
        currentProducts.filter((item) => item.id !== product.id)
      );

      if (editingProduct?.id === product.id) {
        resetProductForm();
      }

      setSuccessMessage("Product deleted successfully!");
    } catch (error) {
      console.error("Delete product error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete this product. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  // Prepare a category for editing.
  function startEditCategory(category: Category) {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryImage(category.image);
    setShowAddCategory(true);
    setShowAddProduct(false);
    setActiveTab("Categories");
    setError("");
    setSuccessMessage("");
  }

  // Reset the category form.
  function resetCategoryForm() {
    setCategoryName("");
    setCategoryImage("");
    setEditingCategory(null);
    setShowAddCategory(false);
  }

  // Add or update a category.
  async function handleSaveCategory(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const name = categoryName.trim();
    const image = categoryImage.trim();

    if (!name || !image) {
      setError("Please enter a category name and image URL.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      if (editingCategory) {
        const updatedCategory = await updateCategory(
          editingCategory.id,
          { name, image }
        );

        setCategories((currentCategories) =>
          currentCategories.map((category) =>
            category.id === editingCategory.id
              ? {
                  ...category,
                  ...updatedCategory,
                  name,
                  image,
                }
              : category
          )
        );

        setProducts((currentProducts) =>
          currentProducts.map((product) =>
            product.category?.id === editingCategory.id
              ? {
                  ...product,
                  category: {
                    ...product.category,
                    name,
                    image,
                  },
                }
              : product
          )
        );

        setSuccessMessage("Category updated successfully!");
      } else {
        const createdCategory = await createCategory({
          name,
          image,
        });

        setCategories((currentCategories) => [
          createdCategory,
          ...currentCategories,
        ]);

        setSuccessMessage("Category added successfully!");
      }

      resetCategoryForm();
    } catch (error) {
      console.error("Save category error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to save the category. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  // Delete a category.
  async function handleDeleteCategory(category: Category) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) return;

    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      await deleteCategory(category.id);

      setCategories((currentCategories) =>
        currentCategories.filter((item) => item.id !== category.id)
      );

      if (editingCategory?.id === category.id) {
        resetCategoryForm();
      }

      setSuccessMessage("Category deleted successfully!");
    } catch (error) {
      console.error("Delete category error:", error);

      const message =
        error instanceof Error ? error.message : "";

      if (
        message.includes("FOREIGN KEY") ||
        message.includes("SQLITE_CONSTRAINT_FOREIGNKEY")
      ) {
        setError(
          "This category cannot be deleted because products or other records still reference it."
        );
      } else {
        setError(
          message ||
            "Unable to delete this category. Please try again."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  const stats = [
    { title: "Total Products", value: products.length, icon: "🛍️" },
    { title: "Total Categories", value: categories.length, icon: "📂" },
    { title: "Total Users", value: users.length, icon: "👥" },
    { title: "Total Orders", value: orders.length, icon: "📦" },
  ];

  return (
    <main className="min-h-screen bg-[#faf7f2] p-4 text-[#402b20] sm:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#a78655]">
              Shop Selina
            </p>
            <h1 className="mt-2 text-3xl font-bold">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-[#806f63]">
              Manage your store from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                void loadDashboard();
                setSuccessMessage("");
              }}
              className="rounded-lg border border-[#eadfce] bg-white px-4 py-2 transition hover:bg-[#f0e5d4]"
            >
              ↻ Refresh
            </button>

            <a
              href="/"
              className="rounded-lg border border-[#d4af6a] px-4 py-2 transition hover:bg-[#f0e5d4]"
            >
              View Store →
            </a>
          </div>
        </header>

        {/* Dashboard statistics */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-2xl border border-[#eadfce] bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#806f63]">{stat.title}</p>
                <span className="text-2xl">{stat.icon}</span>
              </div>

              <h2 className="mt-4 text-3xl font-bold">
                {loading ? "..." : stat.value}
              </h2>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
          {/* Sidebar navigation */}
          <aside className="h-fit rounded-2xl border border-[#eadfce] bg-white p-4 shadow-sm">
            <h2 className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-[#a78655]">
              Management
            </h2>

            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.name);
                    resetProductForm();
                    resetCategoryForm();
                    setSuccessMessage("");
                    setError("");

                    if (item.name === "Orders") {
                      loadOrders();
                    }
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                    activeTab === item.name
                      ? "bg-[#402b20] text-white"
                      : "text-[#402b20] hover:bg-[#faf7f2]"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main dashboard content */}
          <section className="min-w-0 rounded-2xl border border-[#eadfce] bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 border-b border-[#eadfce] pb-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">{activeTab}</h2>

                {activeTab === "Products" && (
                  <button
                    type="button"
                    onClick={() => {
                      if (showAddProduct) {
                        resetProductForm();
                      } else {
                        setEditingProduct(null);
                        setTitle("");
                        setPrice("");
                        setDescription("");
                        setCategoryId(String(categories[0]?.id ?? 1));
                        setImageUrl("");
                        setShowAddProduct(true);
                        setShowAddCategory(false);
                      }

                      setError("");
                      setSuccessMessage("");
                    }}
                    className="rounded-lg bg-[#402b20] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#604333]"
                  >
                    {showAddProduct ? "Cancel" : "+ Add Product"}
                  </button>
                )}

                {activeTab === "Categories" && (
                  <button
                    type="button"
                    onClick={() => {
                      if (showAddCategory) {
                        resetCategoryForm();
                      } else {
                        setEditingCategory(null);
                        setCategoryName("");
                        setCategoryImage("");
                        setShowAddCategory(true);
                        setShowAddProduct(false);
                      }

                      setError("");
                      setSuccessMessage("");
                    }}
                    className="rounded-lg bg-[#402b20] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#604333]"
                  >
                    {showAddCategory ? "Cancel" : "+ Add Category"}
                  </button>
                )}
              </div>

              <p className="mt-2 text-sm text-[#806f63]">
                {activeTab === "Overview"
                  ? "Here is an overview of your store."
                  : `Manage your store's ${activeTab.toLowerCase()} here.`}
              </p>
            </div>

            {successMessage && (
              <p
                role="status"
                className="mb-5 rounded-xl bg-green-50 p-4 text-sm text-green-700"
              >
                {successMessage}
              </p>
            )}

            {error && (
              <p
                role="alert"
                className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            {/* Overview */}
            {activeTab === "Overview" && (
              <div className="rounded-xl bg-[#faf7f2] p-6">
                <h3 className="text-lg font-semibold">Welcome back!</h3>
                <p className="mt-2 text-sm leading-6 text-[#806f63]">
                  Your dashboard statistics come from the EscuelaJS API,
                  except orders, which are currently saved in this browser.
                </p>

                {loading && (
                  <p className="mt-4 text-sm text-[#806f63]">
                    Loading dashboard data...
                  </p>
                )}
              </div>
            )}

            {/* Products */}
            {activeTab === "Products" && (
              <div>
                {showAddProduct && (
                  <form
                    onSubmit={handleSaveProduct}
                    className="mb-8 rounded-2xl border border-[#eadfce] bg-[#faf7f2] p-5 sm:p-6"
                  >
                    <h3 className="mb-5 text-xl font-bold">
                      {editingProduct ? "Edit Product" : "Add a New Product"}
                    </h3>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="product-title"
                          className="mb-2 block text-sm font-medium"
                        >
                          Product Name
                        </label>
                        <input
                          id="product-title"
                          value={title}
                          onChange={(event) => setTitle(event.target.value)}
                          required
                          className={inputStyle}
                          placeholder="Enter product name"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="product-price"
                          className="mb-2 block text-sm font-medium"
                        >
                          Price ($)
                        </label>
                        <input
                          id="product-price"
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={price}
                          onChange={(event) => setPrice(event.target.value)}
                          required
                          className={inputStyle}
                          placeholder="49.99"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="product-category"
                          className="mb-2 block text-sm font-medium"
                        >
                          Category
                        </label>
                        <select
                          id="product-category"
                          value={categoryId}
                          onChange={(event) =>
                            setCategoryId(event.target.value)
                          }
                          required
                          className={inputStyle}
                        >
                          {categories.length === 0 && (
                            <option value="1">Category ID 1</option>
                          )}

                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="product-image"
                          className="mb-2 block text-sm font-medium"
                        >
                          Product Image URL
                        </label>
                        <input
                          id="product-image"
                          type="url"
                          value={imageUrl}
                          onChange={(event) => setImageUrl(event.target.value)}
                          required
                          className={inputStyle}
                          placeholder="https://example.com/image.jpg"
                        />

                        {imageUrl && (
                          <div className="mt-3">
                            <p className="mb-2 text-xs text-[#806f63]">
                              Image preview
                            </p>
                            <img
                              src={imageUrl}
                              alt="Product preview"
                              className="h-28 w-28 rounded-xl border border-[#eadfce] bg-white object-contain p-2"
                              onError={(event) => {
                                event.currentTarget.style.visibility =
                                  "hidden";
                              }}
                              onLoad={(event) => {
                                event.currentTarget.style.visibility =
                                  "visible";
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="product-description"
                          className="mb-2 block text-sm font-medium"
                        >
                          Description
                        </label>
                        <textarea
                          id="product-description"
                          value={description}
                          onChange={(event) =>
                            setDescription(event.target.value)
                          }
                          required
                          rows={4}
                          className={`${inputStyle} resize-y`}
                          placeholder="Describe your product"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-[#402b20] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#604333] disabled:opacity-60"
                      >
                        {saving
                          ? "Saving..."
                          : editingProduct
                            ? "Save Changes"
                            : "Save Product"}
                      </button>

                      <button
                        type="button"
                        onClick={resetProductForm}
                        className="rounded-lg border border-[#eadfce] px-6 py-3 text-sm hover:bg-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {loading ? (
                  <p className="py-8 text-center text-[#806f63]">
                    Loading products...
                  </p>
                ) : products.length === 0 ? (
                  <p className="py-8 text-center text-[#806f63]">
                    No products found.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[680px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-[#eadfce] text-[#806f63]">
                          <th className="px-3 py-4">Product</th>
                          <th className="px-3 py-4">Category</th>
                          <th className="px-3 py-4">Price</th>
                          <th className="px-3 py-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr
                            key={product.id}
                            className="border-b border-[#f0e8dc] last:border-0"
                          >
                            <td className="px-3 py-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={product.images?.[0] || "/logo.webp"}
                                  alt={product.title}
                                  className="h-12 w-12 rounded-lg bg-[#faf7f2] object-contain"
                                />
                                <span className="max-w-[220px] truncate font-medium">
                                  {product.title}
                                </span>
                              </div>
                            </td>

                            <td className="px-3 py-4 text-[#806f63]">
                              {product.category?.name || "Uncategorized"}
                            </td>

                            <td className="px-3 py-4 font-semibold">
                              ${Number(product.price).toFixed(2)}
                            </td>

                            <td className="px-3 py-4">
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => startEditProduct(product)}
                                  className="rounded-lg border border-[#d4af6a] px-3 py-2 text-xs font-medium hover:bg-[#faf7f2]"
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  disabled={saving}
                                  onClick={() =>
                                    void handleDeleteProduct(product)
                                  }
                                  className="rounded-lg border border-red-200 px-3 py-2 text-xs text-red-700 hover:bg-red-50 disabled:opacity-50"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Categories */}
            {activeTab === "Categories" && (
              <div>
                {showAddCategory && (
                  <form
                    onSubmit={handleSaveCategory}
                    className="mb-8 rounded-2xl border border-[#eadfce] bg-[#faf7f2] p-5"
                  >
                    <h3 className="mb-5 text-lg font-bold">
                      {editingCategory ? "Edit Category" : "Add a New Category"}
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="category-name"
                          className="mb-2 block text-sm font-medium"
                        >
                          Category Name
                        </label>
                        <input
                          id="category-name"
                          value={categoryName}
                          onChange={(event) =>
                            setCategoryName(event.target.value)
                          }
                          required
                          className={inputStyle}
                          placeholder="e.g. Handbags"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="category-image"
                          className="mb-2 block text-sm font-medium"
                        >
                          Category Image URL
                        </label>
                        <input
                          id="category-image"
                          type="url"
                          value={categoryImage}
                          onChange={(event) =>
                            setCategoryImage(event.target.value)
                          }
                          required
                          className={inputStyle}
                          placeholder="https://example.com/category.jpg"
                        />

                        {categoryImage && (
                          <img
                            src={categoryImage}
                            alt="Category preview"
                            className="mt-3 h-24 w-24 rounded-xl border border-[#eadfce] bg-white object-cover"
                            onError={(event) => {
                              event.currentTarget.style.visibility = "hidden";
                            }}
                            onLoad={(event) => {
                              event.currentTarget.style.visibility = "visible";
                            }}
                          />
                        )}
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-[#402b20] px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
                      >
                        {saving
                          ? "Saving..."
                          : editingCategory
                            ? "Save Changes"
                            : "Save Category"}
                      </button>

                      <button
                        type="button"
                        onClick={resetCategoryForm}
                        className="rounded-lg border border-[#eadfce] px-5 py-3 text-sm hover:bg-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {loading ? (
                  <p className="py-8 text-center text-[#806f63]">
                    Loading categories...
                  </p>
                ) : categories.length === 0 ? (
                  <p className="py-8 text-center text-[#806f63]">
                    No categories found.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center gap-4 rounded-xl border border-[#eadfce] p-4"
                      >
                        <img
                          src={category.image}
                          alt={category.name}
                          className="h-16 w-16 rounded-lg bg-[#faf7f2] object-cover"
                          onError={(event) => {
                            event.currentTarget.style.visibility = "hidden";
                          }}
                          onLoad={(event) => {
                            event.currentTarget.style.visibility = "visible";
                          }}
                        />

                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="mt-1 text-xs text-[#806f63]">
                            Category ID: {category.id}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => startEditCategory(category)}
                            className="rounded-lg border border-[#d4af6a] px-3 py-2 text-sm hover:bg-[#faf7f2]"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            disabled={saving}
                            onClick={() =>
                              void handleDeleteCategory(category)
                            }
                            className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Users */}
            {activeTab === "Users" && (
              <div>
                <p className="mb-5 rounded-xl bg-[#faf7f2] p-4 text-sm leading-6 text-[#806f63]">
                  View and manage your store&apos;s registered users.
                </p>

                {loading ? (
                  <p className="py-8 text-center text-[#806f63]">
                    Loading users...
                  </p>
                ) : users.length === 0 ? (
                  <p className="py-8 text-center text-[#806f63]">
                    No users found.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[520px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-[#eadfce] text-[#806f63]">
                          <th className="px-3 py-4">User</th>
                          <th className="px-3 py-4">Email</th>
                          <th className="px-3 py-4">Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr
                            key={user.id}
                            className="border-b border-[#f0e8dc] last:border-0"
                          >
                            <td className="px-3 py-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={user.avatar}
                                  alt=""
                                  className="h-10 w-10 rounded-full bg-[#faf7f2] object-cover"
                                />
                                <span className="font-medium">{user.name}</span>
                              </div>
                            </td>

                            <td className="px-3 py-4 text-[#806f63]">
                              {user.email}
                            </td>

                            <td className="px-3 py-4">
                              <span className="rounded-full bg-[#f0e5d4] px-3 py-1 text-xs font-medium">
                                {user.role}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Orders */}
            {activeTab === "Orders" && (
              <div>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <p className="rounded-xl bg-[#faf7f2] p-4 text-sm leading-6 text-[#806f63]">
                    Orders saved in this browser. These are simulated orders,
                    not real payments.
                  </p>

                  <button
                    type="button"
                    onClick={loadOrders}
                    className="shrink-0 rounded-lg border border-[#eadfce] px-4 py-2 text-sm hover:bg-[#faf7f2]"
                  >
                    ↻ Refresh Orders
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#d4af6a] p-8 text-center">
                    <span className="text-4xl">📦</span>
                    <h3 className="mt-3 font-semibold">No orders found</h3>
                    <p className="mt-2 text-sm text-[#806f63]">
                      Place a test order from checkout in this browser to see
                      it here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {orders.map((order) => (
                      <article
                        key={order.orderNumber}
                        className="rounded-xl border border-[#eadfce] p-5"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <h3 className="font-bold">
                              Order {order.orderNumber}
                            </h3>
                            <p className="mt-1 text-sm text-[#806f63]">
                              {new Date(order.createdAt).toLocaleString()}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-[#f0e5d4] px-3 py-1 text-xs font-medium">
                              Demo order
                            </span>

                            <label
                              className="sr-only"
                              htmlFor={`status-${order.orderNumber}`}
                            >
                              Order status
                            </label>

                            <select
                              id={`status-${order.orderNumber}`}
                              value={order.status}
                              onChange={(event) =>
                                handleStatusChange(
                                  order.orderNumber,
                                  event.target.value as OrderStatus
                                )
                              }
                              className={inputStyle}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </div>
                        </div>

                        <div className="mt-5 border-t border-[#eadfce] pt-5">
                          <h4 className="font-semibold">Customer details</h4>

                          <p className="mt-2 text-sm">
                            {order.customer.fullName ||
                              order.customer.name ||
                              "Customer"}
                          </p>

                          <p className="mt-1 text-sm text-[#806f63]">
                            {order.customer.email}
                          </p>

                          {order.customer.phone && (
                            <p className="mt-1 text-sm text-[#806f63]">
                              {order.customer.phone}
                            </p>
                          )}

                          {(order.customer.address || order.customer.city) && (
                            <p className="mt-1 text-sm text-[#806f63]">
                              {[
                                order.customer.address,
                                order.customer.city,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          )}
                        </div>

                        <div className="mt-5 border-t border-[#eadfce] pt-5">
                          <h4 className="font-semibold">Order items</h4>

                          <div className="mt-3 space-y-3">
                            {order.items.map((item, index) => (
                              <div
                                key={`${item.id}-${index}`}
                                className="flex justify-between gap-4 text-sm"
                              >
                                <span>
                                  {item.title} × {item.quantity}
                                </span>

                                <span className="font-medium">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="mt-5 flex justify-between border-t border-[#eadfce] pt-4 font-bold">
                            <span>Total</span>
                            <span>
                              ${Number(order.total).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}