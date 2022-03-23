import { FormEvent, useState } from 'react';
import zestaw1 from '../../assets/zestaw1.jpg';
import zestaw2 from '../../assets/zestaw2.jpg';
import zestaw3 from '../../assets/zestaw3.jpg';
import { Helmet } from 'react-helmet-async';
import { useAuthStore } from '../../store/authStore';
import { AdminHomePage } from './AdminHomePage';

interface AvailabilityMessage {
  key: number;
  text: string;
  response?: string;
}

function AvailabilityChat() {
  const [text, setText] = useState<string>('');
  const [messages, setMessages] = useState<AvailabilityMessage[]>([]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const _text = text.trim();
    if (_text) {
      setText('');
      const message: AvailabilityMessage = {
        key: Date.now(),
        text: _text
      }
      setMessages([...messages, message]);
      new Promise<void>(resolve => {
        setTimeout(() => {
          resolve();
        }, Math.random() * 3000 + 2000);
      }).then(async () => {
        try{
          const rawResponse = await fetch('https://yesno.wtf/api');
          const response = await rawResponse.json();
          message.response = response.answer === 'yes' ? 'Tak, ten produkt jest dostępny :)' : 'Niestety, aktualnie ten produkt nie jest dostępny :(';
        } catch {
          message.response = 'Bład połączenia z serwerem, spróbuj ponownie.';
        }
        setMessages([...messages, message]);
      });
    }
  }

  return (
    <div className='d-flex flex-column mx-auto' style={{ maxWidth: '500px' }}>
      <div id='availability-chat'
           className='d-flex flex-column bg-light rounded-top border border-bottom-0 w-100 p-2 pb-0 overflow-auto'
           style={{ height: '300px' }}>
        {messages.map((message) =>
          <div key={message.key} className='d-flex flex-column'>
            <div className='px-2 py-1 ms-auto bg-white rounded border mb-2'
                 style={{ maxWidth: '75%' }}>{message.text}</div>
            <div className='d-flex align-items-center px-2 py-1 me-auto bg-white rounded border mb-2'
                 style={{ maxWidth: '75%' }}>
              {message.response || <><span>Oczekiwanie na asystenta</span><span className='waiting-dot'/></>}
            </div>
          </div>
        )}
      </div>
      <form id='question-form' onSubmit={onSubmit}>
        <label htmlFor='question-input' className='d-block'>
          <input type='text'
                 id='question-input'
                 placeholder='Czy zestaw 1 jest dostępny?'
                 className='form-control mt-auto'
                 onChange={(e) => setText(e.target.value)}
                 value={text}
                 style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}/>
        </label>
      </form>
    </div>
  )
}

function BuildsCarousel() {
  return (
    <div id='builds-carousel' className='carousel slide mb-3' data-bs-ride='carousel'>
      <div className='carousel-inner' style={{ height: '300px' }}>
        <div className='carousel-item active h-100'>
          <img src={zestaw1} className='d-block h-100 w-100 object-fit-contain'
               alt='Zestaw 1'/>
        </div>
        <div className='carousel-item h-100'>
          <img src={zestaw2} className='d-block h-100 w-100 object-fit-contain'
               alt='Zestaw 2'/>
        </div>
        <div className='carousel-item h-100'>
          <img src={zestaw3} className='d-block h-100 w-100 object-fit-contain'
               alt='Zestaw 3'/>
        </div>
      </div>
      <button className='carousel-control-prev text-orange'
              type='button'
              data-bs-target='#builds-carousel'
              data-bs-slide='prev'>
        <span className='material-icons' style={{ fontSize: '48px' }}>navigate_before</span>
      </button>
      <button className='carousel-control-next text-orange'
              type='button'
              data-bs-target='#builds-carousel'
              data-bs-slide='next'>
        <span className='material-icons' style={{ fontSize: '48px' }}>navigate_next</span>
      </button>
      <div className='position-relative'>
        <div className='carousel-indicators mb-0 mt-3' style={{ position: 'initial' }}>
          <button type='button' data-bs-target='#builds-carousel' data-bs-slide-to='0' className='active bg-orange'/>
          <button type='button' data-bs-target='#builds-carousel' data-bs-slide-to='1' className=' bg-orange'/>
          <button type='button' data-bs-target='#builds-carousel' data-bs-slide-to='2' className=' bg-orange'/>
        </div>
      </div>
    </div>
  )
}

function ReviewsCarousel() {
  return (
    <div id='reviews-carousel' className='carousel slide mb-3' data-bs-ride='carousel'>
      <div className='carousel-inner' style={{ height: '160px' }}>
        <div className='carousel-item active h-100'>
          <div className='d-flex flex-column h-100 justify-content-center align-items-center px-2 py-5'>
            <p className='mb-2'>Szybko i profesjonalnie</p>
            <div>
              <span className='material-icons text-orange'>star_rate</span>
              <span className='material-icons text-orange'>star_rate</span>
              <span className='material-icons text-orange'>star_rate</span>
              <span className='material-icons text-orange'>star_rate</span>
              <span className='material-icons text-orange'>star_rate</span>
            </div>
          </div>
        </div>
        <div className='carousel-item h-100'>
          <div className='d-flex flex-column h-100 justify-content-center align-items-center px-2 py-5'>
            <p className='mb-2'>Najlepszy możliwy wybór :)</p>
            <div>
              <span className='material-icons text-orange'>star_rate</span>
              <span className='material-icons text-orange'>star_rate</span>
              <span className='material-icons text-orange'>star_rate</span>
              <span className='material-icons text-orange'>star_rate</span>
              <span className='material-icons text-orange'>star_rate</span>
            </div>
          </div>
        </div>
        <div className='carousel-item h-100'>
          <div className='d-flex flex-column h-100 justify-content-center align-items-center px-2 py-5'>
            <p className='mb-2'>Satysfakcja gwarantowana!</p>
            <div>
              <span className='material-icons text-orange'>star_rate</span>
              <span className='material-icons text-orange'>star_rate</span>
              <span className='material-icons text-orange'>star_rate</span>
              <span className='material-icons text-orange'>star_rate</span>
              <span className='material-icons text-orange'>star_rate</span>
            </div>
          </div>
        </div>
      </div>
      <button className='carousel-control-prev text-orange'
              type='button'
              data-bs-target='#reviews-carousel'
              data-bs-slide='prev'>
        <span className='material-icons' style={{ fontSize: '48px' }}>navigate_before</span>
      </button>
      <button className='carousel-control-next text-orange'
              type='button'
              data-bs-target='#reviews-carousel'
              data-bs-slide='next'>
        <span className='material-icons' style={{ fontSize: '48px' }}>navigate_next</span>
      </button>
      <div className='carousel-indicators mb-0 mt-3'>
        <button type='button' data-bs-target='#reviews-carousel' data-bs-slide-to='0' className='active bg-orange'/>
        <button type='button' data-bs-target='#reviews-carousel' data-bs-slide-to='1' className='bg-orange'/>
        <button type='button' data-bs-target='#reviews-carousel' data-bs-slide-to='2' className='bg-orange'/>
      </div>
    </div>
  )
}

export default function HomePage() {
  const isAdmin = useAuthStore(state => state.user)?.admin;

  return (
    <div className='pb-4'>
      <Helmet>
        <title>Strona główna</title>
      </Helmet>
      {
        isAdmin ?
          <AdminHomePage/> :
          <>
            <h4 className='orange-underline text-center mb-4'>O firmie</h4>
            <div className='text-center mb-3'>Nasza firma zajmuje się sprzedażą gotowych zestawów komputerowych,
              tworzeniem
              jednostek
              pod wymagania klientów oraz ich serwisem.
            </div>
            <hr className='mx-auto main-page-divider'/>
            <h4 className='orange-underline mb-5 text-center'>Nasze zestawy</h4>
            <BuildsCarousel/>
            <hr className='mx-auto main-page-divider'/>
            <h4 className='orange-underline mb-0 text-center'>Opinie o nas</h4>
            <ReviewsCarousel/>
            <hr className='mx-auto main-page-divider'/>
            <h4 className='orange-underline text-center mb-4'>Zapytaj o dostępność</h4>
            <AvailabilityChat/>
          </>
      }
    </div>
  )
}
