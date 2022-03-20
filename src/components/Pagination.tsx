interface PaginationProps{
  what: string;
  paginator: Paginator;
  onPageChanged: (page: number) => void;
}

export default function Pagination({ what, paginator, onPageChanged }: PaginationProps){
  const onFirstPage = paginator.current_page <= 1;
  const hasMorePages = paginator.current_page < paginator.last_page;
  const links = paginator.links.slice(1, -1);

  return (
    <nav className='d-flex align-items-center fw-normal'>
      <span>{what}: {paginator.total}, na stronie: {paginator.per_page}</span>
      <ul className='flex-grow-1 pagination mb-0 justify-content-end'>
        {
          onFirstPage ?
            <li className='page-item disabled' aria-disabled='true' aria-label='Poprzedni'>
              <span className='page-link' aria-hidden='true'>&lsaquo;</span>
            </li> :
            <li className='page-item'>
              <a className='page-link'
                 href={paginator.prev_page_url ?? undefined}
                 onClick={(e) => {
                   e.preventDefault();
                   onPageChanged(paginator.current_page - 1);
                 }}
                 rel='prev'
                 aria-label='Poprzedni'>&lsaquo;</a>
            </li>
        }

        {
          links.map((element) => {
            if(!element.url){
              return <li className='page-item disabled' key={element.label} aria-disabled='true'>
                <span className='page-link'>{element.label}</span>
              </li>
            }
            const searchParams = new URL(element.url).searchParams;
            const page = Number(searchParams.get('page'));
            if(page === paginator.current_page){
              return <li className='page-item active' key={element.label} aria-current='page'>
                <span className='page-link'>{element.label}</span>
              </li>
            }
            return <li className='page-item' key={element.label}>
              <a className='page-link' href={element.url} onClick={(e) => {
                e.preventDefault();
                onPageChanged(page);
              }}>{element.label}</a>
            </li>;
          })
        }

        {
          hasMorePages ?
            <li className='page-item'>
              <a className='page-link'
                 href={paginator.next_page_url ?? undefined}
                 onClick={(e) => {
                   e.preventDefault();
                   onPageChanged(paginator.current_page + 1);
                 }}
                 rel='next'
                 aria-label='Następny'>&rsaquo;</a>
            </li> :
            <li className='page-item disabled' aria-disabled='true' aria-label='Następny'>
              <span className='page-link' aria-hidden='true'>&rsaquo;</span>
            </li>
        }
      </ul>
    </nav>
  )
}
