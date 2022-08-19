import React from 'react';

const Context = React.createContext({
    jwt: '',
    transactions: [],
    headers: [],
    lang: 'en'
});

export default Context;