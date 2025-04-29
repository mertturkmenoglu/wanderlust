package main

import (
	"wanderlust/internal/app/health"

	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humaecho"
	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()
	api := humaecho.New(e, huma.DefaultConfig("Wanderlust API", "2.0.0"))
	api.OpenAPI().Info = &huma.Info{
		Title: "Wanderlust API",
		Description: `Welcome to Wanderlust, a travel and location discovery platform designed to inspire exploration and connection. With Wanderlust, you can:<br>
		<ul>
			<li>Explore cities and point of interest (POI) guides, curated with insider tips and recommendations.</li>
			<li>Collect and organize POIs into favorites, bookmarks, and custom lists.</li>
			<li>Follow fellow travelers, send messages, and stay up-to-date on their adventures.</li>
			<li>Record your own trips with diary entries, complete with photos and memories.</li>
			<li>Plan future trips using our intuitive trip planner tool.</li>
			<li>Search and filter results using powerful facets and filters.</li>
		</ul>
		It's open source and free.`,
		Version: "1.0.0",
	}

	grp := huma.NewGroup(api, "/api/v2")

	health.Register(grp)

	e.Logger.Fatal(e.Start(":5000"))
}
