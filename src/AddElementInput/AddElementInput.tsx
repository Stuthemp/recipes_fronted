import './AddElementInput.css'
import React, { useState, useRef, useEffect } from 'react';

interface AddElementInputProps {
    hint: string;
    onTagsChange?: (tags: string[]) => void;
    suggestions?: string[];
}

const AddElementInput = ({
    hint,
    onTagsChange,
    suggestions = [],
}: AddElementInputProps) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [tags, setTags] = useState<string[]>([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputValue.trim() === '') {
            setFilteredSuggestions([]);
            return;
        }

        const matches = suggestions.filter(
            (suggestion) =>
                suggestion.toLowerCase().startsWith(inputValue.toLowerCase()) &&
                !tags.includes(suggestion)
        );
        setFilteredSuggestions(matches);
    }, [inputValue, tags, suggestions]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (newTag && !tags.includes(newTag)) {
                const updatedTags = [...tags, newTag];
                setTags(updatedTags);
                setInputValue('');
                onTagsChange?.(updatedTags);
            }
        }
    };

    const removeTag = (tagToRemove: string) => {
        const updatedTags = tags.filter(tag => tag !== tagToRemove);
        setTags(updatedTags);
        onTagsChange?.(updatedTags);
    };

    const handleSuggestionClick = (suggestion: string) => {
        const updatedTags = [...tags, suggestion];
        setTags(updatedTags);
        setInputValue('');
        onTagsChange?.(updatedTags);
        setFilteredSuggestions([]);
        inputRef.current?.focus(); // Keep focus on input
    };

    return (
        <div className="add-elements-container">
            <input
                type="text"
                className="add-elements-container__input"
                placeholder={hint}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-autocomplete="list"
                aria-expanded={filteredSuggestions.length > 0}
            />
            {filteredSuggestions.length > 0 && (
                <ul className="add-elements-container__suggestions">
                    {filteredSuggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className="add-elements-container__suggestion-item"
                            onClick={() => handleSuggestionClick(suggestion)}
                            role="option"
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
            <div className="add-elements-container__tags">
                {tags.map((tag, index) => (
                    <span key={index} className="add-elements-container__tag">
                        {tag}
                        <button
                            type="button"
                            className="add-elements-container__tag-remove"
                            onClick={() => removeTag(tag)}
                            aria-label={`Remove ${tag}`}
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
        </div>
    )
};

export default AddElementInput;