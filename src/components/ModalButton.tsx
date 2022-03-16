import { ReactElement, useState } from 'react';

interface ModalButtonProps{
  button: (onClick: VoidFunction) => ReactElement;
  alert: (show: boolean, hide: VoidFunction) => ReactElement;
}

export default function ModalButton({ button, alert }: ModalButtonProps){
  const [show, setShow] = useState<boolean>(false);
  return (
    <>
      {button(() => setShow(true))}
      {alert(show, () => setShow(false))}
    </>
  );
}
