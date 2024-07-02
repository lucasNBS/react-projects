export function Pagination({ goToPreviousPage, goToNextPage }) {
  return (
    <div>
      {goToPreviousPage && <button onClick={goToPreviousPage}>Previous</button>}
      {goToNextPage && <button onClick={goToNextPage}>Next</button>}
    </div>
  );
}
