import { ReactElement, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';

interface PromiseHandlerProps{
  promise: Promise<any> | undefined;
  onDone: () => ReactElement;
}

enum PromiseState{
  pending, settled, error
}

export default function PromiseHandler({ promise, onDone }: PromiseHandlerProps){
  const [promiseState, setPromiseState] = useState<PromiseState>(PromiseState.pending);

  useEffect(() => {
    setPromiseState(PromiseState.pending);
    if(promise){
      promise.then(() => setPromiseState(PromiseState.settled)).catch(() => setPromiseState(PromiseState.error));
    }
  }, [promise]);

  let element;

  switch(promiseState){
    case PromiseState.settled:
      element = onDone();
      break;
    case PromiseState.error:
      element = <span>Error</span>;
      break;
    default:
      element = <div className='w-100 h-100 flex-grow-1 d-flex flex-center'>
        <Spinner animation='grow' className='text-orange'/>
      </div>
  }

  return element
}
