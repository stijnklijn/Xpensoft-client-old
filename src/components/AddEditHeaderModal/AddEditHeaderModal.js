import React from 'react';
import styles from './AddEditHeaderModal.module.css';

export function AddEditHeaderModal({
    lang,
    addEdit,
    setModal,
    headers,
    id,
    name,
    income,
    dispatchHeader,
    addHeader,
    changeHeader,
    setErrorModal}) {

    function handleSave() {
        if (name.trim().length < 1 || name.trim().length > 50) {
            setErrorModal(prev => ({en: 'Name must be between 1 and 50 characters', nl: 'Naam moet tussen 1 en 50 karakters bevatten'}))
            return;
          }
          for (let header of headers) {
            if (header.name === name || name === 'Unallocated income' || name === 'Unallocated expenses'
                || name === 'Ongerubriceerde inkomsten' || name === 'Ongerubriceerde uitgaven') {
                setErrorModal(prev => ({en: 'Header already exists', nl: 'Rubriek bestaat al'}))
                return;
            }
        }
        if (addEdit === 'add' && income === undefined) {
            setErrorModal(prev => ({en: 'Select income or expenses', nl: 'Kies inkomsten of uitgaven'}))
            return;
        }

        if (addEdit === 'add') {
            addHeader(name, income);
            dispatchHeader({type: 'RESET'});
            setModal(prev => 'OFF');
        }
        else {
            changeHeader(id, name.trim(), income)
            setModal(prev => 'OFF');
        }
    }

    function handleCancel() {
        setModal(prev => 'OFF')
    }
    
    return(
        <div className={styles.backdrop}>
            <div className={styles['add-edit-header-modal']}>
                <h2>
                    {lang === 'en' && addEdit === 'add' && 'Add header'}
                    {lang === 'en' && addEdit === 'edit' && 'Edit header'}
                    {lang === 'nl' && addEdit === 'add' && 'Rubriek toevoegen'}
                    {lang === 'nl' && addEdit === 'edit' && 'Rubriek wijzigen'}
                </h2>
                <div className={styles['input-fields']}>
                    <label htmlFor='new-name'>{lang === 'en' ? 'Name:' : 'Naam'}</label>
                    <input type='text' id='new-name' value={name} onChange={e => dispatchHeader({type: 'SET_NAME', payload: e.target.value})}/>
                    <br/>
                    {addEdit === 'edit' && <br/>}
                    {addEdit === 'edit' && <br/>}

                    {addEdit === 'add' && <input type='radio' name='type' id='new-income' checked={income === true} onChange={e => dispatchHeader({type: 'SET_INCOME', payload: e.target.checked})}/>}
                    {addEdit === 'add' && <label htmlFor='new-income' name='type'>{lang === 'en' ? 'Income' : 'Inkomsten'}</label>}
                    {addEdit === 'add' && <input type='radio' name='type' id='new-expenses' checked={income === false} onChange={e => dispatchHeader({type: 'SET_INCOME', payload: !e.target.checked})}/>}
                    {addEdit === 'add' && <label htmlFor='new-expenses' name='type'>{lang === 'en' ? 'Expenses' : 'Expenses'}</label>}
                </div>
                 <br/>
                <button onClick={handleSave}>{lang === 'en' ? 'Save' : 'Opslaan'}</button>
                <button onClick={handleCancel}>{lang === 'en' ? 'Cancel' : 'Annuleren'}</button>
            </div>
        </div>
    );
}
