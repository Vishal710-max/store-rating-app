export default function SortableHeader({ label, field, sortBy, sortDir, onSort }) {
  const isActive = sortBy === field;
  const arrow = isActive ? (sortDir === 'ASC' ? '▲' : '▼') : '';

  return (
    <th onClick={() => onSort(field)} className="sortable-header">
      {label} {arrow}
    </th>
  );
}
