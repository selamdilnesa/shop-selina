# Shop Selina — Modern E-Commerce Web Application

A fully responsive, feature-rich e-commerce web application featuring a customer storefront, persistent shopping cart, authentication, user profiles, and an administrative dashboard.

Built as an individual capstone project for the **BE-XPERT Frontend Development Course**.

---

## 🚀 Live Demo & Repository

* **GitHub Repository:** [Shop Selina](https://github.com/selamdilnesa/shop-selina)
* **Live Deployment:** Not deployed yet.

> Once the application is deployed, replace the deployment status above with your actual live URL.

---

## 🛠️ Tech Stack

| Technology                                                | Purpose                                                       |
| --------------------------------------------------------- | ------------------------------------------------------------- |
| [Next.js](https://nextjs.org/)                            | React framework using the App Router                          |
| [TypeScript](https://www.typescriptlang.org/)             | Type-safe JavaScript                                          |
| [Tailwind CSS](https://tailwindcss.com/)                  | Responsive styling and layout                                 |
| [shadcn/ui](https://ui.shadcn.com/)                       | Reusable UI components                                        |
| [next-themes](https://github.com/pacocoursey/next-themes) | Theme management                                              |
| [EscuelaJS API](https://api.escuelajs.co/api/v1)          | Product, category, and user data                              |
| Local Storage                                             | Persistent shopping cart and locally stored application state |

### 🎨 Design System

Shop Selina uses a warm, minimal, and modern design inspired by neutral colors and subtle gold accents.

* **Dark Background:** `#1c1613`
* **Gold Accent:** `#c6a16b`
* **Light Background:** `#faf7f2`
* **Primary Text:** `#402b20`
* **Gold Border:** `#d4af6a`
* **Beige Border:** `#eadfce`

The interface supports light, dark, and system theme preferences.

---

## ✨ Key Features

### 🛍️ Customer Storefront

* **Product Discovery:** Browse products with search, category filtering, price sorting, and responsive product grids.
* **Product Details:** Dedicated product pages at `/products/[id]`, including product images, descriptions, prices, and quantity selection.
* **Dynamic Categories:** Browse categories retrieved from the API.
* **Category Collections:** View products associated with individual categories.
* **Shopping Cart:** Add and remove products, update quantities, and calculate subtotals.
* **Cart Persistence:** Shopping cart data is stored in Local Storage to preserve the cart between page visits.
* **Cart Quantity Management:** Adding an existing product increases its quantity instead of creating a duplicate cart entry.
* **Responsive Design:** Optimized layouts for desktop, tablet, and mobile devices.
* **Loading and Error States:** Provides feedback when data is loading or requests fail.

### 🛒 Checkout

* Checkout page with form validation.

* Order summary displaying selected products and totals.

* Protected checkout flow requiring authentication.

* Redirects unauthenticated users to the login page with the message:

  `Please log in or create an account to continue to checkout.`

* Simulated checkout completion.

* Order success confirmation page at `/checkout/success`.

> Checkout is simulated for demonstration purposes. It does not process real payments.

### 🔐 Authentication & User Profile

* User registration connected to the EscuelaJS API.
* User login with input validation and error handling.
* Protected profile page at `/profile`.
* Display of account information and avatar when available.
* Logout functionality.
* Authentication-aware navigation and access control.

### 📊 Admin Dashboard

The administrative dashboard provides an interface for managing store data and viewing application statistics.

**Dashboard Overview**

* Total product count.
* Total category count.
* Registered user count.

**Product Management**

* View and search products.
* Create new products.
* Edit existing products.
* Manage product information through the API.

**Category Management**

* View available categories.
* Create and update categories.
* Delete categories when supported by API constraints.

**User Management**

* View registered users.
* Inspect available account information.

**Admin Navigation**

* Dedicated dashboard navigation.
* Separate management pages for products, categories, and users.
* Responsive layout for different screen sizes.

> Administrative access control and API permissions depend on the application's authentication implementation and the capabilities of the public API.

---

## 📱 Application Previews

The following screenshots showcase the application across mobile and desktop screen sizes.

All screenshot paths below are relative to the repository root.

### 📱 Mobile Storefront

#### 1. Home, Products & Categories

|                                 Home Page                                |                                   Products Catalog                                   |                                         Categories                                        |
| :----------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------: |
| ![Mobile Home](./public/assets/shop-selina-assets/mobile/home/home1.png) | ![Mobile Products](./public/assets/shop-selina-assets/mobile/products/product-1.png) | ![Mobile Categories](./public/assets/shop-selina-assets/mobile/categories/category-1.png) |

#### 2. Mobile Admin Dashboard

![Mobile Admin Dashboard 1](./public/assets/shop-selina-assets/mobile/admin/admin-1.png)

![Mobile Admin Dashboard 2](./public/assets/shop-selina-assets/mobile/admin/admin-2.png)

---

### 🖥️ Desktop Application

#### 1. Home Page (`/`)

![Home Page Desktop 1](./public/assets/shop-selina-assets/desktop/home/home-1.png)

![Home Page Desktop 2](./public/assets/shop-selina-assets/desktop/home/home-2.png)

![Home Page Desktop 3](./public/assets/shop-selina-assets/desktop/home/home-3.png)

#### 2. Products Catalog (`/products`)

![Products Catalog Desktop 1](./public/assets/shop-selina-assets/desktop/product/product-1.png)

![Products Catalog Desktop 2](./public/assets/shop-selina-assets/desktop/product/product-2.png)

#### 3. Categories (`/categories`)

![Categories Desktop](./public/assets/shop-selina-assets/desktop/categories/categories-1.png)

#### 4. Shopping Cart (`/cart`)

![Shopping Cart Desktop](./public/assets/shop-selina-assets/desktop/cart/cart-1.png)

#### 5. Authentication & User Profile

**Login (`/login`)**

![Login Page](./public/assets/shop-selina-assets/desktop/login-and-register/login.png)

**Registration (`/register`)**

![Registration Page](./public/assets/shop-selina-assets/desktop/login-and-register/register.png)

**User Profile (`/profile`)**

![User Profile](./public/assets/shop-selina-assets/desktop/profile/profile.png)

#### 6. Admin Dashboard (`/admin`)

![Admin Dashboard 1](./public/assets/shop-selina-assets/desktop/admin-page/admin1.png)

![Admin Dashboard 2](./public/assets/shop-selina-assets/desktop/admin-page/admin2.png)

---

## 📁 Project Route Structure

### Customer Storefront

| Route               | Description                            |
| ------------------- | -------------------------------------- |
| `/`                 | Home page                              |
| `/products`         | Product listing, search, and filtering |
| `/products/[id]`    | Individual product details             |
| `/categories`       | Categories listing                     |
| `/categories/[id]`  | Products within a selected category    |
| `/cart`             | Shopping cart                          |
| `/checkout`         | Checkout form and order summary        |
| `/checkout/success` | Order confirmation                     |
| `/login`            | User login                             |
| `/register`         | User registration                      |
| `/profile`          | User profile                           |

### Admin Dashboard

| Route                       | Description                       |
| --------------------------- | --------------------------------- |
| `/admin`                    | Dashboard overview and statistics |
| `/admin/products`           | Product management                |
| `/admin/products/new`       | Create a product                  |
| `/admin/products/[id]/edit` | Edit a product                    |
| `/admin/categories`         | Category management               |
| `/admin/users`              | Registered user management        |

> The routes listed above describe the intended application structure. Ensure each route exists in the repository before submitting the project.

---

## ⚙️ Getting Started & Installation

Follow these steps to run Shop Selina on your local machine.

### Prerequisites

Make sure you have installed:

* [Node.js](https://nodejs.org/) — a compatible version for your Next.js project.
* npm — included with Node.js.
* [Git](https://git-scm.com/) — for cloning the repository.

### 1. Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/selamdilnesa/shop-selina.git
cd shop-selina
```

### 2. Install Dependencies

Run the following command from the project directory:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory of the project.

Add the following environment variable:

```env
NEXT_PUBLIC_API_URL=https://api.escuelajs.co/api/v1
```

Save the file before starting the development server.

> The application uses the public EscuelaJS API. API availability, authentication behavior, and write permissions may vary.

### 4. Start the Development Server

Run:

```bash
npm run dev
```

### 5. Open the Application

Open your browser and visit:

**http://localhost:3000**

The application should now be running locally.

---

## 🔌 API Integration

Shop Selina integrates with the public [EscuelaJS API](https://api.escuelajs.co/api/v1) to retrieve and manage supported store data.

The API is used for functionality such as:

* Product listings and product details.
* Category listings and category details.
* User registration and authentication.
* Supported product and category management operations.

### API Configuration

The API base URL is configured through the `NEXT_PUBLIC_API_URL` environment variable.

This allows the application to use a configurable API endpoint rather than repeating the base URL throughout the codebase.

### Error Handling

The application should account for API request failures, loading delays, unavailable resources, and unsupported write operations.

Because the API is public and shared, write operations may be restricted or affect shared data. Administrative functionality should be tested against the API's current capabilities.

---

## 🔒 Security & Data Handling

* Authentication-related pages provide access to account functionality.
* Protected pages should verify authentication before allowing access.
* Administrative routes should enforce appropriate authorization.
* Environment variables provide a configurable API endpoint.
* Local Storage is used for persistent client-side cart data.
* Checkout is simulated and does not represent a real financial transaction.

**Security note:** A protected frontend route alone does not provide complete security. Sensitive operations require authorization on the server or API side.

---

## 📌 Project Goals

Shop Selina was developed to demonstrate practical frontend development skills, including:

* Building a responsive e-commerce interface.
* Developing reusable React components.
* Using Next.js App Router.
* Working with TypeScript.
* Integrating a REST API.
* Managing application state.
* Implementing client-side persistence.
* Creating authentication and profile interfaces.
* Building an administrative dashboard.
* Handling loading, empty, and error states.
* Organizing a maintainable frontend project.

---

## 📄 License & Acknowledgements

This project was created as an individual capstone project for the **BE-XPERT Frontend Development Course**.

Product, category, and authentication functionality uses the public EscuelaJS API. API behavior and availability are subject to the service's current implementation and policies.

---

## 👩🏽‍💻 Author

**Selam Dilnesa**


* **GitHub:** [@selamdilnesa](https://github.com/selamdilnesa)
* **Project:** [Shop Selina](https://github.com/selamdilnesa/shop-selina)

---

*Built with passion and precision by Selam Dilnesa.*
