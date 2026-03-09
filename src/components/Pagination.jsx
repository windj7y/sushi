import { Link } from "react-router";

const Pagination = ({ pagination, getData, path, category = '' }) => {
  const { total_pages, current_page, has_pre, has_next } = pagination;

  const handlePageChange = (page) => {
    getData(page, category);
  }

  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination justify-content-end">
        <li className={`page-item ${has_pre ? '' : 'disabled'}`}>
          <Link className="page-link" to={path} onClick={has_pre ? () => handlePageChange(current_page - 1) : undefined}>
            <span aria-hidden="true">&laquo;</span>
          </Link>
        </li>
        {
          [...Array(total_pages).keys().map((page) => (
            <li className="page-item" key={page}>
              <Link className={`page-link ${current_page === (page + 1) ? 'active' : ''}`} to={path} onClick={() => handlePageChange(page + 1)}>
                {page + 1}
              </Link>
            </li>
          ))]
        }
        <li className={`page-item ${has_next ? '' : 'disabled'}`}>
          <Link className="page-link" to={path} onClick={has_next ? () => handlePageChange(current_page + 1) : undefined}>
            <span aria-hidden="true">&raquo;</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;