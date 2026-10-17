"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

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
  { name: "Overview", icon: "📊", description: "Store overview" },
  { name: "Products", icon: "🛍️", description: "Manage products" },
  { name: "Categories", icon: "📂", description: "Organize categories" },
  { name: "Users", icon: "👥", description: "View registered users" },
  { name: "Orders", icon: "📦", description: "Manage customer orders" },
  { name: "Profile", icon: "👤", description: "Admin account" },
];

type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered";

type ManagedOrder = DemoOrder & {
  status: OrderStatus;
};

const ORDER_STATUS_KEY = "shop-selina-order-statuses";
const ORDERS_STORAGE_KEY = "shop-selina-orders";

const inputStyle =
  "w-full rounded-lg border border-[#eadfce] bg-white px-4 py-3 text-sm text-[#402b20] outline-none transition focus:border-[#a78655] focus:ring-2 focus:ring-[#d4af6a]/20 dark:border-[#49372b] dark:bg-[#281d18] dark:text-[#faf7f2] dark:placeholder-[#806b5b] dark:focus:border-[#c6a16b]";

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState("Overview");
  const [menuOpen, setMenuOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [productSort, setProductSort] = useState("default");

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
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("1");
  const [imageUrl, setImageUrl] = useState("");

  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState("");

  // Load orders saved in this browser.
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

  // Update and save an order's status.
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

  // Clear only delivered orders.
  function handleClearDeliveredOrders() {
    const deliveredOrders = orders.filter(
      (order) => order.status === "Delivered"
    );

    if (deliveredOrders.length === 0) {
      setError("");
      setSuccessMessage("There are no delivered orders to clear.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to remove all ${deliveredOrders.length} delivered order(s)? Pending, Processing, and Shipped orders will remain.`
    );

    if (!confirmed) return;

    try {
      const deliveredOrderNumbers = new Set(
        deliveredOrders.map((order) => order.orderNumber)
      );

      const savedOrders = getOrders();

      const remainingSavedOrders = savedOrders.filter(
        (order) => !deliveredOrderNumbers.has(order.orderNumber)
      );

      localStorage.setItem(
        ORDERS_STORAGE_KEY,
        JSON.stringify(remainingSavedOrders)
      );

      const storedStatuses = localStorage.getItem(ORDER_STATUS_KEY);

      const savedStatuses = storedStatuses
        ? (JSON.parse(storedStatuses) as Record<string, OrderStatus>)
        : {};

      deliveredOrderNumbers.forEach((orderNumber) => {
        delete savedStatuses[orderNumber];
      });

      localStorage.setItem(
        ORDER_STATUS_KEY,
        JSON.stringify(savedStatuses)
      );

      setOrders((currentOrders) =>
        currentOrders.filter(
          (order) => order.status !== "Delivered"
        )
      );

      setError("");
      setSuccessMessage(
        `${deliveredOrders.length} delivered order(s) cleared successfully.`
      );
    } catch {
      setError("Unable to clear delivered orders. Please try again.");
      setSuccessMessage("");
    }
  }

  // Fetch products, categories, and users from the API.
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

  // Protect the admin page.
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/");
      return;
    }

    void loadDashboard();

    function handleStorageChange() {
      loadOrders();
    }

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [authLoading, user, router]);

  // Listen for the hamburger button in the top navbar.
  useEffect(() => {
    function handleAdminMenuToggle() {
      setMenuOpen((open) => !open);
    }

    window.addEventListener(
      "admin-menu-toggle",
      handleAdminMenuToggle
    );

    return () => {
      window.removeEventListener(
        "admin-menu-toggle",
        handleAdminMenuToggle
      );
    };
  }, []);

  // Close the menu when Escape is pressed.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function navigateTo(tabName: string) {
    setActiveTab(tabName);
    setMenuOpen(false);

    resetProductForm();
    resetCategoryForm();

    setSuccessMessage("");
    setError("");

    if (tabName === "Orders") {
      loadOrders();
    }
  }

  function resetProductForm() {
    setTitle("");
    setPrice("");
    setDescription("");
    setCategoryId(String(categories[0]?.id ?? 1));
    setImageUrl("");
    setEditingProduct(null);
    setShowAddProduct(false);
  }

  function startEditProduct(product: Product) {
    setEditingProduct(product);
    setTitle(product.title);
    setPrice(String(product.price));
    setDescription(product.description);
    setCategoryId(
      String(product.category?.id ?? categories[0]?.id ?? 1)
    );
    setImageUrl(product.images?.[0] ?? "");

    setShowAddProduct(true);
    setShowAddCategory(false);
    setActiveTab("Products");

    setError("");
    setSuccessMessage("");
  }

  // Add or update a product.
  async function handleSaveProduct(
    event: FormEvent<HTMLFormElement>
  ) {
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
              ? { ...category, ...updatedCategory, name, image }
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

  // Delete a category without hiding API errors.
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
      const message =
        error instanceof Error ? error.message : "";

      if (/FOREIGN KEY|SQLITE_CONSTRAINT_FOREIGNKEY/i.test(message)) {
        setError(
          `"${category.name}" cannot be deleted because existing products or other records still use it. The category has been kept safe.`
        );
      } else {
        console.error("Delete category error:", error);

        setError(
          message ||
            "Unable to delete this category. Please try again."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  // Product search, category filtering, and sorting.
  const filteredProducts = products
    .filter((product) =>
      product.title
        .toLowerCase()
        .includes(productSearch.toLowerCase())
    )
    .filter((product) =>
      productCategoryFilter === "all"
        ? true
        : String(product.category?.id) === productCategoryFilter
    )
    .sort((a, b) => {
      if (productSort === "price-low") {
        return Number(a.price) - Number(b.price);
      }

      if (productSort === "price-high") {
        return Number(b.price) - Number(a.price);
      }

      if (productSort === "name") {
        return a.title.localeCompare(b.title);
      }

      return 0;
    });

  // Remove duplicate users from the displayed list.
  const uniqueUsers = Array.from(
    new Map(
      users.map((storeUser) => [
        storeUser.email?.trim().toLowerCase() ||
          `id:${storeUser.id}`,
        storeUser,
      ])
    ).values()
  );

  const stats = [
    {
      title: "Total Products",
      value: products.length,
      icon: "🛍️",
    },
    {
      title: "Total Categories",
      value: categories.length,
      icon: "📂",
    },
    {
      title: "Total Users",
      value: uniqueUsers.length,
      icon: "👥",
    },
    {
      title: "Total Orders",
      value: orders.length,
      icon: "📦",
    },
  ];

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf7f2] text-[#402b20] transition-colors dark:bg-[#1c1613] dark:text-[#faf7f2]">
        <p className="text-sm">Checking your access...</p>
      </main>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#faf7f2] p-4 text-[#402b20] transition-colors dark:bg-[#1c1613] dark:text-[#faf7f2] sm:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#a78655] dark:text-[#c6a16b]">
              Shop Selina
            </p>

            <h1 className="mt-1 text-2xl font-bold text-[#402b20] dark:text-[#faf7f2] sm:text-3xl">
              {activeTab === "Overview"
                ? "Admin Dashboard"
                : activeTab}
            </h1>

            <p className="mt-1 text-sm text-[#806f63] dark:text-[#c4b4a7]">
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
              className="rounded-lg border border-[#eadfce] bg-white px-4 py-2 transition hover:bg-[#f0e5d4] dark:border-[#49372b] dark:bg-[#30231d] dark:text-[#faf7f2] dark:hover:bg-[#382a22]"
            >
              ↻ Refresh
            </button>

            <a
              href="/"
              className="rounded-lg border border-[#d4af6a] px-4 py-2 transition hover:bg-[#f0e5d4] dark:border-[#c6a16b] dark:text-[#c6a16b] dark:hover:bg-[#382a22]"
            >
              View Store →
            </a>
          </div>
        </header>

        {/* Statistics */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-2xl border border-[#eadfce] bg-white p-6 shadow-sm transition-colors dark:border-[#49372b] dark:bg-[#30231d]"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#806f63] dark:text-[#c4b4a7]">
                  {stat.title}
                </p>

                <span className="text-2xl">{stat.icon}</span>
              </div>

              <h2 className="mt-4 text-3xl font-bold text-[#402b20] dark:text-[#faf7f2]">
                {loading ? "..." : stat.value}
              </h2>
            </div>
          ))}
        </section>

        {/* Animated Navigation Drawer and Overlay */}
        <div
          className={`fixed inset-0 z-50 transition-[visibility] duration-300 ${
            menuOpen ? "visible" : "invisible delay-300"
          }`}
          aria-hidden={!menuOpen}
        >
          {/* Background overlay */}
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMenuOpen(false)}
            className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
              menuOpen
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          />

          <aside
            id="admin-navigation"
            inert={!menuOpen}
            className={`fixed right-0 top-0 z-[60] flex h-full w-72 max-w-[85vw] flex-col border-l border-[#eadfce] bg-[#faf7f2] p-6 shadow-xl transition-transform duration-300 ease-in-out dark:border-[#49372b] dark:bg-[#1c1613] ${
              menuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Drawer header */}
            <div className="mb-6 flex items-center justify-between border-b border-[#eadfce] pb-5 dark:border-[#49372b]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#a78655] dark:text-[#c6a16b]">
                  Shop Selina
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#402b20] dark:text-[#faf7f2]">
                  Admin Menu
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close navigation menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#eadfce] text-lg transition hover:bg-[#f0e5d4] dark:border-[#49372b] dark:bg-[#30231d] dark:text-[#faf7f2] dark:hover:bg-[#382a22]"
              >
                ✕
              </button>
            </div>

            {/* Admin profile summary */}
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-[#eadfce] bg-white p-4 transition-colors dark:border-[#49372b] dark:bg-[#30231d]">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#402b20] text-lg text-[#d4af6a] dark:bg-[#49372b] dark:text-[#c6a16b]">
                👤
              </div>

              <div className="min-w-0">
                <p className="truncate font-semibold text-[#402b20] dark:text-[#faf7f2]">
                  {user.name || "Administrator"}
                </p>

                <p className="truncate text-xs text-[#806f63] dark:text-[#c4b4a7]">
                  {user.email}
                </p>

                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[#a78655] dark:text-[#c6a16b]">
                  Admin account
                </p>
              </div>
            </div>

            <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#a78655] dark:text-[#c6a16b]">
              Navigation
            </p>

            {/* Admin navigation items */}
            <nav className="flex-1 space-y-2 overflow-y-auto">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => navigateTo(item.name)}
                  aria-current={
                    activeTab === item.name ? "page" : undefined
                  }
                  className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                    activeTab === item.name
                      ? "bg-[#402b20] text-white shadow-sm dark:bg-[#c6a16b] dark:text-[#1c1613]"
                      : "text-[#402b20] hover:bg-[#f0e5d4] dark:text-[#faf7f2] dark:hover:bg-[#30231d]"
                  }`}
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg ${
                    activeTab === item.name
                      ? "bg-white/10 dark:bg-black/10"
                      : "bg-[#f0e5d4] dark:bg-[#281d18]"
                  }`}>
                    {item.icon}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">
                      {item.name}
                    </span>

                    <span
                      className={`mt-0.5 block text-xs ${
                        activeTab === item.name
                          ? "opacity-80"
                          : "text-[#806f63] dark:text-[#c4b4a7]"
                      }`}
                    >
                      {item.description}
                    </span>
                  </span>

                  {item.name === "Orders" && orders.length > 0 && (
                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#d4af6a] px-2 text-xs font-bold text-[#402b20] dark:bg-[#c6a16b] dark:text-[#1c1613]">
                      {orders.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Drawer footer */}
            <div className="mt-6 border-t border-[#eadfce] pt-4 dark:border-[#49372b]">
              <p className="text-center text-xs text-[#806f63] dark:text-[#c4b4a7]">
                Shop Selina · Everyday Luxury
              </p>
            </div>
          </aside>
        </div>

        {/* Main content */}
        <section className="min-w-0 rounded-2xl border border-[#eadfce] bg-white p-5 shadow-sm transition-colors dark:border-[#49372b] dark:bg-[#30231d] sm:p-8">
          <div className="mb-6 border-b border-[#eadfce] pb-5 dark:border-[#49372b]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-[#402b20] dark:text-[#faf7f2]">
                {activeTab}
              </h2>

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
                  className="rounded-lg bg-[#402b20] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#604333] dark:bg-[#c6a16b] dark:text-[#1c1613] dark:hover:bg-[#d6b27c]"
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
                  className="rounded-lg bg-[#402b20] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#604333] dark:bg-[#c6a16b] dark:text-[#1c1613] dark:hover:bg-[#d6b27c]"
                >
                  {showAddCategory ? "Cancel" : "+ Add Category"}
                </button>
              )}
            </div>

            <p className="mt-2 text-sm text-[#806f63] dark:text-[#c4b4a7]">
              {activeTab === "Overview"
                ? "Here is an overview of your store."
                : activeTab === "Profile"
                  ? "View your account information."
                  : `Manage your store's ${activeTab.toLowerCase()} here.`}
            </p>
          </div>

          {/* Success and error messages */}
          {successMessage && (
            <p
              role="status"
              className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-300"
            >
              {successMessage}
            </p>
          )}

          {error && (
            <p
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
            >
              {error}
            </p>
          )}

          {/* Overview */}
          {activeTab === "Overview" && (
            <div className="rounded-xl bg-[#faf7f2] p-6 transition-colors dark:bg-[#281d18]">
              <h3 className="text-lg font-semibold text-[#402b20] dark:text-[#faf7f2]">
                Welcome back!
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#806f63] dark:text-[#c4b4a7]">
                Your dashboard statistics come from the EscuelaJS API,
                except orders, which are currently saved in this browser.
              </p>

              {loading && (
                <p className="mt-4 text-sm text-[#806f63] dark:text-[#c4b4a7]">
                  Loading dashboard data...
                </p>
              )}
            </div>
          )}

          {/* Products */}
          {activeTab === "Products" && (
            <div>
              {(showAddProduct || editingProduct) && (
                <form
                  onSubmit={handleSaveProduct}
                  className="mb-8 rounded-2xl border border-[#eadfce] bg-[#faf7f2] p-6 transition-colors dark:border-[#49372b] dark:bg-[#281d18]"
                >
                  <h3 className="text-lg font-bold text-[#402b20] dark:text-[#faf7f2]">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </h3>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#806f63] dark:text-[#c4b4a7]">
                        Product Title
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className={inputStyle}
                        placeholder="e.g. Silk Evening Dress"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#806f63] dark:text-[#c4b4a7]">
                        Price (USD)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        className={inputStyle}
                        placeholder="149.99"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#806f63] dark:text-[#c4b4a7]">
                        Category
                      </label>
                      <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className={inputStyle}
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id} className="dark:bg-[#281d18]">
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#806f63] dark:text-[#c4b4a7]">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        required
                        className={inputStyle}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#806f63] dark:text-[#c4b4a7]">
                        Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={3}
                        className={`${inputStyle} resize-y`}
                        placeholder="Product description..."
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-lg bg-[#402b20] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#604333] disabled:opacity-50 dark:bg-[#c6a16b] dark:text-[#1c1613] dark:hover:bg-[#d6b27c]"
                    >
                      {saving ? "Saving..." : editingProduct ? "Save Changes" : "Create Product"}
                    </button>
                    <button
                      type="button"
                      onClick={resetProductForm}
                      className="rounded-lg border border-[#eadfce] px-5 py-2.5 text-sm transition hover:bg-[#f0e5d4] dark:border-[#49372b] dark:text-[#faf7f2] dark:hover:bg-[#382a22]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="mb-6 flex flex-wrap gap-4">
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products..."
                  className={`flex-1 sm:max-w-xs ${inputStyle}`}
                />

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className={`sm:w-48 ${inputStyle}`}
                >
                  <option value="all" className="dark:bg-[#281d18]">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={String(cat.id)} className="dark:bg-[#281d18]">
                      {cat.name}
                    </option>
                  ))}
                </select>

                <select
                  value={productSort}
                  onChange={(e) => setProductSort(e.target.value)}
                  className={`sm:w-48 ${inputStyle}`}
                >
                  <option value="default" className="dark:bg-[#281d18]">Default Order</option>
                  <option value="price-low" className="dark:bg-[#281d18]">Price: Low to High</option>
                  <option value="price-high" className="dark:bg-[#281d18]">Price: High to Low</option>
                  <option value="name" className="dark:bg-[#281d18]">Name (A-Z)</option>
                </select>
              </div>

              {filteredProducts.length === 0 ? (
                <p className="py-12 text-center text-sm text-[#806f63] dark:text-[#c4b4a7]">
                  No products found.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-[#eadfce] text-[#806f63] dark:border-[#49372b] dark:text-[#c4b4a7]">
                        <th className="px-4 py-3 font-medium">Product</th>
                        <th className="px-4 py-3 font-medium">Category</th>
                        <th className="px-4 py-3 font-medium">Price</th>
                        <th className="px-4 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eadfce] dark:divide-[#49372b]">
                      {filteredProducts.map((prod) => (
                        <tr key={prod.id} className="transition hover:bg-[#faf7f2]/50 dark:hover:bg-[#281d18]/50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[#faf7f2] dark:bg-[#281d18]">
                                <img
                                  src={prod.images?.[0] || "/logo.webp"}
                                  alt={prod.title}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = "/logo.webp";
                                  }}
                                />
                              </div>
                              <span className="font-medium text-[#402b20] dark:text-[#faf7f2]">
                                {prod.title}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-[#806f63] dark:text-[#c4b4a7]">
                            {prod.category?.name || "Uncategorized"}
                          </td>
                          <td className="px-4 py-3 font-semibold text-[#402b20] dark:text-[#faf7f2]">
                            ${Number(prod.price).toFixed(2)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => startEditProduct(prod)}
                                className="rounded px-2.5 py-1 text-xs font-medium border border-[#eadfce] transition hover:bg-[#f0e5d4] dark:border-[#49372b] dark:hover:bg-[#382a22]"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => void handleDeleteProduct(prod)}
                                className="rounded px-2.5 py-1 text-xs font-medium border border-red-200 text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
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
              {(showAddCategory || editingCategory) && (
                <form
                  onSubmit={handleSaveCategory}
                  className="mb-8 rounded-2xl border border-[#eadfce] bg-[#faf7f2] p-6 transition-colors dark:border-[#49372b] dark:bg-[#281d18]"
                >
                  <h3 className="text-lg font-bold text-[#402b20] dark:text-[#faf7f2]">
                    {editingCategory ? "Edit Category" : "Add New Category"}
                  </h3>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#806f63] dark:text-[#c4b4a7]">
                        Category Name
                      </label>
                      <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                        className={inputStyle}
                        placeholder="e.g. Footwear"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#806f63] dark:text-[#c4b4a7]">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={categoryImage}
                        onChange={(e) => setCategoryImage(e.target.value)}
                        required
                        className={inputStyle}
                        placeholder="https://example.com/category.jpg"
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-lg bg-[#402b20] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#604333] disabled:opacity-50 dark:bg-[#c6a16b] dark:text-[#1c1613] dark:hover:bg-[#d6b27c]"
                    >
                      {saving ? "Saving..." : editingCategory ? "Save Changes" : "Create Category"}
                    </button>
                    <button
                      type="button"
                      onClick={resetCategoryForm}
                      className="rounded-lg border border-[#eadfce] px-5 py-2.5 text-sm transition hover:bg-[#f0e5d4] dark:border-[#49372b] dark:text-[#faf7f2] dark:hover:bg-[#382a22]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {categories.length === 0 ? (
                <p className="py-12 text-center text-sm text-[#806f63] dark:text-[#c4b4a7]">
                  No categories found.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex flex-col justify-between overflow-hidden rounded-xl border border-[#eadfce] bg-white transition-colors dark:border-[#49372b] dark:bg-[#281d18]"
                    >
                      <div className="h-36 w-full bg-[#faf7f2] dark:bg-[#211a16]">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/logo.webp";
                          }}
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-1 justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-[#a78655] dark:text-[#c6a16b]">
                            ID: {cat.id}
                          </p>
                          <h4 className="mt-1 font-semibold text-[#402b20] dark:text-[#faf7f2]">
                            {cat.name}
                          </h4>
                        </div>
                        <div className="mt-4 flex gap-2 border-t border-[#eadfce] pt-3 dark:border-[#49372b]">
                          <button
                            type="button"
                            onClick={() => startEditCategory(cat)}
                            className="flex-1 rounded border border-[#eadfce] py-1.5 text-xs font-medium transition hover:bg-[#f0e5d4] dark:border-[#49372b] dark:hover:bg-[#382a22]"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDeleteCategory(cat)}
                            className="flex-1 rounded border border-red-200 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
                          >
                            Delete
                          </button>
                        </div>
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
              {uniqueUsers.length === 0 ? (
                <p className="py-12 text-center text-sm text-[#806f63] dark:text-[#c4b4a7]">
                  No registered users found.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-[#eadfce] text-[#806f63] dark:border-[#49372b] dark:text-[#c4b4a7]">
                        <th className="px-4 py-3 font-medium">User</th>
                        <th className="px-4 py-3 font-medium">Email</th>
                        <th className="px-4 py-3 font-medium">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eadfce] dark:divide-[#49372b]">
                      {uniqueUsers.map((u, idx) => (
                        <tr key={u.id || idx} className="transition hover:bg-[#faf7f2]/50 dark:hover:bg-[#281d18]/50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f0e5d4] text-[#402b20] dark:bg-[#382a22] dark:text-[#faf7f2]">
                                👤
                              </div>
                              <span className="font-medium text-[#402b20] dark:text-[#faf7f2]">
                                {u.name || "Customer"}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-[#806f63] dark:text-[#c4b4a7]">
                            {u.email}
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex rounded-full bg-[#f0e5d4] px-2.5 py-0.5 text-xs font-semibold capitalize text-[#402b20] dark:bg-[#49372b] dark:text-[#faf7f2]">
                              {u.role || "customer"}
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
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-[#806f63] dark:text-[#c4b4a7]">
                  {orders.length} total order(s) placed in this browser.
                </p>

                {orders.some((o) => o.status === "Delivered") && (
                  <button
                    type="button"
                    onClick={handleClearDeliveredOrders}
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-700 transition hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-950/50"
                  >
                    Clear Delivered Orders
                  </button>
                )}
              </div>

              {orders.length === 0 ? (
                <p className="py-12 text-center text-sm text-[#806f63] dark:text-[#c4b4a7]">
                  No customer orders found.
                </p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.orderNumber}
                      className="rounded-xl border border-[#eadfce] bg-[#faf7f2] p-5 transition-colors dark:border-[#49372b] dark:bg-[#281d18]"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eadfce] pb-3 dark:border-[#49372b]">
                        <div>
                          <p className="font-bold text-[#402b20] dark:text-[#faf7f2]">
                            Order #{order.orderNumber}
                          </p>
                          <p className="text-xs text-[#806f63] dark:text-[#c4b4a7]">
                            {order.customer.fullName} ({order.customer.email}) · {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-bold text-[#a78655] dark:text-[#c6a16b]">
                            ${order.total.toFixed(2)}
                          </span>

                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(
                                order.orderNumber,
                                e.target.value as OrderStatus
                              )
                            }
                            className="rounded-lg border border-[#eadfce] bg-white px-3 py-1.5 text-xs font-medium text-[#402b20] outline-none dark:border-[#49372b] dark:bg-[#30231d] dark:text-[#faf7f2]"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-3 space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs text-[#806f63] dark:text-[#c4b4a7]">
                            <span>
                              {item.title} × {item.quantity}
                            </span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile */}
          {activeTab === "Profile" && (
            <div className="mx-auto max-w-2xl">
              <div className="overflow-hidden rounded-2xl border border-[#eadfce] transition-colors dark:border-[#49372b] dark:bg-[#281d18]">
                <div className="h-28 bg-gradient-to-r from-[#402b20] via-[#806044] to-[#d4af6a] dark:from-[#30231d] dark:via-[#49372b] dark:to-[#c6a16b]" />

                <div className="px-6 pb-6">
                  <div className="-mt-12 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-[#faf7f2] text-4xl shadow-sm dark:border-[#30231d] dark:bg-[#382a22]">
                    👤
                  </div>

                  <h3 className="mt-4 text-2xl font-bold text-[#402b20] dark:text-[#faf7f2]">
                    {user.name || "Administrator"}
                  </h3>

                  <p className="mt-1 text-sm text-[#806f63] dark:text-[#c4b4a7]">
                    Shop Selina Administrator
                  </p>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-xl border border-[#eadfce] p-4 transition-colors dark:border-[#49372b] dark:bg-[#211a16]">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#a78655] dark:text-[#c6a16b]">
                        Full Name
                      </p>

                      <p className="mt-2 break-words text-sm font-medium text-[#402b20] dark:text-[#faf7f2]">
                        {user.name || "Not available"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#eadfce] p-4 transition-colors dark:border-[#49372b] dark:bg-[#211a16]">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#a78655] dark:text-[#c6a16b]">
                        Email Address
                      </p>

                      <p className="mt-2 break-words text-sm font-medium text-[#402b20] dark:text-[#faf7f2]">
                        {user.email || "Not available"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#eadfce] p-4 transition-colors dark:border-[#49372b] dark:bg-[#211a16]">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#a78655] dark:text-[#c6a16b]">
                        Account Role
                      </p>

                      <span className="mt-2 inline-flex rounded-full bg-[#f0e5d4] px-3 py-1 text-xs font-semibold capitalize text-[#402b20] dark:bg-[#49372b] dark:text-[#faf7f2]">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}