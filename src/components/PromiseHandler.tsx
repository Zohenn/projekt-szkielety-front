import { ReactElement, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import ReactDOM from 'react-dom';

interface PromiseHandlerProps {
  promise: Promise<any> | undefined;
  onDone: () => ReactElement;
  onError?: (e: any) => ReactElement;
}

enum PromiseState {
  pending, settled, error
}

export default function PromiseHandler({ promise, onDone, onError }: PromiseHandlerProps) {
  const [promiseState, setPromiseState] = useState<PromiseState>(PromiseState.pending);
  const [error, setError] = useState();

  useEffect(() => {
    setPromiseState(PromiseState.pending);
    if (promise) {
      promise.then(() => setPromiseState(PromiseState.settled)).catch((e) => {
        ReactDOM.unstable_batchedUpdates(() => {
          setError(e);
          setPromiseState(PromiseState.error);
        })
      });
    }
  }, [promise]);

  let element: ReactElement;

  switch (promiseState) {
    case PromiseState.settled:
      element = onDone();
      break;
    case PromiseState.error:
      element = onError?.(error) ?? <span>W trakcie ładowania wystąpił błąd</span>;
      break;
    default:
      element = <div className='w-100 h-100 flex-grow-1 d-flex flex-center'>
        <Spinner animation='grow' className='text-orange'/>
      </div>
  }

  return element
}
