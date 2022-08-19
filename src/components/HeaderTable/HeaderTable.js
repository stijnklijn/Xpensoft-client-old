import React, {useContext} from 'react';
import {Header} from '../Header/Header';
import styles from './HeaderTable.module.css'
import Context from '../../store/context'

export function HeaderTable({
    inout, 
    calculate, 
    showCorrectHeader, 
    removeHeader, 
    setModal,
    dispatchHeader,
    showEmpty}) {

    const context = useContext(Context);

    let [headers, total] = calculate();

     return (
        <div className={styles['header-table']}>
            <table>
                <thead>
                    <tr>
                        <th className={styles['column-header']}>{context.lang === 'en' ? 'Header' : 'Rubriek'}</th>
                        <th className={styles['column-amount']}>{context.lang === 'en' ? 'Amount' : 'Bedrag'}</th>
                        <th className={styles['column-percentage']}>%</th>
                        <th className={styles['column-remove']}></th>
                    </tr>
                </thead>
                <tbody>
                     {Object.entries(headers).sort((a, b) => {
                        if (showCorrectHeader(Number(a[0])) < showCorrectHeader(Number(b[0]))) {
                            return -1;
                        }
                        else {
                            return 1;
                        }
                    }).map((el, i) => {
                            return (el[1] > 0 || showEmpty) && <Header
                            key={i}
                            headerId={Number(el[0])}
                            amount={Number(el[1])}
                            showCorrectHeader={showCorrectHeader}
                            total={total}
                            inout={inout}
                            removeHeader={removeHeader}
                            setModal={setModal}
                            dispatchHeader={dispatchHeader}/>
                        })}
                    <tr>
                        <td className={styles['column-header']}><b>{context.lang === 'en' ? 'Total' : 'Totaal'}</b></td>
                        <td className={styles['column-amount-' + inout]}><b>&#8364; {total.toFixed(2)}</b></td>
                        <td className={styles['column-percentage']}>{total > 0 ? 100 : 0}</td>
                        <th className={styles['column-remove']}></th>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}