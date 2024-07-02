export function List({ items }) {
  return (
    <div>
      {items.map((item) => {
        return <div key={item}>{item}</div>;
      })}
    </div>
  );
}
