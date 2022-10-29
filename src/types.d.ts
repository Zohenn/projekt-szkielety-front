interface Category{
  id: number;
  name: string;
  products_exists?: boolean;
}

interface Product{
  id: number;
  name: string;
  category_id: number;
  category: Category;
  amount: number;
  price: number;
  description: string;
  image: string;
}

interface Service {
  id: number;
  name: string;
  price: number;
}

interface PaymentType {
  id: number;
  name: string;
}

interface OrderStatus {
  id: number;
  name: string;
}

interface OrderDetails {
  id: number;
  price: number;
  product: Product;
}

interface OrderServices {
  service: Service;
}

interface Order {
  id: number;
  name: string;
  surname: string;
  address: string;
  postal_code: string;
  city: string;
  phone: string;
  value: number;
  date: Date;
  payment_type: PaymentType;
  order_status: OrderStatus;

  // [k: Services]: boolean;
  details: OrderDetails[];
  services: OrderServices[];
}

interface PaginationLink{
  url: string | null;
  label: string;
  active: boolean;
}

interface Paginator{
  current_page: number;
  last_page: number;
  links: PaginationLink[];
  next_page_url: string | null;
  per_page: number;
  prev_page_url: string | null;
  total: number;
}

interface PaginationFor<T> extends Paginator {
  data: T[];
}
