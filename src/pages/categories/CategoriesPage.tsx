import './CategoriesPage.scss';
import CategoryForm from './CategoryForm';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PromiseHandler from '../../components/PromiseHandler';
import { Modal, OverlayTrigger, Toast, Tooltip } from 'react-bootstrap';
import ModalButton from '../../components/ModalButton';
import { Formik, Form } from 'formik';
import { Variant } from 'react-bootstrap/types';

interface ToastItem {
  id: number;
  message: string;
  bg: Variant;
  show: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesPromise, setCategoriesPromise] = useState<Promise<void>>();
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const fetchCategories = async () => {
    const response = await axios.get<Category[]>('/api/categories?with_exists=true');
    setCategories(response.data);
  }

  useEffect(() => {
    setCategoriesPromise(fetchCategories());
  }, []);

  return (
    <div className='row gy-3'>
      <div className='col-12 col-sm-5 col-lg-3'>
        <h4 className='orange-underline'>Nowa kategoria</h4>
        <div className='card bg-light'>
          <div className='card-body'>
            <CategoryForm onSubmit={(category) => setCategories([...categories, category])}/>
          </div>
        </div>
      </div>
      <div className='col-12 col-sm-7 col-lg-9'>
        <PromiseHandler promise={categoriesPromise} onDone={() =>
          <div className='table-responsive'>
            <table className='table text-nowrap' style={{ verticalAlign: 'middle' }}>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Nazwa</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) =>
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td style={{ width: '98%' }}>{category.name}</td>
                    <td className='text-nowrap'>
                      <button className='btn btn-icon edit-category'>
                        <span className='material-icons text-orange'>edit</span>
                      </button>
                      {category.products_exists ?
                        <OverlayTrigger placement='bottom' overlay={
                          <Tooltip>Kategoria musi być pusta, aby móc ją usunąć.</Tooltip>
                        }>
                          <span className='d-inline-block'>
                            <button className='btn btn-icon delete-category' disabled>
                              <span className='material-icons text-danger'>delete</span>
                            </button>
                          </span>
                        </OverlayTrigger> :
                        <ModalButton
                          button={(onClick) =>
                            <button className='btn btn-icon delete-category' onClick={onClick}>
                              <span className='material-icons text-danger'>delete</span>
                            </button>
                          } modal={(show, hide) =>
                          <Modal onHide={hide} show={show} scrollable={true} centered={true}>
                            <div className='modal-content'>
                              <div className='modal-header border-bottom-0'>
                                <h5 className='modal-title'>Usunąć kategorię?</h5>
                                <button className='btn-close' onClick={hide}/>
                              </div>
                              <div className='modal-body'>
                                <div id='category-delete-name'>{category.name}</div>
                                <div className='text-end mt-3'>
                                  <button className='btn btn-outline-orange me-1' onClick={hide}>Anuluj</button>
                                  <Formik initialValues={{}} onSubmit={(values, { setSubmitting }) => {
                                    axios.delete(`/api/categories/${category.id}`)
                                      .then(() => {
                                        setCategories(categories.filter((c) => c.id !== category.id));
                                        setToasts([
                                          ...toasts,
                                          {
                                            id: Date.now(),
                                            bg: 'success',
                                            message: `Usunięto kategorię ${category.name}`,
                                            show: true,
                                          }
                                        ]);
                                      })
                                      .catch((e) => setToasts([
                                        ...toasts,
                                        {
                                          id: Date.now(),
                                          bg: 'danger',
                                          message: e.response.data.message,
                                          show: true,
                                        }
                                      ]))
                                      .finally(() => setSubmitting(false))
                                  }}>
                                    {({ isSubmitting }) =>
                                      <Form className='d-inline-block'>
                                        <button className='btn btn-danger'
                                                type='submit'
                                                disabled={isSubmitting}>Usuń
                                        </button>
                                      </Form>
                                    }
                                  </Formik>
                                </div>
                              </div>
                            </div>
                          </Modal>
                        }/>
                      }
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        }/>
      </div>
      <div className='position-fixed bottom-0 end-0 p-3' style={{ zIndex: 11 }}>
        {toasts.map((toast) =>
          <Toast key={toast.id}
                 autohide={true}
                 bg={toast.bg}
                 className='align-items-center text-white border-0'
                 delay={3000}
                 onClose={() => {
                   const _toasts = [...toasts];
                   _toasts.find((_toast) => _toast.id === toast.id)!.show = false;
                   setToasts(_toasts);
                 }}
                 show={toast.show}>
            <div className='d-flex'>
              <div className='toast-body'>{toast.message}</div>
              <button type='button'
                      className='btn-close btn-close-white me-2 m-auto'
                      data-bs-dismiss='toast'
                      aria-label='Close'/>
            </div>
          </Toast>
        )}
      </div>
    </div>
  )
}
