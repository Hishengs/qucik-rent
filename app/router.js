module.exports = app => {

	app.router.get('/', 'home.index');

	app.router.group({
		prefix: '/api'
	}, router => {
		router.post('/topics', 'home.getTopics');
	});
	
};