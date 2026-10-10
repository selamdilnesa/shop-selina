export type DemoOrder = {
  orderNumber: string;
  customer: {
    fullName?: string;
    name?: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
  };
  items: Array<{
    id: number;
    title: string;
    price: number;
    quantity: number;
    images?: string[];
  }>;
  total: number;
  createdAt: string;
};

const ORDERS_KEY = "shop-selina-orders";

export function getOrders(): DemoOrder[] {
  if (typeof window === "undefined") return [];

  try {
    const savedOrders = localStorage.getItem(ORDERS_KEY);
    return savedOrders ? JSON.parse(savedOrders) as DemoOrder[] : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: DemoOrder): void {
  const orders = getOrders();

  orders.unshift(order);

  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}
