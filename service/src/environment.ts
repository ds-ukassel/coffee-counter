export const environment = {
	version: 'v1',
	port: +(process.env.PORT || 3000),
	mongo: {
		uri: process.env.MONGO_URI || 'mongodb://localhost:27017/coffee-counter',
		options: {},
	},
	apiKey: process.env.COFFEE_API_KEY,
};
