interface Category{
  id: number;
  name: string;
}

interface Product{
  id: number;
  name: string;
  category: Category;
  amount: number;
  price: number;
  description: string;
  image: string;
}

type Services = 'assembly' | 'os_installation';

interface Service {
  id: string;
  name: Services;
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

type OrderServices = Record<Services, boolean>;

interface Order extends OrderServices{
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
