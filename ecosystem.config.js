module.exports = {
	apps: [
		{
			name: 'home',
			script: './home/index.js',
			watch: false,
			env: {
				NODE_ENV: 'development',
			},
			env_production: {
				NODE_ENV: 'production',
			},
		},
	],
}
