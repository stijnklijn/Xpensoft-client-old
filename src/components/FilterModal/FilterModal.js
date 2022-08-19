import React, {useState} from 'react';
import styles from './FilterModal.module.css';

export function FilterModal({
    lang,
    setModal,
    headers, 
    showCorrectHeader, 
    filterFromDate, 
    filterToDate,
    filterDescription, 
    filterFromAmount, 
    filterToAmount,
    dispatchFilter}) {

    const [localFromDate, setLocalFromDate] = useState(filterFromDate);
    const [localToDate, setLocalToDate] = useState(filterToDate);
    const [localDescription, setLocalDescription] = useState(filterDescription);
    const [localHeaders, setLocalHeaders] = useState(headers);
    const [localFromAmount, setLocalFromAmount] = useState(filterFromAmount);
    const [localToAmount, setLocalToAmount] = useState(filterToAmount);

   
    function handleFilter() {
        dispatchFilter({type: 'SET_FROM_DATE', payload: localFromDate});
        dispatchFilter({type: 'SET_TO_DATE', payload: localToDate});
        dispatchFilter({type: 'SET_DESCRIPTION', payload: localDescription});
        dispatchFilter({type: 'SET_HEADERS', payload: localHeaders});
        dispatchFilter({type: 'SET_FROM_AMOUNT', payload: localFromAmount});
        dispatchFilter({type: 'SET_TO_AMOUNT', payload: localToAmount});
        setModal(prev => 'OFF')
    }

    function handleCancel() {
        setModal(prev => 'OFF')
    }
    
    return(
        <div className={styles.backdrop}>
            <div className={styles['filter-modal']}>
                <h2>Filter</h2>
                <div className={styles['input-fields']}>
                    <label htmlFor='fromdate'>{lang === 'en' ? 'From:  ' : 'Van: '}</label>
                    <input type='date' value={localFromDate} id='fromdate' onChange={e => setLocalFromDate(e.target.value)}></input>
                    <label htmlFor='todate'>{lang === 'en' ? 'To: ' : 'Tot: '}</label>
                    <input type='date' value={localToDate} id='todate' onChange={e => setLocalToDate(e.target.value)}></input>
                    <label htmlFor='description'>{lang === 'en' ? 'Description: ' : 'Omschrijving: '}</label>
                    <input type='text' id='description' value={localDescription} onChange={e => setLocalDescription(e.target.value)}/>
                    <label className={styles['header-label']} htmlFor='headers'>{lang === 'en' ? 'Headers: ' : 'Rubrieken: '}</label>
                        <select id='headers' name='headers' multiple onChange={e => setLocalHeaders(Array.from(e.target.options).filter(option => option.selected).map(option => option.value))}>
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
                    <label htmlFor='fromamount'>{lang === 'en' ? 'From amount: ' : 'Vanaf bedrag: '}</label>
                    <input type='text' id='fromamount' value={localFromAmount} onChange={e => setLocalFromAmount(e.target.value)}></input>
                    <label htmlFor='toamount'>{lang === 'en' ? 'To amount: ' : 'Tot bedrag: '}</label>
                    <input type='text' id='toamount' value={localToAmount} onChange={e => setLocalToAmount(e.target.value)}></input>
                </div>
                <button onClick={handleFilter}>Filter</button>
                <button onClick={handleCancel}>{lang === 'en' ? 'Cancel' : 'Annuleren'}</button>
            </div>
        </div>
    );
}
