import { ReactElement, useState } from 'react';

interface ModalButtonProps{
  button: (onClick: VoidFunction) => ReactElement;
  modal: (show: boolean, hide: VoidFunction) => ReactElement;
}

export default function ModalButton({ button, modal }: ModalButtonProps){
  const [show, setShow] = useState<boolean>(false);
  return (
    <>
      {button(() => setShow(true))}
      {modal(show, () => setShow(false))}
    </>
  );
}
