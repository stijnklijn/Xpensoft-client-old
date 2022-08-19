import {useState} from 'react';

export function useValidation(updateFieldFn, isValidCheck) {

    const [fieldIsValid, setFieldIsValid] = useState(false);
    const [fieldIsTouched, setFieldIsTouched] = useState(false);

    function handleFieldChange (value) {
        updateFieldFn(value);
        if (isValidCheck(value)) {
            setFieldIsValid(true);
        }
        else {
            setFieldIsValid(false);
        }
    }

    function handleFieldBlur () {
        setFieldIsTouched(true);
    }

    const fieldHighlight = fieldIsTouched && !fieldIsValid;

    return [handleFieldChange, handleFieldBlur, fieldIsValid, fieldHighlight]
    

}
