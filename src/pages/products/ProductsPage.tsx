import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductsPage.scss';
import { Helmet } from 'react-helmet-async';
import PromiseHandler from '../../components/PromiseHandler';
import Pagination from '../../components/Pagination';
import { ProductAvailability, ProductFilters, ProductFiltersSection } from './ProductFiltersSection';
import { ProductSortSection } from './ProductSortSection';
import { ProductCard } from './ProductCard';
import { Form, Formik } from 'formik';
import ReactDOM from 'react-dom';
import { useAuthStore } from '../../store/authStore';
import formatCurrency from '../../utils/formatCurrency';
import useCategories from '../../hooks/useCategories';

export default function ProductsPage() {
  const initFilters: (searchParams?: URLSearchParams) => ProductFilters = (searchParams) => {
    return {
      category: searchParams?.getAll('category[]') ?? [],
      availability: (searchParams?.get('availability') ?? undefined) as ProductAvailability | undefined
    }
  }

  const location = useLocation();
  const searchParams = new URL(window.location.toString()).searchParams
  const navigate = useNavigate();
  const isAdmin = useAuthStore(state => state.user)?.admin ?? false;
  const [page, setPage] = useState<number>(Number(searchParams.get('page') ?? 1));
  const [paginator, setPaginator] = useState<Paginator>();
  const [filters, setFilters] = useState<ProductFilters>(initFilters(searchParams));
  const [sort, setSort] = useState<string>(searchParams.get('sort') ?? '');
  const [sortDirection, setSortDirection] = useState<string>(searchParams.get('sort_dir') ?? '');
  const [products, setProducts] = useState<Product[]>([]);
  const [productsPromise, setProductsPromise] = useState<Promise<any>>();
  const [categories, categoriesPromise] = useCategories();

  const fetchProducts = useCallback(async () => {
    const searchParams = new URLSearchParams();
    filters.category.forEach((category) => searchParams.append('category[]', category));
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
  }, [filters, sort, sortDirection, page]);

  useEffect(() => {
    setProductsPromise(fetchProducts());
  }, [fetchProducts]);

  return (
    <>
      <Helmet>
        <title>Produkty</title>
      </Helmet>
      <div className='row align-items-start' style={{ marginBottom: '-1.5rem' }}>
        <div className='col-12 col-sm-3 sticky-top side-section-sticky'>
          { isAdmin ?
            <div className='d-grid gap-2 mb-4'>
              <Link to='/produkty/dodaj' className='btn btn-outline-orange'>Nowy produkt</Link>
              <Link to='/kategorie' className='btn btn-outline-orange'>Kategorie</Link>
            </div> : null
          }
          <PromiseHandler promise={categoriesPromise} onDone={() =>
            <Formik
              initialValues={{ filters: {...filters}, sort: sort, sortDirection: sortDirection }}
              onReset={(values, { setValues }) => {
                setFilters(initFilters());
                setSort('');
                setSortDirection('');
                setPage(1);
              }}
              onSubmit={(values, { setSubmitting }) => {
                ReactDOM.unstable_batchedUpdates(() => {
                  setFilters(values.filters);
                  setSort(values.sort);
                  setSortDirection(values.sortDirection);
                  setPage(1);
                })
                setSubmitting(false);
              }}>
              <Form>
                <ProductFiltersSection categories={categories}/>
                <hr className='text-orange' style={{ height: '2px' }}/>
                <ProductSortSection/>
                <div className='d-grid gap-2 d-lg-flex justify-content-center gx-lg-1 text-center mt-3'>
                  <button className='btn btn-outline-orange' type='reset'>Wyczyść</button>
                  <button className='btn btn-orange' type='submit'>Zastosuj</button>
                </div>
              </Form>
            </Formik>
          }/>
        </div>
        <div className='col-12 col-sm-9 pb-4'>
          <PromiseHandler promise={productsPromise}
                          onDone={() =>
                            isAdmin ?
                              <div className='table-responsive'>
                                <table className='table table-hover' style={{ verticalAlign: 'middle' }}>
                                  <thead>
                                    <tr>
                                      <th scope='col'></th>
                                      <th scope='col'>Nazwa</th>
                                      <th scope='col'>Kategoria</th>
                                      <th scope='col'>Cena</th>
                                      <th scope='col'>Stan</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {products.map((product) =>
                                      <tr key={product.id} className='position-relative'>
                                        <td>
                                          <Link to={`/produkty/edytuj/${product.id}`} className='stretched-link'>
                                            <span className='d-flex flex-center border rounded p-1 bg-white'
                                                  style={{ width: '3rem', height: '3rem' }}>
                                              <img className='w-100 h-100 object-fit-contain'
                                                   src={`/storage/products/${product.image}`}
                                                   alt={product.name}/>
                                            </span>
                                          </Link>
                                        </td>
                                        <td>{product.name}</td>
                                        <td className='text-muted'>{product.category.name}</td>
                                        <td className='text-nowrap'>
                                          <span className='text-muted me-1'>{formatCurrency(product.price)}</span>
                                          <span className='text-orange'>zł</span>
                                        </td>
                                        <td>{product.amount}</td>
                                      </tr>
                                    )}
                                    {products.length === 0 ?
                                      <tr>
                                        <td colSpan={5} className='text-center text-muted'>Brak wyników</td>
                                      </tr> : null
                                    }
                                  </tbody>
                                  <tfoot>
                                    <tr>
                                      <th colSpan={5}>
                                        <Pagination what={'Produktów'}
                                                    paginator={paginator!}
                                                    onPageChanged={(_page) => setPage(_page)}/>
                                      </th>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div> :
                              <>
                                {products.map((product) => <ProductCard key={product.id} product={product}/>)}
                                <Pagination what='Produkty'
                                            paginator={paginator!}
                                            onPageChanged={(_page) => {
                                              setPage(_page);
                                            }}/>
                              </>
                          }/>
        </div>
      </div>
      <div className='toast-container position-fixed bottom-0 end-0 p-3' style={{ zIndex: 11 }}>
      </div>
    </>
  )
}
