import './RangePicker.css';

interface RangePickerProps {
  startFrom: number;
  upTo: number;
  value: number;
  measure: string;
  onChange: (value: number) => void;
}

const RangePicker = ({
  startFrom,
  upTo,
  value,
  measure,
  onChange
}: RangePickerProps) => {
    const percentage = ((value - startFrom) / (upTo - startFrom)) * 100;

  return (

    <div className="range-container">
      <div className="range-container__values">
        <span>{startFrom} {measure}</span>
        <span>{upTo} {measure}</span>
      </div>
      <input
        type="range"
        min={startFrom}
        max={upTo}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-container__input"
        style={{
          background: `linear-gradient(to right, var(--primary) ${percentage}%, var(--light-gray) ${percentage}%)`
        }}
      />
      <div className="range-container__values">
        <span id="time-value">{value} {measure}</span>
      </div>
    </div>
  );
};

export default RangePicker;