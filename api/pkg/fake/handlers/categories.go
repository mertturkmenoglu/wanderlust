package handlers

import (
	"context"
	"wanderlust/pkg/db"
	"wanderlust/pkg/utils"
)

type category struct {
	name  string
	image string
}

var categoriesData = []category{
	{name: "Coffee shops", image: "https://images.unsplash.com/photo-1507915135761-41a0a222c709"},
	{name: "Restaurants", image: "https://images.unsplash.com/photo-1552566626-52f8b828add9"},
	{name: "Bookstores", image: "https://images.unsplash.com/photo-1463320726281-696a485928c7"},
	{name: "Natural landmarks", image: "https://images.unsplash.com/photo-1597290282695-edc43d0e7129"},
	{name: "Breweries", image: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2"},
	{name: "Bars & Clubs", image: "https://images.unsplash.com/photo-1627686973009-0de79c0c3f6b"},
	{name: "Community Hubs", image: "https://images.unsplash.com/photo-1697719074506-30fc25fed9c5"},
	{name: "Coworking spaces", image: "https://images.unsplash.com/photo-1511018556340-d16986a1c194"},
	{name: "Wellness centers", image: "https://images.unsplash.com/photo-1540929819775-fcc7d4649250"},
	{name: "Photography spots", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597"},
	{name: "Artisanal bakeries", image: "https://images.unsplash.com/photo-1627686973009-0de79c0c3f6b"},
	{name: "Street art and murals", image: "https://images.unsplash.com/photo-1697719074506-30fc25fed9c5"},
	{name: "Art galleries", image: "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72"},
	{name: "Art fairs", image: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2"},
	{name: "Museums", image: "https://images.unsplash.com/photo-1627686973009-0de79c0c3f6b"},
	{name: "Arts & Theater", image: "https://images.unsplash.com/photo-1697719074506-30fc25fed9c5"},
	{name: "Hotels", image: "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72"},
	{name: "Places to Stay", image: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2"},
	{name: "Street food vendors", image: "https://images.unsplash.com/photo-1627686973009-0de79c0c3f6b"},
	{name: "Workshops", image: "https://images.unsplash.com/photo-1697719074506-30fc25fed9c5"},
	{name: "Specialty shops (antique stores, comic book stores)", image: "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72"},
	{name: "Famous filming locations", image: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2"},
	{name: "Tourist Attractions", image: "https://images.unsplash.com/photo-1697719074506-30fc25fed9c5"},
}

type FakeCategories struct {
	*Fake
}

func (f *FakeCategories) Generate() (int64, error) {
	for i, category := range categoriesData {
		index, err := utils.SafeInt64ToInt16(int64(i))

		if err != nil {
			return 0, err
		}

		_, err = f.db.Queries.CreateCategory(context.Background(), db.CreateCategoryParams{
			ID:    index + 1,
			Name:  category.name,
			Image: category.image,
		})

		if err != nil {
			return 0, err
		}
	}

	return int64(len(categoriesData)), nil
}
