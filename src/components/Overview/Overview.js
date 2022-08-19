import React, {useContext} from 'react';
import {HeaderTable} from '../HeaderTable/HeaderTable';
import {BarChart} from '../BarChart/BarChart';
import {PieChart} from '../PieChart/PieChart';
import {FaChartBar, FaChartPie} from 'react-icons/fa';
import styles from './Overview.module.css';
import Context from '../../store/context';

export function Overview({
    showCorrectHeader, 
    fromDate, 
    toDate, 
    addHeader, 
    removeHeader, 
    changeHeader,
    showEmpty, 
    setModal,
    dispatchHeader}) {

    const context = useContext(Context);

    function changeView() {
        setModal(prev => 'CHANGE_VIEW')
    }

    function handleAddHeader() {
        setModal(prev => 'ADD_HEADER');

    }

    function calculateTotalIncome() {
        return context.transactions
        .filter(transaction => transaction.date >= fromDate && transaction.date <= toDate)
        .filter(transaction => transaction.header.income)
        .reduce((a, b) => a + Number(b.amount), 0);
    }

    function calculateTotalExpenses() {
        return context.transactions
        .filter(transaction => transaction.date >= fromDate && transaction.date <= toDate)
        .filter(transaction => !transaction.header.income)
        .reduce((a, b) => a + Number(b.amount), 0);
    }

    //Calculates the total income and the income for each header separately, in the selected time period
    function calculateIncomePerHeader() {

        const incomeHeaders = {};
        for (let header of context.headers) {
            if (header.income) {
                incomeHeaders[header.id] = 0;
            }
        }

        //Filter transactions in selected time period
        let array = context.transactions.filter(transaction => transaction.date >= fromDate && transaction.date <= toDate);
        if (!array.length) return [incomeHeaders, 0];

        //For each transaction, check if header is in income headers. If so, update the amount for that header and the total amount
        for (let transaction of array) {
            if (transaction.header.id in incomeHeaders) {
                incomeHeaders[transaction.header.id] += Number(transaction.amount);
            }
         }
        return [incomeHeaders, calculateTotalIncome()];
    }

    //Calculates the total income and the income for each header separately, in the selected time period
    function calculateExpensesPerHeader() {

        const expenseHeaders = {};
        for (let header of context.headers) {
            if (!header.income) {
                expenseHeaders[header.id] = 0;
            }
        }

        //Filter transactions in selected time period
        let array = context.transactions.filter(transaction => transaction.date >= fromDate && transaction.date <= toDate);
        if (!array.length) return [expenseHeaders, 0];

        //For each transaction, check if header is in income headers. If so, update the amount for that header and the total amount
        for (let transaction of array) {
            if (transaction.header.id in expenseHeaders) {
                expenseHeaders[transaction.header.id] += Number(transaction.amount);
            }
         }
         return [expenseHeaders, calculateTotalExpenses()];
    }

    return (
        <div className={styles.overview}>
            <h2 className={styles.title}>{context.lang === 'en' ? 'Overview' : 'Overzicht'}</h2>
            <div className={styles.buttons}>
                <button className={styles['button-add-header']} onClick={handleAddHeader}>{context.lang === 'en' ? 'Add header' : 'Rubriek toevoegen'}</button>
                <button className={styles['button-change-view']} onClick={changeView}>{context.lang === 'en' ? 'Change view' : 'Wijzig weergave'}</button>
            </div>
            <br/>
            <hr/>
            <h2 className={styles['period']}>{fromDate.substring(8,10) + '-' + fromDate.substring(5, 7) + '-' + fromDate.substring(0, 4)}{' - '}
            {toDate.substring(8,10) + '-' + toDate.substring(5, 7) + '-' + toDate.substring(0, 4)}</h2>
            <h2 className={styles['net-result']}>{context.lang === 'en' ? 'Net result' : 'Netto resultaat'}</h2>
            <h3 className={calculateTotalIncome() - calculateTotalExpenses() < 0 ? styles['neg'] : styles['pos']}>&#8364; {(calculateTotalIncome() - calculateTotalExpenses()).toFixed(2)}</h3>
            <br/>
            <hr/>
            <h2 className={styles['income']}>{context.lang === 'en' ? 'Income' : 'Inkomsten'}</h2>
            <HeaderTable
            inout={'in'} 
            calculate={calculateIncomePerHeader} 
            showCorrectHeader={showCorrectHeader} 
            addHeader={addHeader} 
            removeHeader={removeHeader} 
            changeHeader={changeHeader}
            showEmpty={showEmpty} 
            setModal={setModal}
            dispatchHeader={dispatchHeader}/>
            <br/>
            <hr/>
            <h2 className={styles['expenses']}>{context.lang === 'en' ? 'Expenses' : 'Uitgaven'}</h2>
            <HeaderTable 
            inout={'out'} 
            calculate={calculateExpensesPerHeader} 
            showCorrectHeader={showCorrectHeader} 
            addHeader={addHeader}
            removeHeader={removeHeader} 
            changeHeader={changeHeader}
            showEmpty={showEmpty}
            setModal={setModal} 
            dispatchHeader={dispatchHeader}/>
            <br/>
            <hr/>
            <h1><FaChartBar/></h1>
            <h2 className={styles['income']}>{context.lang === 'en' ? 'Income' : 'Inkomsten'}</h2>
            <BarChart
            calculate={calculateIncomePerHeader} 
            showCorrectHeader={showCorrectHeader} 
            showEmpty={showEmpty}/>
            <br/>
            <hr/>
            <h1><FaChartBar/></h1>
            <h2 className={styles['expenses']}>{context.lang === 'en' ? 'Expenses' : 'Uitgaven'}</h2>
            <BarChart
            calculate={calculateExpensesPerHeader} 
            showCorrectHeader={showCorrectHeader} 
            showEmpty={showEmpty}/>
            <br/>
            <hr/>
            <h1><FaChartPie/></h1>
            <h2 className={styles['income']}>{context.lang === 'en' ? 'Income' : 'Inkomsten'}</h2>
            <PieChart
            calculate={calculateIncomePerHeader} 
            showCorrectHeader={showCorrectHeader} 
            showEmpty={showEmpty}/>
            <br/>
            <hr/>
            <h1><FaChartPie/></h1>
            <h2 className={styles['expenses']}>{context.lang === 'en' ? 'Expenses' : 'Uitgaven'}</h2>
            <PieChart 
            calculate={calculateExpensesPerHeader} 
            showCorrectHeader={showCorrectHeader} 
            showEmpty={showEmpty}/>
            <br />
            <hr />
            <br />
       </div>
    );
}
