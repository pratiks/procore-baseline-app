export const ERROR_401_REFRESH_YOUR_TOKEN = {
	message: 'please use your refresh token to obtain a fresh token.',
	status: 401,
	duration: 2000
};


export const ERROR_404 = {
	status: 404,
	duration: 2000
};

// message: 'Your access token has expired, please use your refresh token to obtain a fresh token.',
// todo: compare full string

export const ENDPOINTS = {
  REFRESH_TOKEN: '/oauth/token',
  AUTHORIZATION: '/oauth/authorize',


};
