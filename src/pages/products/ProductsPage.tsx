import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductsPage.scss';
import { Helmet } from 'react-helmet-async';
import PromiseHandler from '../../components/PromiseHandler';
import Pagination from '../../components/Pagination';
import { ProductAvailability, ProductFilters, ProductFiltersSection } from './ProductFiltersSection';
import { ProductSortSection } from './ProductSortSection';
import { ProductCard } from './ProductCard';

export default function ProductsPage() {
  const initFilters: (searchParams?: URLSearchParams) => ProductFilters = (searchParams) => {
    const category: number[] = [];
    searchParams?.getAll('category[]').forEach((c) => {
      let categoryId = Number(c);
      if (!isNaN(categoryId)) {
        category.push(categoryId);
      }
    });
    return {
      category,
      availability: (searchParams?.get('availability') ?? undefined) as ProductAvailability | undefined
    }
  }

  const fetchProducts = async (filters: ProductFilters, sort: string, sortDirection: string, page: number) => {
    const searchParams = new URLSearchParams();
    filters.category.forEach((category) => searchParams.append('category[]', category.toString()));
    if (filters.availability) {
      searchParams.append('availability', filters.availability);
    }
    if (sort) {
      searchParams.append('sort', sort);
    }
    if (sortDirection) {
      searchParams.append('sort_dir', sortDirection);
    }
    searchParams.append('page', page.toString());
    navigate({ pathname: location.pathname, search: searchParams.toString() }, { replace: true });
    const response = await axios.get<PaginationFor<Product>>('/api/products', { params: searchParams });
    const { data, ...pagination } = response.data;
    setPaginator(pagination);
    setProducts(data);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  const fetchCategories = async () => {
    const response = await axios.get('/api/categories');
    setCategories(response.data);
  }

  const location = useLocation();
  const searchParams = new URL(window.location.toString()).searchParams
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [paginator, setPaginator] = useState<Paginator>();
  const [filters, setFilters] = useState<ProductFilters>(initFilters(searchParams));
  const [sort, setSort] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<string>('');
  const [productsPromise, setProductsPromise] = useState<Promise<any>>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categoriesPromise, setCategoriesPromise] = useState<Promise<any>>();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setProductsPromise(fetchProducts(filters, sort, sortDirection, page));
    setCategoriesPromise(fetchCategories());
  }, []);

  return (
    <>
      <Helmet>
        <title>Produkty</title>
      </Helmet>
      <div className='row align-items-start' style={{ marginBottom: '-1.5rem' }}>
        <div className='col-3 sticky-top side-section-sticky'>
          <PromiseHandler promise={categoriesPromise} onDone={() =>
            <form onReset={(e) => {
              e.preventDefault();
              setFilters(initFilters());
              setSort('');
              setSortDirection('');
              setPage(1);
              setTimeout(() => setProductsPromise(fetchProducts(initFilters(), '', '', 1)), 0);
            }} onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
              setProductsPromise(fetchProducts(filters, sort, sortDirection, 1));
            }}>
              <ProductFiltersSection categories={categories}
                                     filters={filters}
                                     onChange={(_filters) => {
                                       setFilters(_filters);
                                     }}/>
              <hr className='text-orange' style={{ height: '2px' }}/>
              <ProductSortSection sort={sort} direction={sortDirection} onChange={(_sort, _direction) => {
                setSort(_sort);
                setSortDirection(_direction);
              }}/>
              <div className='d-grid gap-2 d-lg-flex justify-content-center gx-lg-1 text-center mt-3'>
                <button className='btn btn-outline-orange' type='reset'>Wyczyść</button>
                <button className='btn btn-orange' type='submit'>Zastosuj</button>
              </div>
            </form>
          }/>
        </div>
        <div className='col-9 pb-4'>
          <PromiseHandler promise={productsPromise}
                          onDone={() =>
                            <>
                              {
                                products.map((product) => <ProductCard key={product.id} product={product}/>)
                              }
                              <Pagination what='Produkty'
                                          paginator={paginator!}
                                          onPageChanged={(_page) => {
                                            setPage(_page);
                                            setProductsPromise(fetchProducts(filters, sort, sortDirection, _page));
                                          }}/>
                            </>
                          }/>
          {/*{{ $products->links(null, ['what' => 'Produktów'])}}*/}
        </div>
      </div>
      <div className='toast-container position-fixed bottom-0 end-0 p-3' style={{ zIndex: 11 }}>
      </div>
    </>
  )
}
