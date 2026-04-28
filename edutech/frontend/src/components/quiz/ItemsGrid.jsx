export function ItemsGrid({ items, renderItem }) {
  return (
    <div className="space-y-6 mt-10">
      {items.map((item) => (
        <div id={item.id} key={item.id} className="scroll-mt-24">
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}