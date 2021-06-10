import axios from 'axios';
export const baseUrl ="http://localhost:8000/";

export const axiosInstance= axios.create({
	baseURL: baseUrl,
	timeout: 5000,
	headers: {
		'Authorization': `token ${localStorage.getItem("password")}`
	  },
});