import React, {useContext} from 'react';
import {Transaction} from '../Transaction/Transaction';
import styles from './Transactions.module.css';
import Context from '../../store/context'

export function Transactions({
    showCorrectHeader, 
    removeTransaction,
    changeTransaction,
    maxItemsOnPage,
    setMaxItemsOnPage,
    setModal,
    dispatchTransaction,
    resetFilters}) {

    const context = useContext(Context);

    let itemsOnPage = 0;

    function handleAddTransaction() {
        setModal(prev => 'ADD_TRANSACTION');
    }

    function handleFilter() {
        setModal(prev => 'FILTER');
    }

    function handleReset() {
        resetFilters();
    }

    function showMoreItems() {
        setMaxItemsOnPage(prev => prev + 50);
    }

    return (
        <div className={styles.transactions}>
           <h2 className={styles.title}>{context.lang === 'en' ? 'Transactions' : 'Transacties'}</h2>
            <p className={styles.showing}>{context.lang === 'en' ? `Showing ${Math.min(maxItemsOnPage, context.transactions.length)} of ${context.transactions.length} transactions` : `${Math.min(maxItemsOnPage, context.transactions.length)} van ${context.transactions.length} transacties tonend`}</p>
            <div className={styles.buttons}>
                <button className={styles['button-add-transaction']} onClick={handleAddTransaction}>{context.lang === 'en' ? 'Add transaction' : 'Transactie toevoegen'}</button>
                <button className={styles['button-add-filters']} onClick={handleFilter}>{context.lang === 'en' ? 'Add filters' : 'Filters toevoegen'}</button>
                <button className={styles['button-reset-filters']} onClick={handleReset}>{context.lang === 'en' ? 'Reset filters' : 'Filters resetten'}</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th className={styles['column-date']}>{context.lang === 'en' ? 'Date' : 'Datum'}</th>
                        <th className={styles['column-description']}>{context.lang === 'en' ? 'Description' : 'Omschrijving' }</th>
                        <th className={styles['column-header']}>{context.lang === 'en' ? 'Header' : 'Rubriek'}</th>
                        <th className={styles['column-amount']}>{context.lang === 'en' ? 'Amount' : 'Bedrag'}</th>
                        <th className={styles['column-remove']}></th>
                    </tr>
               </thead>
                <tbody>
                     {context.transactions.map((transaction, i) => {
                        itemsOnPage++;
                        return itemsOnPage <= maxItemsOnPage && <Transaction
                        key={i}
                        showCorrectHeader={showCorrectHeader}
                        id={transaction.id}
                        date={transaction.date} 
                        description={transaction.description}
                        headerId={transaction.header.id}
                        amount={transaction.amount} 
                        income={transaction.header.income}
                        removeTransaction={removeTransaction} 
                        changeTransaction={changeTransaction} 
                        setModal={setModal}
                        dispatchTransaction={dispatchTransaction}/>
                    })}
                </tbody>
            </table>
                <button className={maxItemsOnPage < context.transactions.length ? styles['show-more-button-show'] : styles['show-more-button-hide']} onClick={showMoreItems}>{context.lang === 'en' ? 'Show more' : 'Toon meer'}</button>
        </div>
    );
}