import React, {useContext} from 'react';
import styles from './Transaction.module.css';
import {FaPen, FaTrash} from 'react-icons/fa';
import Context from '../../store/context'

export function Transaction({
    showCorrectHeader, 
    id, 
    date,
    description, 
    headerId, 
    amount, 
    income,
    removeTransaction, 
    changeTransaction, 
    setModal,
    dispatchTransaction}) {

    const context = useContext(Context);

    function handleChangeHeader(e) {
        changeTransaction(id, date, description, e.target.value, amount);
    }

    function handleChangeTransaction(e) {
        dispatchTransaction({type: 'SET_ID', payload: id})
        dispatchTransaction({type: 'SET_DATE', payload: date})
        dispatchTransaction({type: 'SET_DESCRIPTION', payload: description})
        dispatchTransaction({type: 'SET_HEADER_ID', payload: headerId})
        dispatchTransaction({type: 'SET_AMOUNT', payload: amount})
        setModal(prev => 'EDIT_TRANSACTION');
    }

    function handleRemoveTransaction() {
        removeTransaction(id);
    }

    return(
            <tr className={styles.transaction}>
                <td className={styles['column-date']}>{date.substring(8,10) + '-' + date.substring(5, 7) + '-' + date.substring(0, 4)}</td>
                <td className={styles['column-description']}>{description}</td>
                <td className={styles['column-header']}><select value={Number(headerId)} onChange={handleChangeHeader}>
                                {context.headers.sort((a, b) => {
                                    if (showCorrectHeader(Number(a.id)) < showCorrectHeader(Number(b.id))) {
                                        return -1;
                                    }
                                    else {
                                        return 1;
                                    }
                                }).map((header, i) => {
                                    return <option key={i} value={header.id}>{showCorrectHeader(header.id)}</option>
                                })}
                            </select></td>
                 <td className={income ? styles['column-amount-in'] : styles['column-amount-out']}>&#8364; {Number(amount).toFixed(2)}</td>
                <td className={styles['column-pen-trash']}><FaPen className={styles['pen']} onClick={handleChangeTransaction}/><FaTrash className={styles['trash']} onClick={handleRemoveTransaction}/></td>
           </tr>
     );
}