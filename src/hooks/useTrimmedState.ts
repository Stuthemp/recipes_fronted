import { useState, useCallback } from 'react'

export function useTrimmedState(initialValue: string = '') {
    const [value, setValue] = useState(initialValue.trim());

    const setTrimmedValue = useCallback((newValue: string) => {
        setValue(newValue.trim());
    }, []);

    return [value, setTrimmedValue] as const;
}