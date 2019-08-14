import jwt from 'jsonwebtoken';

const getUserId = request => {
	const authorization = request.request.headers.authorization;

	if (!authorization) {
		throw new Error('Authentication required!');
	}

	const token = authorization.replace('Bearer ', '');
	const decoded = jwt.verify(token, process.env.JWT_PRIVATEKEY);

	return decoded.userId;
};

export default getUserId;
