package aggregator

import "wanderlust/pkg/db"

type GetHomeAggregationDao struct {
	new       []db.GetNewPoisRow
	popular   []db.GetPopularPoisRow
	featured  []db.GetFeaturedPoisRow
	favorites []db.GetFavoritePoisRow
}
