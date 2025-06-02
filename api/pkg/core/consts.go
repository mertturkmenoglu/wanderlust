package core

var (
	API_NAME        = "Wanderlust API"
	API_VERSION     = "2.0.0"
	API_DESCRIPTION = `Welcome to Wanderlust, a travel and location discovery platform designed to inspire exploration and connection. With Wanderlust, you can:<br>
		<ul>
			<li>Explore cities and point of interest (POI) guides, curated with insider tips and recommendations.</li>
			<li>Collect and organize POIs into favorites, bookmarks, and custom lists.</li>
			<li>Follow fellow travelers, send messages, and stay up-to-date on their adventures.</li>
			<li>Record your own trips with diary entries, complete with photos and memories.</li>
			<li>Plan future trips using our intuitive trip planner tool.</li>
			<li>Search and filter results using powerful facets and filters.</li>
		</ul>
		It's open source and free.`
	API_PREFIX           = "/api/v2"
	API_DOCS_SCALAR_HTML = `<!doctype html>
		<html>
		<head>
			<title>Wanderlust API Docs</title>
			<meta charset="utf-8" />
			<meta
			name="viewport"
			content="width=device-width, initial-scale=1" />
    		<link rel="icon" href="favicon.ico" />
		</head>
		<body>
			<div id="app"></div>
			<script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
			<script>
				Scalar.createApiReference('#app', {
					url: '/openapi.json',
					persistAuth: true,
					hideClientButton: true,
					authentication: {
						preferredSecurityScheme: 'BearerJWT',
					},
					favicon: '/favicon.ico',
				})
			</script>
		</body>
		</html>`
)
