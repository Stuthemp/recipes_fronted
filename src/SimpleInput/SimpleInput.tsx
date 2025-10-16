// SimpleInput.tsx
import './SimpleInput.css';

interface SimpleInputProps {
  hint: string;
  value: string;           // ← current value (controlled by parent)
  onValueChange: (value: string) => void; // ← handler to update parent
}

const SimpleInput = ({
  hint,
  value,
  onValueChange
}: SimpleInputProps) => {
  return (
    <div className="add-elements-container">
      <input
        type="text"
        className="add-elements-container__input"
        placeholder={hint}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
      />
    </div>
  );
};

export default SimpleInput;