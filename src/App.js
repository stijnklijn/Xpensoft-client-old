import React, {useState, useEffect, useReducer, useRef} from 'react';
import {Switch, Route, Redirect, NavLink, useHistory} from 'react-router-dom';
import {Login} from './components/Login/Login';
import {Transactions} from './components/Transactions/Transactions';
import {Overview} from './components/Overview/Overview';
import Server from './utils/Server';
import {ErrorModal} from './components/ErrorModal/ErrorModal';
import {ImportModal} from './components/ImportModal/ImportModal';
import {FilterModal} from './components/FilterModal/FilterModal'
import {AddEditTransactionModal} from './components/AddEditTransactionModal/AddEditTransactionModal';
import {ChangeViewModal} from './components/ChangeViewModal/ChangeViewModal';
import {AddEditHeaderModal} from './components/AddEditHeaderModal/AddEditHeaderModal';
import styles from './App.module.css';
import imageEN from './images/EN.png';
import imageNL from './images/NL.png';
import Context from './store/context';

const initialCredentials = {
  email: '',
  emailIsValid: false,
  emailIsTouched: false,
  password: '',
  newEmail: '',
  newPassword1: '',
  newPassword2: '',
  forgotPasswordEmail: ''
}

function credentialsReducer(state, action) {
  switch (action.type) {
    case 'SET_EMAIL': return {
      ...state,
      email: action.payload
    }
    case 'SET_PASSWORD': return {
      ...state,
      password: action.payload
    }
    case 'SET_NEW_EMAIL': return {
      ...state,
      newEmail: action.payload
    }
    case 'SET_NEW_PASSWORD_1': return {
      ...state,
      newPassword1: action.payload
    }
    case 'SET_NEW_PASSWORD_2': return {
      ...state,
      newPassword2: action.payload
    }
    case 'SET_FORGOT_PASSWORD_EMAIL': return {
      ...state,
      forgotPasswordEmail: action.payload
    }
    case 'RESET': return initialCredentials
    default: return state
  }
}

const initialTransaction = {
  id: null,
  date: '',
  description: '',
  headerId: null,
  amount: ''
}

function transactionReducer(state, action) {
  switch (action.type) {
    case 'SET_ID': return {
      ...state,
      id: action.payload
    };
    case 'SET_DATE': return {
      ...state,
      date: action.payload
    };
    case 'SET_DESCRIPTION': return {
      ...state,
      description: action.payload
    };
    case 'SET_HEADER_ID': return {
      ...state,
      headerId: action.payload
    };
    case 'SET_AMOUNT': return {
      ...state,
      amount: action.payload
    };
    case 'RESET': return initialTransaction
    default: return state;
  }
}

const initialHeader = {
  id: null,
  name: '',
  income: undefined,
};

function headerReducer(state, action) {
  switch (action.type) {
    case 'SET_ID': return {
      ...state,
      id: action.payload
    };
    case 'SET_NAME': return {
      ...state,
      name: action.payload
    };
    case 'SET_INCOME': return {
      ...state,
      income: action.payload
    };
    case 'RESET': return initialHeader;
    default: return state;
  }
}

const initialFilter = {
  fromDate: '',
  toDate: '',
  description: '',
  headers: [],
  fromAmount: '',
  toAmount: ''
}

function filterReducer(state, action) {
  switch (action.type) {
    case 'SET_FROM_DATE': return {
      ...state,
      fromDate: action.payload
    }
    case 'SET_TO_DATE': return {
      ...state,
      toDate: action.payload
    }
    case 'SET_DESCRIPTION': return {
      ...state,
      description: action.payload
    }
    case 'SET_HEADERS': return {
      ...state,
      headers: action.payload
    }
    case 'SET_FROM_AMOUNT': return {
      ...state,
      fromAmount: action.payload
    }
    case 'SET_TO_AMOUNT': return {
      ...state,
      toAmount: action.payload
    }
    case 'RESET': return initialFilter
    default: return state
  }
}

function App() {

  const [jwt, setJwt] = useState(0);
  const [credentials, dispatchCredentials] = useReducer(credentialsReducer, initialCredentials);
  const [transactions, setTransactions] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [newTransaction, dispatchNewTransaction] = useReducer(transactionReducer, initialTransaction);
  const [editTransaction, dispatchEditTransaction] = useReducer(transactionReducer, initialTransaction);
  const [filter, dispatchFilter] = useReducer(filterReducer, initialFilter);
  const [newHeader, dispatchNewHeader] = useReducer(headerReducer, initialHeader);
  const [editHeader, dispatchEditHeader] = useReducer(headerReducer, initialHeader);
  const [maxItemsOnPage, setMaxItemsOnPage] = useState(50);
 
  //Initialize the correct month and hold the data for the selected time period
  const daysInMonth = [31, isLeapYear(new Date().getFullYear()) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const [fromDate, setFromDate] = useState(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`)
  const [toDate, setToDate] = useState(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${daysInMonth[new Date().getMonth()]}`);

  //Options
  const [lang, setLang] = useState('en');
  const [showEmpty, setShowEmpty] = useState(true);

  const [modal, setModal] = useState('OFF')
  const [errorModal, setErrorModal] = useState('');

  let history = useHistory();
  
  //Change the language
  function handleLangChange(e) {
    setLang(e.target.value);
}

  function logout() {
    localStorage.removeItem('jwt');
    setJwt(prev => '');
    dispatchCredentials({type: 'RESET'});
    setTransactions(prev => []);
    setHeaders(prev => []);
    history.push('/login')
  }

   const inputField = useRef();
  
  //Read the data from a file selected by the user
  async function importTransactions(e) {

  try {
      let file = inputField.current.files[0];
      inputField.current.value = null;
      let textResponse = await file.text();
      let lines = textResponse.split('\n');
      for (let i = 1; i < lines.length - 1; i++) {
          let fields = lines[i].split(';');
          let date = `${fields[0].substring(1, 5)}-${fields[0].substring(5, 7)}-${fields[0].substring(7, 9)}`
          let description = fields[1].substring(1, fields[1].length - 1)
          let headerId = fields[5] === '"Bij"' ? headers.find(header => header.name === 'Unallocated income').id : headers.find(header => header.name === 'Unallocated expenses').id;
          let amount = Number(fields[6].substring(1, fields[6].length - 1).replace(',','.'));
          addTransaction(date, description, headerId, amount)
      }
  } catch (e) {
      setErrorModal({en: 'File could not be read', nl: 'Bestand kan niet gelezen worden'})
  }
}

  //Add header if it's not already in the list. First letter should be uppercase with the rest lowercase.
  function addHeader(name, income) {
    try {
      Server.addHeader(name, income)
      .then(res => {
        if (res.status === 201) {
          res.json().then(json => setHeaders(prev => ([json, ...prev])));
        }
        if (res.status === 500) {
          setErrorModal({en: 'Session has expired. Please login again', nl: 'Sessie is verlopen. U moet opnieuw inloggen'});
          logout();
        }
      });
    }
    catch (err) {
      alert(lang === 'en' ? 'Unauthorized' : 'Niet geautoriseerd');
    }
  }

  //Remove header if it is not a default header and if there are no more transactions with that header
  function removeHeader(headerId) {
    try {
      Server.deleteHeader(headerId).then(res => {
        if (res.status === 204) {
          setHeaders(prev => prev.filter(el => el.id !== headerId))
        }
        if (res.status === 409) {
          setErrorModal({en: 'There are still transactions with that header', nl: 'Er zijn nog transacties in die rubriek'});
        }
        if (res.status === 500) {
          setErrorModal({en: 'Session has expired. Please login again', nl: 'Sessie is verlopen. U moet opnieuw inloggen'});
          logout();
        }
      });
    }
    catch (err) {
      setErrorModal({en: 'Cannot delete header', nl: 'Kan rubriek niet verwijderen'});
    }
  }

  function changeHeader(id, name, income) {
    name = name.trim()
    console.log(income);
    try {
      Server.changeHeader(id, name, income)
      .then(res => {
        if (res.status === 204) {
          const index = headers.findIndex(el => el.id === id);
          setHeaders(prev => [...prev.slice(0, index), {id, name, income}, ...prev.slice(index + 1, prev.length)]);
        }
        if (res.status === 500) {
          setErrorModal({en: 'Session has expired. Please login again', nl: 'Sessie is verlopen. U moet opnieuw inloggen'});
          logout();
        }
      })
    }
    catch (err) {
      setErrorModal({en: 'Cannot change header', nl: 'Kan rubriek niet wijzigen'});
     }
  }

  //Add a transaction to the list
  function addTransaction(date, description, headerId, amount) {
    let header = headers.find(e => e.id === parseInt(headerId));
     try {
      Server.addTransaction(date, description, header, amount)
      .then(res => {
        if (res.status === 201) {
          res.json().then(json => {
            setTransactions(prev => (sortByDateThenId([json, ...prev])))
            //Reset the data fields
            dispatchNewTransaction({type: 'RESET'});
          })
        }
        if (res.status === 500) {
          setErrorModal({en: 'Session has expired. Please login again', nl: 'Sessie is verlopen. U moet opnieuw inloggen'});
          logout();
        }
      });
    }
    catch (err) {
      setErrorModal({en: 'Cannot add transaction', nl: 'Kan transactie niet toevoegen'});
    }

   }

  //Remove transaction from the list
  function removeTransaction(id) {
    try {
      Server.deleteTransaction(id).then(res => {
        if (res.status === 204) {
          setTransactions(prev => prev.filter(el => el.id !== id));
        }
        if (res.status === 500) {
          setErrorModal({en: 'Session has expired. Please login again', nl: 'Sessie is verlopen. U moet opnieuw inloggen'});
          logout();
        }
      })
    }
    catch (err) {
      setErrorModal({en: 'Cannot delete transaction', nl: 'Kan transactie niet verwijderen'});
    }
   }

  //Change transaction
  function changeTransaction(id, date, description, headerId, amount) {
    let header = headers.find(e => e.id === parseInt(headerId));
    try {
      Server.changeTransaction(id, date, description.trim(), header, amount)
      .then(res => {
        if (res.status === 204) {
          const index = transactions.findIndex(el => el.id === id);
          setTransactions(prev => sortByDateThenId([...prev.slice(0, index), {id, date, description, header, amount}, ...prev.slice(index + 1, prev.length)]));
        }
        if (res.status === 500) {
          setErrorModal({en: 'Session has expired. Please login again', nl: 'Sessie is verlopen. U moet opnieuw inloggen'});
          logout();
        }
      })
    }
    catch (err) {
      setErrorModal({en: 'Cannot change transaction', nl: 'Kan transactie niet wijzigen'});
    }
 }

  function showCorrectHeader(headerId) {
    let headerName = headers.find(el => el.id === headerId).name;
    if (lang === 'nl' && headerName === 'Unallocated income') {
      return 'Ongerubriceerde inkomsten';
    }
    else if (lang === 'nl' && headerName === 'Unallocated expenses') {
      return 'Ongerubriceerde uitgaven';
    }
    else  {
      return headerName;
    }
  }

  function sortByDateThenId(array) {
    return array.sort((a, b) => {
      if (a.date > b.date) {
        return -1;
      }
      else if (a.date < b.date) {
        return 1;
      }
      else {
        if (a.id > b.id) {
          return -1
        }
        else {
          return 1;
        }
        }
    })
  }

  //Check whether the current year is a leap year
  function isLeapYear(year) {
    return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)
  }

  //Reset the filter
  function resetFilter() {
    dispatchFilter({type: 'RESET'})
}

let filteredTransactions = useRef();
filteredTransactions.current = transactions;

if (filter.fromDate) {
    filteredTransactions.current = filteredTransactions.current.filter(el => el.date >= filter.fromDate);
}

if (filter.toDate) {
    filteredTransactions.current = filteredTransactions.current.filter(el => el.date <= filter.toDate);
}

if (filter.description) {
    filteredTransactions.current = filteredTransactions.current.filter(el => RegExp(filter.description, 'gi').test(el.description));
}

if (filter.headers.length) {
    filteredTransactions.current = filteredTransactions.current.filter(el => filter.headers.includes(String(el.header.id)));
}

if (filter.fromAmount) {
    filteredTransactions.current = filteredTransactions.current.filter(el => Number(el.amount) >= filter.fromAmount);
}
if (filter.toAmount) {
    filteredTransactions.current = filteredTransactions.current.filter(el => Number(el.amount) <= filter.toAmount);
}

  useEffect(() => {
    if (!localStorage.getItem('jwt')) {
      return;
    }
    let promises = [Server.getHeaders(), Server.getTransactions()];
    Promise.all(promises).then(res => {
      if (res[0].status === 200 && res[1].status === 200) {
        res[0].json().then(json => setHeaders(prev => [...json]));
        res[1].json().then(json => {
          setTransactions(prev => [...sortByDateThenId(json)]);
        });
      }
      if (res[0].status === 500 || res[1].status === 500) {
        setErrorModal({en: 'Session has expired. Please login again', nl: 'Sessie is verlopen. U moet opnieuw inloggen'});
        logout();
      }
    }).catch(err => {
    })
   }, [jwt, lang]);

  return (
    <Context.Provider
    className={styles.app}
    value={{jwt, transactions: filteredTransactions.current, headers, lang}}>

      {errorModal && <ErrorModal
      lang={lang}
      errorModal={errorModal}
      setErrorModal={setErrorModal}/>}
      
      {modal === 'ADD_TRANSACTION' && <AddEditTransactionModal
      addEdit={'add'}
      lang={lang}
      setModal={setModal}
      date={newTransaction.date}
      description={newTransaction.description}
      headerId={newTransaction.headerId}
      amount={newTransaction.amount}
      dispatchTransaction={dispatchNewTransaction}
      headers={headers}
      showCorrectHeader={showCorrectHeader}
      addTransaction={addTransaction}
      setErrorModal={setErrorModal}/>}

      {modal === 'IMPORT' && <ImportModal
      lang={lang}
      inputField={inputField}
      importTransactions={importTransactions}
      setModal={setModal}/>}

      {modal === 'FILTER' && <FilterModal
      lang={lang}
      setModal={setModal}
      headers={headers} 
      showCorrectHeader={showCorrectHeader} 
      filterFromDate={filter.fromDate} 
      filterToDate={filter.toDate} 
      filterDescription={filter.description} 
      filterFromAmount={filter.fromAmount} 
      filterToAmount={filter.toAmount}
      dispatchFilter={dispatchFilter}/>}

      {modal === 'EDIT_TRANSACTION' && <AddEditTransactionModal
      addEdit='edit'
      lang={lang}
      setModal={setModal}
      id={editTransaction.id}
      date={editTransaction.date}
      description={editTransaction.description}
      headerId={editTransaction.headerId}
      amount={editTransaction.amount}
      dispatchTransaction={dispatchEditTransaction}
      headers={headers}
      showCorrectHeader={showCorrectHeader}
      changeTransaction={changeTransaction}
      setErrorModal={setErrorModal}/>}

      {modal === 'CHANGE_VIEW' && <ChangeViewModal 
      lang={lang}
      setModal={setModal}
      fromDate={fromDate}
      setFromDate={setFromDate}
      toDate={toDate}
      setToDate={setToDate}
      showEmpty={showEmpty}
      setShowEmpty={setShowEmpty}
      setErrorModal={setErrorModal}/>}

      {modal === 'ADD_HEADER' && <AddEditHeaderModal
      lang={lang}
      addEdit={'add'}
      setModal={setModal}
      headers={headers}
      name={newHeader.name}
      income={newHeader.income}
      dispatchHeader={dispatchNewHeader}
      addHeader={addHeader}
      setErrorModal={setErrorModal}/>}

      {modal === 'EDIT_HEADER' && <AddEditHeaderModal 
      lang={lang}
      addEdit={'edit'}
      setModal={setModal}
      headers={headers}
      id={editHeader.id}
      name={editHeader.name}
      income={editHeader.income}
      dispatchHeader={dispatchEditHeader}
      changeHeader={changeHeader}
      setErrorModal={setErrorModal}/>}

      {localStorage.getItem('jwt') && <nav>
        <div className={styles.navigation}>
          <h2>XPENSOFT</h2>
          <NavLink data-test='navlink-transactions' to='/transactions' activeClassName={styles.active}>
            {lang === 'en' ? 'Transactions' : 'Transacties'}
          </NavLink>
          <NavLink to='/overview' activeClassName={styles.active}>
            {lang === 'en' ? 'Overview' : 'Overzicht'}
          </NavLink>
        </div>
         <div className={styles.langbar}>
            <input type='radio' id='en' name='lang' value='en' checked={lang === 'en' ? true : false} onChange={handleLangChange}/>
            <img src={imageEN} alt=''/>
            <input type='radio' id='nl' name='lang' value='nl' checked={lang === 'en' ? false : true} onChange={handleLangChange}/>
            <img src={imageNL} alt=''/>
           <button onClick={logout}>{lang === 'en' ? 'Logout' : 'Uitloggen'}</button>
        </div>
      </nav>}
      <main>
        <Switch>
          <Route exact path='/'>
            <Redirect to='/transactions' />
           </Route>
          <Route path='/login'>
            {localStorage.getItem('jwt') && <Redirect to='transactions'/>}
            <Login
            setJwt={setJwt}
            email={credentials.email}
            password={credentials.password}
            newEmail={credentials.newEmail}
            newPassword1={credentials.newPassword1}
            newPassword2={credentials.newPassword2}
            forgotPasswordEmail={credentials.forgotPasswordEmail}
            dispatchCredentials={dispatchCredentials}/>
          </Route>
          <Route path='/transactions'>
            {!localStorage.getItem('jwt') && <Redirect to='login'/>}
            <Transactions
            showCorrectHeader={showCorrectHeader} 
            removeTransaction={removeTransaction} 
            changeTransaction={changeTransaction} 
            maxItemsOnPage={maxItemsOnPage} 
            setMaxItemsOnPage={setMaxItemsOnPage}
            setModal={setModal}
            dispatchTransaction={dispatchEditTransaction}
            resetFilters={resetFilter}/>
          </Route>
          <Route path='/overview'>
            {!localStorage.getItem('jwt') && <Redirect to='login'/>}
            <Overview
            showCorrectHeader={showCorrectHeader} 
            fromDate={fromDate} 
            setFromDate={setFromDate} 
            toDate={toDate} 
            setToDate={setToDate} 
            addHeader={addHeader} 
            removeHeader={removeHeader} 
            changeHeader={changeHeader}
            showEmpty={showEmpty} 
            setShowEmpty={setShowEmpty} 
            setModal={setModal}
            dispatchHeader={dispatchEditHeader}/>
            </Route>
         </Switch>
      </main>
    </Context.Provider>
  );
}

export default App;
