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

interface Service {
  id: string;
  name: string;
  price: number;
}

interface PaymentType {
  id: number;
  name: string;
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
