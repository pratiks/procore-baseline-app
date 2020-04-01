import JWTdecode from 'jwt-decode';

export function getToken() {
	const token = localStorage.getItem('token');
	let parsedToken;

	try {
		parsedToken = JWTdecode(token);
	} catch (e) {
		return null;
	}

	return parsedToken ? token : null;
}

export function setToken(token) {
	localStorage.setItem('token', token);
}

export function setRefreshToken(token) {
	localStorage.setItem('refreshToken', token);
}

export function getRefreshToken() {
	return localStorage.getItem('refreshToken');
}

export function removeToken() {
	localStorage.removeItem('token');
}

export function removeRefreshToken() {
	localStorage.removeItem('refreshToken');
}

export function destroyToken() {
	localStorage.removeItem('refreshToken');
	localStorage.removeItem('token');

}
