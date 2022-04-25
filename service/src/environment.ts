export const environment = {
	version: 'v1',
	port: +(process.env.PORT || 3000),
	mongo: {
		uri: process.env.MONGO_URI || 'mongodb://localhost:27017/coffee-counter',
		options: {},
	},
	auth: {
		publicKey: `-----BEGIN PUBLIC KEY-----\n${
			process.env.AUTH_PUBLIC_KEY || 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjSudUTRH8wtEeIQdKh4Yv97HcFGjLzl9+yBm+SO2lf2r/jvpbSRPWqMDbrgQ0BGDwMQLweUoPUzOhZbrScs5edhRxtn3nPKUTiBtOoFiYupTTicdIKY1FAlagSM4/7WBbj0CT14cXQoyZK2VbfYXsu19tdJ/oFPBAGwrsj/ugiGE6c8H6wu4yHPsJFDR8sN524NN4diXOKyZ731IP5lqfN4+bP17/b1KaDG8swsRNW93dfEz0nfcJu+wutI3dLc98/cekOpHUZRzndsshifjuM39RF6oyI89tcuwrrKqrz5HV9CsPBUB2hakGBhg71svZyq304ikQFYej/ydZd0biwIDAQAB'
		}\n-----END PUBLIC KEY-----`,
		resource: process.env.AUTH_RESOURCE || 'coffee-service',
		algorithms: (process.env.AUTH_ALGORITHMS || 'RS256').split(','),
		issuer: process.env.AUTH_ISSUER || 'https://se.uniks.de/auth/realms/coffee',
	},
};
