import React from 'react';
import styles from './Header.module.css';
import {FaPen, FaTrash} from 'react-icons/fa';

export function Header({
    headerId,
    amount,
    showCorrectHeader,
    total,
    inout,
    removeHeader,
    setModal,
    dispatchHeader}) {

    const isDefaultHeader = showCorrectHeader(headerId) === 'Unallocated income' || showCorrectHeader(headerId) === 'Unallocated expenses'
        ||showCorrectHeader(headerId) === 'Ongerubriceerde inkomsten' || showCorrectHeader(headerId) === 'Ongerubriceerde uitgaven';

    function handleRemoveHeader(e) {
        removeHeader(headerId);
    }

    function handleChangeHeader(e) {
        dispatchHeader({type: 'SET_ID', payload: headerId})
        dispatchHeader({type: 'SET_NAME', payload: showCorrectHeader(headerId)})
        dispatchHeader({type: 'SET_INCOME', payload: inout === 'in'? true : false})
        setModal(prev => 'EDIT_HEADER');
    }
 
     return(
        <tr className={styles.header}>
            <td className={styles['column-header']}>{showCorrectHeader(headerId)}</td>
            <td className={styles['column-amount-' + inout]}>&#8364; {amount.toFixed(2)}</td>
            <td className={styles['column-percentage']}>{total > 0 ? (amount / total * 100).toFixed(0) : 0}</td>
            <td className={styles['column-pen-trash']}>{!isDefaultHeader && <FaPen className={styles['pen']} onClick={handleChangeHeader}/>}{!isDefaultHeader && <FaTrash className={styles['trash']} onClick={handleRemoveHeader}/>}</td>
         </tr>
      );
}