import React from 'react';
import styles from './ErrorModal.module.css';

export function ErrorModal({lang, errorModal, setErrorModal}) {

    function handleClick() {
        setErrorModal(prev => '');
    }

    return(
        <div className={styles.backdrop}>
            <div className={styles['error-modal']}>
                <h2>{lang === 'en' ? 'Error' : 'Fout'}</h2>
                <p>{lang === 'en' ? errorModal.en : errorModal.nl}</p>
                <button className={styles['button-clear-error']} onClick={handleClick}>OK</button>
            </div>
        </div>
    );
}