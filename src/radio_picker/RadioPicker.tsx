// RadioPicker.tsx
import './RadioPicker.css';

type RadioValue = 'positive' | 'negative' | 'neutral';

interface RadioPickerProps {
    optionPositive: string;
    optionNegative: string;
    optionNeutral?: string;
    name: string;
    value: RadioValue; // current selection
    onChange: (value: RadioValue) => void; // handler to update parent state
}

const RadioPicker = ({
    optionPositive,
    optionNegative,
    optionNeutral,
    name,
    value,
    onChange
}: RadioPickerProps) => {
    return (
        <div className="radio-group">
            <div className="radio-option">
                <input
                    type="radio"
                    id={`${name}-positive`}
                    name={name}
                    checked={value === 'positive'}
                    onChange={() => onChange('positive')}
                />
                <label htmlFor={`${name}-positive`}>{optionPositive}</label>
            </div>
            <div className="radio-option">
                <input
                    type="radio"
                    id={`${name}-negative`}
                    name={name}
                    checked={value === 'negative'}
                    onChange={() => onChange('negative')}
                />
                <label htmlFor={`${name}-negative`}>{optionNegative}</label>
            </div>
            {optionNeutral && (
                <div className="radio-option">
                    <input
                        type="radio"
                        id={`${name}-neutral`}
                        name={name}
                        checked={value === 'neutral'}
                        onChange={() => onChange('neutral')}
                    />
                    <label htmlFor={`${name}-neutral`}>{optionNeutral}</label>
                </div>
            )}
        </div>
    );
};

export default RadioPicker;