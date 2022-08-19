import React from 'react';
import styles from './AddEditTransactionModal.module.css';

export function AddEditTransactionModal({
    lang,
    addEdit,
    setModal,
    id,
    date,
    description,
    headerId,
    amount,
    dispatchTransaction,
    headers,
    showCorrectHeader,
    addTransaction,
    changeTransaction,
    setErrorModal
}) {

    function handleSave() {
        if (!date) {
            setErrorModal({en: 'Select a date', nl: 'Selecteer een datum'})
            return;
        }
        if (description.trim().length < 1 || description.trim().length > 100) {
            setErrorModal({en: 'Description must be between 1 and 100 characters', nl: 'Omschrijving moet tussen 1 en 100 karakters zijn'})
            return;
        }
        if (!headerId) {
            setErrorModal({en: 'Select a header', nl: 'Selecteer een rubriek'})
            return;
        }
        amount = parseFloat(amount.toString().replace(',', '.'));
        if (isNaN(amount) || amount < 0.01 || amount > 999999.99) {
            setErrorModal({en: 'Amount must be between 0.01 and 999999.99', nl: 'Bedrag moet tussen 0.01 en 999999.99 zijn'})
            return;
        }

        if (addEdit === 'add') {
            addTransaction(date, description.trim(), headerId, amount);
        }
        else {
            changeTransaction(id, date, description.trim(), headerId, amount)
        }
        setModal(prev => 'OFF')
    }

    function handleCancel() {
        setModal(prev => 'OFF')
    }
    
    return(
        <div className={styles.backdrop}>
            <div className={styles['add-edit-transaction-modal']}>
                <h2>
                    {lang === 'en' && addEdit === 'add' && 'Add transaction'}
                    {lang === 'en' && addEdit === 'edit' && 'Edit transaction'}
                    {lang === 'nl' && addEdit === 'add' && 'Transactie toevoegen'}
                    {lang === 'nl' && addEdit === 'edit' && 'Transactie wijzigen'}
                </h2>
                <div className={styles['input-fields']}>
                    <label htmlFor='new-date'>{lang === 'en' ? 'Date:' : 'Datum:'}</label>
                    <input type='date' id='new-date' value={date} onChange={e => dispatchTransaction({type: 'SET_DATE', payload: e.target.value})}/>
                    <label htmlFor='new-description'>{lang === 'en' ? 'Description:' : 'Omschrijving:'}</label>
                    <input type='text' id='new-description' value={description} onChange={e => dispatchTransaction({type: 'SET_DESCRIPTION', payload: e.target.value})}/>
                    <label htmlFor='new-header'>{lang === 'en' ? 'Header:' : 'Rubriek:'}</label>
                    <select id='new-header' value={Number(headerId)} onChange={e => dispatchTransaction({type: 'SET_HEADER_ID', payload: e.target.value})}>
                        <option key='-1'></option>
                        {headers.sort((a, b) => {
                            if (showCorrectHeader(Number(a.id)) < showCorrectHeader(Number(b.id))) {
                                return -1;
                            }
                            else {
                                return 1;
                            }
                        }).map((header, i) => {
                            return <option key={i} value={header.id}>{showCorrectHeader(header.id)}</option>
                        })}
                    </select>
                     <label htmlFor='new-amount'>{lang === 'en' ? 'Amount:' : 'Bedrag:'}</label>
                    <input type='text' id='new-amount' value={amount} onChange={e => dispatchTransaction({type: 'SET_AMOUNT', payload: e.target.value})}/>
                </div>
                <button className={styles['button-save']}onClick={handleSave}>{lang === 'en' ? 'Save' : 'Opslaan'}</button>
                <button className={styles['button-cancel']}onClick={handleCancel}>{lang === 'en' ? 'Cancel' : 'Annuleren'}</button>
            </div>
        </div>
    );
}
