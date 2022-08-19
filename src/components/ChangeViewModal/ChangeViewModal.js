import React, {useState} from 'react';
import styles from './ChangeViewModal.module.css';

export function ChangeViewModal({
    lang,
    setModal,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    showEmpty,
    setShowEmpty,
    setErrorModal}) {

    const [localFromDate, setLocalFromDate] = useState(fromDate);
    const [localToDate, setLocalToDate] = useState(toDate);
    const [localShowEmpty, setLocalShowEmpty] = useState(showEmpty);

    function handleShowEmptyChange(e) {
        setLocalShowEmpty(e.target.value === 'true' ? false : true);

    }

    function handleApply() {
         if (localFromDate > localToDate) {
            setErrorModal({en: 'Start date cannot be after end date', nl: 'Begindatum kan niet na einddatum liggen'});
            return;
        }
        setFromDate(localFromDate);
        setToDate(localToDate);
        setShowEmpty(localShowEmpty);
        setModal(prev => 'OFF')
    }


    function handleCancel() {
        setModal(prev => 'OFF')
    }
    
    return(
        <div className={styles.backdrop}>
            <div className={styles['change-view-modal']}>
                <h2>{lang === 'en' ? 'Change view' : 'Wijzig weergave'}</h2>
                <div className={styles['input-fields']}>
                    <label htmlFor='from'>{lang === 'en' ? 'From' : 'Van'}:</label>
                    <input type='date' id='from' value={localFromDate} onChange={e => setLocalFromDate(e.target.value)}/>
                    <label htmlFor='to'>{lang === 'en' ? 'To' : 'Tot'}:</label>
                    <input type='date' id='to' value={localToDate} onChange={e => setLocalToDate(e.target.value)}/>
                    <br/>
                    <br/>
                    <input type='checkbox' id='empty' value={localShowEmpty} checked={localShowEmpty} onChange={handleShowEmptyChange}></input>
                    <label className={styles['label-empty']} htmlFor='empty'>{lang === 'en' ? 'Show empty headers' : 'Toon lege rubrieken'}</label>
                    <br/>
                    <br/>
               </div>
               <button onClick={handleApply}>{lang === 'en' ? 'Save' : 'Opslaan'}</button>
               <button onClick={handleCancel}>{lang === 'en' ? 'Cancel' : 'Annuleren'}</button>
            </div>
        </div>
    );
}
