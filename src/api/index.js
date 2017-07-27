module.exports = (express,conection) => {
	var router      = express.Router();
	// Router Middleware
	router.use((req, res, next) => {
		// log each request to the console
		console.log("You have hit the /api", req.method, req.url);

		// Remove powered by header
		//res.set('X-Powered-By', ''); // OLD WAY
		//res.removeHeader("X-Powered-By"); // OLD WAY 2
		// See bottom of script for better way

		// CORS
		res.header("Access-Control-Allow-Origin", "*"); //TODO: potentially switch to white list version
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

		// we can use this later to validate some stuff

		// continue doing what we were doing and go to the route
		next();
	});

	// API ROOT - Display Available Routes
	router.get('/', (req, res) => {
		/*		//TODO: THIS NO LONGER WORKS BECAUSE WE MOVE THE ROUTES INTO A SEPARATE FILE, UNLESS I PASS IN APP AS WELL
		 //Generate a List of Routes on the APP
		 //http://stackoverflow.com/a/28199817
		 var route, routes = [];
		 app._router.stack.forEach((middleware) => {
		 if(middleware.route){ // routes registered directly on the app
		 routes.push(middleware.route);
		 } else if(middleware.name === 'router'){ // router middleware
		 middleware.handle.stack.forEach((handler) => {
		 route = handler.route;
		 route && routes.push(route);
		 });
		 }
		 });
		 console.log(routes)
		 */
		res.jsonp({
			name: 'Panorama API',
			version: '1.0',
			//	        routes: routes // TODO: format this better, after above is fixed
		});

	});

	// Simple MySQL Test
	router.get('/test', (req, res) => {
		conection.any('SELECT * FROM customer', [true])
			.then(function(data) {
				res.jsonp({"res":data});
			})
			.catch(function(error) {
				res.jsonp({"res":error})
			});

	});

	return router;
};