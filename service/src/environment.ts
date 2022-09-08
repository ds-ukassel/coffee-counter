export const environment = {
	version: 'v1',
	port: +(process.env.PORT || 3000),
	mongo: {
		uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/coffee-counter',
		options: {},
	},
	apiKey: process.env.COFFEE_API_KEY,
};
