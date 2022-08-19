import React from 'react';
import styles from './ImportModal.module.css';

export function ImportModal({
    lang,
    inputField,
    importTransactions,
    setModal}) {

    function handleImport() {
        importTransactions();
        setModal(prev => 'OFF')
    }
 
    function handleCancel() {
        setModal(prev => 'OFF')
    }
    
    return(
        <div className={styles.backdrop}>
            <div className={styles['import-modal']}>
                <h2>{lang === 'en' ? 'Import transactions' : 'Transacties importeren'}</h2>
                <input className={styles['input-field']} type='file' id='import' ref={inputField} />
                <br/>
                <button className={styles['button-import']} onClick={handleImport}>{lang === 'en' ? 'Import' : 'Importeer'}</button>
                <button className={styles['button-cancel']} onClick={handleCancel}>{lang === 'en' ? 'Cancel' : 'Annuleren'}</button>
            </div>
        </div>
    );
}
