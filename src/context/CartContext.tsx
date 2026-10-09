"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Product = {
  id: number;
  title: string;
  price: number;
  images: string[];
};

export type CartItem = Product & {
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load the saved cart when the website opens
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("shop-selina-cart");

      if (savedCart) {
        const parsedCart: unknown = JSON.parse(savedCart);

        if (
          Array.isArray(parsedCart) &&
          parsedCart.every(
            (item) =>
              item !== null &&
              typeof item === "object" &&
              typeof item.id === "number" &&
              typeof item.title === "string" &&
              typeof item.price === "number" &&
              Array.isArray(item.images) &&
              typeof item.quantity === "number" &&
              item.quantity > 0
          )
        ) {
          setCart(parsedCart as CartItem[]);
        }
      }
    } catch {
      console.error("Could not load the saved cart.");
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart changes automatically
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem("shop-selina-cart", JSON.stringify(cart));
    } catch {
      console.error("Could not save the cart.");
    }
  }, [cart, isLoaded]);

  // Add a product
  function addToCart(product: Product) {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });
  }

  // Increase or decrease quantity
  function updateQuantity(id: number, quantity: number) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  // Remove a product completely
  function removeFromCart(id: number) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    );
  }

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
