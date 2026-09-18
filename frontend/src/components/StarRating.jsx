export default function StarRating({ value, onChange, readOnly }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <span className="star-rating">
      {stars.map((star) => (
        <span
          key={star}
          className={`star ${star <= value ? 'star-filled' : 'star-empty'}`}
          onClick={readOnly ? undefined : () => onChange(star)}
          style={{ cursor: readOnly ? 'default' : 'pointer' }}
        >
          ★
        </span>
      ))}
    </span>
  );
}
