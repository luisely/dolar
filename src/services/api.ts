import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://olinda.bcb.gov.br/olinda/servico/PTAX/'
})

export const apiDolar = axios.create({
    baseURL: 'https://economia.awesomeapi.com.br/'
})