'use client'
import Axios from 'axios'

const BASE_URL = '/api/'

let axios = Axios.create({
    withCredentials: false
})

const createQueryParams = (filterBy) => {
    const queryParams = new URLSearchParams();
    for (const entity of filterBy) {
        const { field, value } = entity;
        queryParams.append(field, value);
    }
    return queryParams.toString();
}

export const fetchService = {
    GET(endpoint, data) {
        return api(endpoint, 'GET', data)
    },
    POST(endpoint, data) {
        return api(endpoint, 'POST', data)
    },
    PUT(endpoint, data) {
        return api(endpoint, 'PUT', data)
    },
    DELETE(endpoint, data) {
        return api(endpoint, 'DELETE', data)
    }
}

const api = async (endpoint, method = 'GET', data = null) => {
    const url = (method === 'GET' && data) ? `${BASE_URL}${endpoint}?${createQueryParams(data)}` : `${BASE_URL}${endpoint}`
    console.log("uel,", url)
    try {
        const res = await axios({
            url,
            method,
            data: (method === 'GET') ? '' : data,
        })
        return await res.data
    } catch (err) {
        throw err
    }
}
