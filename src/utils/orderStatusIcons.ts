interface OrderStatusIcon {
  icon: string;
  color: string;
  button: string;
}

export const orderStatusIcons: { [k: string]: OrderStatusIcon } = {
  '1': {
    icon: 'settings',
    color: 'text-secondary',
    button: 'btn-outline-secondary'
  },
  '2': {
    icon: 'local_shipping',
    color: 'text-primary',
    button: 'btn-outline-primary'
  },
  '3': {
    icon: 'done',
    color: 'text-success',
    button: 'btn-outline-success'
  }
}
