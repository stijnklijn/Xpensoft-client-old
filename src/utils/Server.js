const Server = {

    host: 'https://xpensoft-api.azurewebsites.net',

    async register(email, password) {
        const response = await fetch(`${this.host}/register`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        });
        if (response.status !== 201) {
            throw new Error();
        }
        return await response.json();
    },

    async login(email, password) {
        const auth = 'Basic ' + Buffer.from(email + ':' + password, 'utf8').toString('base64');
        const response = await fetch(`${this.host}/login`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'Authorization': auth},
        });
        if (response.status !== 200) {
            throw new Error();
        }
        const jwt = response.headers.get('Authorization');
        localStorage.setItem('jwt', jwt);
        return jwt;
    },

    async request(URL, method, body) {
        const jwt = 'Bearer ' + localStorage.getItem('jwt')
        return await fetch(URL, {
            method: method,
            headers: {'Content-Type': 'application/json', 'Authorization': jwt},
            body: body
        });
    },

    async getHeaders() {
        return this.request(`${this.host}/headers`, 'GET', null)
    },

    async addHeader(name, income) {
        return this.request(`${this.host}/headers`, 'POST', JSON.stringify({name, income}));
    },

    async changeHeader(id, name, income) {
        return this.request(`${this.host}/headers/`, 'PUT', JSON.stringify({id, name, income}));
    },

    async deleteHeader(id) {
        return this.request(`${this.host}/headers/${id}`, 'DELETE', null);
    },

    async getTransactions() {
        return this.request(`${this.host}/transactions`, 'GET', null);
    },

    async addTransaction(date, description, header, amount) {
        return this.request(`${this.host}/transactions`, 'POST', JSON.stringify({date, description, header, amount}));
    },

    async changeTransaction(id, date, description, header, amount) {
        return this.request(`${this.host}/transactions`, 'PUT', JSON.stringify({id, date, description, header, amount}));
    },

    async deleteTransaction(id) {
        return this.request(`${this.host}/transactions/${id}`, 'DELETE', null);
    }
}

export default Server;