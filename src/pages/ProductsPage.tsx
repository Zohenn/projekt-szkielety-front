import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import formatCurrency from '../utils/formatCurrency';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import './ProductsPage.scss';
import { Helmet } from 'react-helmet-async';
import ModalButton from '../components/ModalButton';
import { Modal } from 'react-bootstrap';
import PromiseHandler from '../components/PromiseHandler';
import Pagination from '../components/Pagination';

type ProductAvailability = 'available' | 'unavailable';

interface ProductFilters{
  category: number[];
  availability?: ProductAvailability;
}

interface ProductFiltersSectionProps{
  categories: Category[];
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
}

function ProductFiltersSection({ categories, filters, onChange }: ProductFiltersSectionProps){
  const changeCategory = (category: number, value: boolean) => {
    let _categories;
    if(!value){
      _categories = filters.category.filter((c) => c !== category)
    }else{
      _categories = [...filters.category];
      _categories.push(category);
    }
    onChange({ category: _categories, availability: filters.availability })
  }

  return (
    <div>
      <h4 className='orange-underline'>Filtrowanie</h4>
      <div>
        <div className='text-muted'>Kategoria</div>
        <div>
          {
            categories.map((category) =>
              <div key={category.id} className='form-check'>
                <input className='form-check-input'
                       type='checkbox'
                       value={category.id}
                       id={`category-${category.id}`}
                       name='category[]'
                       checked={filters.category.includes(category.id)}
                       onChange={(e) => changeCategory(category.id, e.target.checked)}/>
                <label className='form-check-label' htmlFor={`category-${category.id}`}>
                  {category.name}
                </label>
              </div>
            )
          }
        </div>
        <div className='text-muted mt-4'>Dostępność</div>
        <div>
          <div className='form-check'>
            <input className='form-check-input'
                   type='radio'
                   value='available'
                   id='availability-available'
                   name='availability'
                   checked={filters.availability === 'available'}
                   onChange={() => onChange({ ...filters, availability: 'available' })}/>
            <label className='form-check-label' htmlFor='availability-available'>Dostępny</label>
          </div>
          <div className='form-check'>
            <input className='form-check-input'
                   type='radio'
                   value='unavailable'
                   id='availability-unavailable'
                   name='availability'
                   checked={filters.availability === 'unavailable'}
                   onChange={() => onChange({ ...filters, availability: 'unavailable' })}/>
            <label className='form-check-label' htmlFor='availability-unavailable'>Niedostępny</label>
          </div>
        </div>
      </div>
    </div>
  )
}

const sortOptions = {
  price: 'Cena',
  amount: 'Stan'
};

const sortDirections = {
  asc: 'Rosnąco',
  desc: 'Malejąco'
}

interface ProductSortSectionProps{
  sort: string;
  direction: string;
  onChange: (sort: string, direction: string) => void;
}

function ProductSortSection({ sort, direction, onChange }: ProductSortSectionProps){
  return (
    <div>
      <h4 className='orange-underline'>Sortowanie</h4>
      <div>
        <div>
          <div className='text-muted'>Pole</div>
          {
            Object.entries(sortOptions).map(([option, label]) =>
              <div key={option} className='form-check'>
                <input className='form-check-input'
                       type='radio'
                       name='sort'
                       value={option}
                       id={`sort-${option}`}
                       checked={sort === option}
                       onChange={() => onChange(option, direction)}/>
                <label className='form-check-label' htmlFor={`sort-${option}`}>{label}</label>
              </div>
            )}
        </div>
        <div className='mt-4'>
          <div className='text-muted'>Kierunek</div>
          {
            Object.entries(sortDirections).map(([option, label]) =>
              <div key={option} className='form-check'>
                <input className='form-check-input'
                       type='radio'
                       name='sort_dir'
                       value={option}
                       id={`sort_dir-${option}`}
                       checked={direction === option}
                       onChange={() => onChange(sort, option)}/>
                <label className='form-check-label' htmlFor={`sort_dir-${option}`}>{label}</label>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }){
  const { isSignedIn } = useAuthStore();
  const { items: cartItems, addToCart } = useCartStore();

  return (
    <div className='card mb-4 overflow-hidden'>
      <div className='row g-0'>
        <div className='col-md-3 p-3'>
          <div className='ratio ratio-1x1'>
            <img className='img-fluid object-fit-contain'
                 src={`/storage/products/${product.image}`}
                 alt={product.name}/>
          </div>
        </div>
        <div className='col-md-9'>
          <div className='card-body h-100 d-flex flex-column flex-nowrap justify-content-between'>
            <div className='mb-3 d-flex justify-content-between'>
              <div>
                <h5 className='fw-bold mb-0'>{product.name}</h5>
                <div className='text-muted'>{product.category.name}</div>
                {product.amount > 0 ?
                  <span className='badge bg-success'
                        title={`Stan magazynowy: ${product.amount}`}>Dostępny</span> :
                  <span className='badge bg-danger'>Niedostępny</span>}
              </div>
              <div className='text-nowrap'>
                <span className='fw-500 mb-0 text-muted fs-5'>{formatCurrency(product.price)}</span>
                <span className='text-orange'> zł</span>
              </div>
            </div>
            <div className='d-flex flex-nowrap'>
              <div className='product-description flex-grow-1 flex-shrink-1'>{product.description}</div>
              <div className='ms-4 d-flex flex-column justify-content-end'>
                <button
                  className={`btn text-nowrap add-to-cart d-inline-flex flex-center ${product.amount > 0 ? 'btn-orange' : 'btn-light'}`}
                  onClick={() => addToCart(product.id)}
                  disabled={!isSignedIn() || product.amount === 0 || cartItems.includes(product.id)}
                  style={{ minWidth: '114px' }}>
                  {cartItems.includes(product.id) ? 'W koszyku' : 'Do koszyka'}
                </button>
                <ModalButton button={(onClick) =>
                  <button className='btn product-details btn-outline-orange mt-2'
                          onClick={onClick}>Szczegóły
                  </button>
                } alert={(show, hide) =>
                  <Modal onHide={hide} show={show} scrollable={true}>
                    <div className='modal-header'>
                      <img className='object-fit-contain'
                           src={`/storage/products/${product.image}`}
                           alt={product.name}
                           style={{ height: '36px' }}/>
                      <h5 className='modal-title mx-3'>{product.name}</h5>
                      <button className='btn-close' onClick={hide}/>
                    </div>
                    <div className='modal-body'>
                      <p style={{ whiteSpace: 'pre-wrap' }}>
                        {product.description}
                      </p>
                    </div>
                  </Modal>
                }/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage(){
  const initFilters: (searchParams?: URLSearchParams) => ProductFilters = (searchParams) => {
    const category: number[] = [];
    searchParams?.getAll('category[]').forEach((c) => {
      let categoryId = Number(c);
      if(!isNaN(categoryId)){
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
    if(filters.availability){
      searchParams.append('availability', filters.availability);
    }
    if(sort){
      searchParams.append('sort', sort);
    }
    if(sortDirection){
      searchParams.append('sort_dir', sortDirection);
    }
    searchParams.append('page', page.toString());
    navigation({ pathname: location.pathname, search: searchParams.toString() }, { replace: true });
    const response = await axios.get('/api/products', { params: searchParams });
    const { data, ...pagination } = response.data;
    setPagination(pagination);
    setProducts(data);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  const fetchCategories = async () => {
    const response = await axios.get('/api/categories');
    setCategories(response.data);
  }

  const location = useLocation();
  const searchParams = new URL(window.location.toString()).searchParams
  const navigation = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<Paginator>();
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
                                          paginator={pagination!}
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
