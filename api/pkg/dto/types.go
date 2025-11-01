package dto

import "time"

type Address struct {
	ID         int32   `json:"id" example:"1234" doc:"ID of address of the place"`
	CityID     int32   `json:"cityId" example:"1234" doc:"ID of city of address of the place"`
	City       City    `json:"city"`
	Line1      string  `json:"line1" example:"Example Street" doc:"Line 1 of address of the place"`
	Line2      *string `json:"line2" example:"Example Street" doc:"Line 2 of address of the place"`
	PostalCode *string `json:"postalCode" example:"12345" doc:"Postal code of address of the place"`
	Lat        float64 `json:"lat" example:"12.3456" doc:"Latitude of the place"`
	Lng        float64 `json:"lng" example:"12.3456" doc:"Longitude of the place"`
}

type Asset struct {
	ID          int64     `json:"id" example:"1" doc:"ID of the asset"`
	EntityType  string    `json:"entityType" example:"place" doc:"Type of the related entity"`
	EntityID    string    `json:"entityId" example:"7323488942953598976" doc:"ID of the related entity"`
	Url         string    `json:"url" example:"https://example.com/media.jpg" doc:"URL of the asset"`
	AssetType   string    `json:"assetType" example:"image" doc:"Type of the asset"`
	Description *string   `json:"description" example:"An image of the place" doc:"Description of the asset"`
	CreatedAt   time.Time `json:"createdAt" example:"2023-05-01T00:00:00Z" doc:"Created at time of the asset"`
	UpdatedAt   time.Time `json:"updatedAt" example:"2023-05-01T00:00:00Z" doc:"Updated at time of the asset"`
	Order       int32     `json:"order" example:"1" doc:"Order of the asset"`
}

type Bookmark struct {
	ID        int64     `json:"id" example:"1234" doc:"ID of bookmark"`
	PlaceID   string    `json:"placeId" example:"7323488942953598976" doc:"Place ID"`
	Place     Place     `json:"place"`
	UserID    string    `json:"userId" example:"7323488942953598976" doc:"ID of user"`
	CreatedAt time.Time `json:"createdAt" example:"2023-05-01T00:00:00Z" doc:"Created at time of bookmark"`
}

type Category struct {
	ID    int16  `json:"id" example:"4" doc:"ID of the category"`
	Name  string `json:"name" example:"Natural landmarks" doc:"Name of the category"`
	Image string `json:"image" example:"https://example.com/image.jpg" doc:"Image URL"`
}

type City struct {
	ID          int32       `json:"id" example:"8102" doc:"City ID"`
	Name        string      `json:"name" example:"New York" doc:"City name"`
	Description string      `json:"description" example:"A big metropolis." doc:"City description"`
	State       CityState   `json:"state"`
	Country     CityCountry `json:"country"`
	Lat         float64     `json:"lat" example:"40.7128" doc:"Latitude"`
	Lng         float64     `json:"lng" example:"-74.0060" doc:"Longitude"`
	Image       string      `json:"image"`
}

type CityState struct {
	Code string `json:"code" example:"NY" doc:"State code"`
	Name string `json:"name" example:"New York" doc:"State name"`
}

type CityCountry struct {
	Code string `json:"code" example:"US" doc:"Country code"`
	Name string `json:"name" example:"United States" doc:"Country name"`
}

type Collection struct {
	ID          string           `json:"id" example:"7323488942953598976" doc:"ID of collection"`
	Name        string           `json:"name" example:"My collection" doc:"Name of collection"`
	Description string           `json:"description" example:"My collection description" doc:"Description of collection"`
	CreatedAt   time.Time        `json:"createdAt" example:"2023-05-01T00:00:00Z" doc:"Created at time of collection"`
	Items       []CollectionItem `json:"items"`
}

type CollectionItem struct {
	CollectionID string    `json:"collectionId" example:"7323488942953598976" doc:"ID of the collection"`
	PlaceID      string    `json:"placeId" example:"7323488942953598976" doc:"ID of the place"`
	Index        int32     `json:"index" example:"1" doc:"Index of collection item in the list"`
	Place        Place     `json:"place"`
	CreatedAt    time.Time `json:"createdAt" example:"2023-05-01T00:00:00Z" doc:"Created at time of collection item"`
}

type Diary struct {
	ID               string          `json:"id" example:"7323488942953598976" doc:"The ID of the diary entry"`
	UserID           string          `json:"userId" example:"7323488942953598976" doc:"The ID of the user"`
	Owner            DiaryUser       `json:"user"`
	Friends          []DiaryUser     `json:"friends"`
	Locations        []DiaryLocation `json:"locations"`
	Assets           []Asset         `json:"assets"`
	Title            string          `json:"title" example:"My diary entry" doc:"The title of the diary entry"`
	Description      string          `json:"description" example:"My diary entry description" doc:"The description of the diary entry"`
	ShareWithFriends bool            `json:"shareWithFriends" example:"true" doc:"Whether the diary entry is shared with friends or not"`
	Date             time.Time       `json:"date" example:"2023-05-01T00:00:00Z" doc:"The date of the diary entry"`
	CreatedAt        time.Time       `json:"createdAt" example:"2023-05-01T00:00:00Z" doc:"The created at time of the diary entry"`
	UpdatedAt        time.Time       `json:"updatedAt" example:"2023-05-01T00:00:00Z" doc:"The updated at time of the diary entry"`
}

type DiaryUser struct {
	ID           string  `json:"id" example:"7323488942953598976" doc:"User ID"`
	FullName     string  `json:"fullName" example:"John Doe" doc:"User full name"`
	Username     string  `json:"username" example:"johndoe" doc:"Username"`
	ProfileImage *string `json:"profileImage" example:"http://example.com/image.png" doc:"Profile image URL of the user"`
}

type DiaryLocation struct {
	PlaceID     string `json:"placeId" example:"7323488942953598976" doc:"ID of the place"`
	Place       `json:"place"`
	Description *string `json:"description" example:"My location description" doc:"The description of the location"`
	Index       int16   `json:"index" example:"1" doc:"The list index of the location"`
}

type Favorite struct {
	ID        int32     `json:"id" example:"1234" doc:"ID of favorite"`
	PlaceID   string    `json:"placeId" example:"7323488942953598976" doc:"ID of the place"`
	Place     Place     `json:"place"`
	UserID    string    `json:"userId" example:"7323488942953598976" doc:"ID of user"`
	CreatedAt time.Time `json:"createdAt" example:"2023-05-01T00:00:00Z" doc:"Created at time of favorite"`
}

type List struct {
	ID        string     `json:"id" example:"7323488942953598976" doc:"ID of the list"`
	Name      string     `json:"name" example:"My List" doc:"Name of the list"`
	UserID    string     `json:"userId" example:"7323488942953598976" doc:"ID of the user that owns the list"`
	User      ListUser   `json:"user"`
	Items     []ListItem `json:"items"`
	IsPublic  bool       `json:"isPublic" example:"true" doc:"Whether the list is public or not"`
	CreatedAt time.Time  `json:"createdAt" example:"2021-01-01T00:00:00Z" doc:"Date and time when the list was created"`
	UpdatedAt time.Time  `json:"updatedAt" example:"2021-01-01T00:00:00Z" doc:"Date and time when the list was last updated"`
}

type ListUser struct {
	ID           string  `json:"id" example:"7323488942953598976" doc:"ID of the user"`
	Username     string  `json:"username" example:"johndoe" doc:"Username of the user"`
	FullName     string  `json:"fullName" example:"John Doe" doc:"Full name of the user"`
	ProfileImage *string `json:"profileImage" example:"https://example.com/profile.jpg" doc:"Profile image of the user" required:"true"`
}

type ListItem struct {
	ListID    string    `json:"listId"`
	PlaceID   string    `json:"placeId"`
	Place     Place     `json:"place"`
	Index     int32     `json:"index"`
	CreatedAt time.Time `json:"createdAt"`
}

type ListStatus struct {
	ID       string `json:"id" example:"7323488942953598976" doc:"ID of the list"`
	Name     string `json:"name" example:"My List" doc:"Name of the list"`
	Includes bool   `json:"includes" example:"true" doc:"Whether the POI is included in the list"`
}

type PaginationQueryParams struct {
	Page     int32 `query:"page" required:"false" default:"1" minimum:"1" example:"2" doc:"Page number"`
	PageSize int32 `query:"pageSize" required:"false" default:"10" minimum:"10" maximum:"100" multipleOf:"10" example:"20" doc:"Page size"`
}

type PaginationInfo struct {
	Page         int32 `json:"page" example:"1" doc:"Page number"`
	PageSize     int32 `json:"pageSize" example:"10" doc:"Page size"`
	TotalRecords int64 `json:"totalRecords" example:"100" doc:"Total records"`
	TotalPages   int64 `json:"totalPages" example:"10" doc:"Total pages"`
	HasPrevious  bool  `json:"hasPrevious" example:"false" doc:"Has previous page"`
	HasNext      bool  `json:"hasNext" example:"true" doc:"Has next page"`
}

type Place struct {
	ID                 string             `json:"id" example:"7323488942953598976" doc:"ID of the place"`
	Name               string             `json:"name" example:"The Great Wall of China" doc:"Name of the place"`
	Phone              *string            `json:"phone" example:"+989123456789" doc:"Phone number of the place"`
	Description        string             `json:"description" example:"The Great Wall of China is a series of fortifications built along the northern borders of China to protect against the northern invasions." doc:"Description of the place"`
	Website            *string            `json:"website" example:"https://example.com" doc:"Website of the place"`
	AddressID          int32              `json:"addressId" example:"123456789" doc:"ID of address of the place"`
	CategoryID         int16              `json:"categoryId" example:"1" doc:"ID of category of the place"`
	PriceLevel         int16              `json:"priceLevel" example:"2" doc:"Price level of the place"`
	AccessibilityLevel int16              `json:"accessibilityLevel" example:"2" doc:"Accessibility level of the place"`
	TotalVotes         int32              `json:"totalVotes" example:"100" doc:"Total votes of the place"`
	TotalPoints        int32              `json:"totalPoints" example:"100" doc:"Total points of the place"`
	TotalFavorites     int32              `json:"totalFavorites" example:"100" doc:"Total favorites of the place"`
	Category           Category           `json:"category"`
	Amenities          map[string]*string `json:"amenities"`
	Hours              map[string]*string `json:"hours"`
	Assets             []Asset            `json:"assets"`
	Address            Address            `json:"address"`
	CreatedAt          time.Time          `json:"createdAt" example:"2023-05-01T00:00:00Z" doc:"Created at time of the place"`
	UpdatedAt          time.Time          `json:"updatedAt" example:"2023-05-01T00:00:00Z" doc:"Updated at time of the place"`
}

type Report struct {
	ID           string     `json:"id" example:"564457817990234127" doc:"ID of the report"`
	ResourceID   string     `json:"resourceId" example:"564457817990234127" doc:"ID of the resource"`
	ResourceType string     `json:"resourceType" example:"poi" doc:"Type of the resource"`
	ReporterID   *string    `json:"reporterId" example:"564457817990234127" doc:"ID of the reporter"`
	Description  *string    `json:"description" example:"Lorem ipsum dolor sit amet" doc:"Description of the report"`
	Reason       int32      `json:"reason" example:"1" doc:"Reason for the report"`
	Resolved     bool       `json:"resolved" example:"false" doc:"Whether the report is resolved"`
	ResolvedAt   *time.Time `json:"resolvedAt" example:"2023-01-01T00:00:00Z" doc:"Date the report was resolved"`
	CreatedAt    time.Time  `json:"createdAt" example:"2023-01-01T00:00:00Z" doc:"Date the report was created"`
	UpdatedAt    time.Time  `json:"updatedAt" example:"2023-01-01T00:00:00Z" doc:"Date the report was last updated"`
}

type Review struct {
	ID        string      `json:"id" example:"7323488942953598976" doc:"Review ID"`
	PlaceID   string      `json:"placeId" example:"7323488942953598976" doc:"Place ID"`
	UserID    string      `json:"userId" example:"7323488942953598976" doc:"User ID"`
	Content   string      `json:"content" example:"Lorem ipsum dolor sit amet" doc:"Content of the review"`
	Rating    int16       `json:"rating" example:"1" doc:"Rating of the review"`
	CreatedAt time.Time   `json:"createdAt" example:"2023-05-01T00:00:00Z" doc:"Created at time of review"`
	UpdatedAt time.Time   `json:"updatedAt" example:"2023-05-01T00:00:00Z" doc:"Updated at time of review"`
	Place     ReviewPlace `json:"place"`
	User      Profile     `json:"user"`
	Assets    []Asset     `json:"assets"`
}

type ReviewPlace struct {
	ID   string `json:"id" example:"7323488942953598976" doc:"ID of the place"`
	Name string `json:"name" example:"The Great Wall of China" doc:"Name of the place"`
}

type Trip struct {
	ID                 string              `json:"id" example:"7323488942953598976" doc:"Trip ID"`
	OwnerID            string              `json:"ownerId" example:"7323488942953598976" doc:"Owner User ID"`
	Owner              TripUser            `json:"owner"`
	Title              string              `json:"title" example:"My Awesome Trip" doc:"Title of the trip"`
	Description        string              `json:"description" example:"Lorem ipsum dolor sit amet" doc:"Description of the trip"`
	Status             string              `json:"status" example:"draft" doc:"Status of the trip"`
	VisibilityLevel    TripVisibilityLevel `json:"visibilityLevel" example:"friends" doc:"Visibility level of the trip"`
	StartAt            time.Time           `json:"startAt" example:"2023-05-01T00:00:00Z" doc:"Start datetime of the trip"`
	EndAt              time.Time           `json:"endAt" example:"2023-05-01T00:00:00Z" doc:"End datetime of the trip"`
	Participants       []TripUser          `json:"participants"`
	Locations          []TripPlace         `json:"locations"`
	RequestedAmenities map[string]*string  `json:"requestedAmenities"`
	CreatedAt          time.Time           `json:"createdAt" example:"2023-05-01T00:00:00Z" doc:"Created at time of trip"`
	UpdatedAt          time.Time           `json:"updatedAt" example:"2023-05-01T00:00:00Z" doc:"Updated at time of trip"`
}

type TripUser struct {
	ID           string `json:"id" example:"7323488942953598976" doc:"User ID"`
	FullName     string `json:"fullName" example:"John Doe" doc:"User full name"`
	Username     string `json:"username" example:"johndoe" doc:"Username"`
	ProfileImage string `json:"profileImage" example:"http://example.com/image.png" doc:"Profile image URL of the user"`
	Role         string `json:"role" example:"participant" doc:"Role of the user" enum:"participant,editor"`
}

type TripStatus string

const (
	TRIP_STATUS_DRAFT    TripStatus = "draft"
	TRIP_STATUS_ACTIVE   TripStatus = "active"
	TRIP_STATUS_CANCELED TripStatus = "canceled"
)

type TripVisibilityLevel string

const (
	TRIP_VISIBILITY_LEVEL_PUBLIC  TripVisibilityLevel = "public"
	TRIP_VISIBILITY_LEVEL_PRIVATE TripVisibilityLevel = "private"
	TRIP_VISIBILITY_LEVEL_FRIENDS TripVisibilityLevel = "friends"
)

type TripRole string

const (
	TRIP_ROLE_PARTICIPANT TripRole = "participant"
	TRIP_ROLE_EDITOR      TripRole = "editor"
)

type TripInvite struct {
	ID        string    `json:"id" example:"7323488942953598976" doc:"ID of invite"`
	TripID    string    `json:"tripId" example:"7323488942953598976" doc:"Trip ID"`
	From      TripUser  `json:"from"`
	To        TripUser  `json:"to"`
	SentAt    time.Time `json:"sentAt" example:"2023-05-01T00:00:00Z" doc:"Sent at time of invite"`
	ExpiresAt time.Time `json:"expiresAt" example:"2023-05-01T00:00:00Z" doc:"Expires at time of invite"`
	TripTitle string    `json:"tripTitle" example:"My Awesome Trip" doc:"Title of the trip"`
	Role      TripRole  `json:"role" example:"participant" doc:"Role of invite"`
}

type TripInviteDetail struct {
	TripInvite
	TripTitle string    `json:"tripTitle" example:"My Awesome Trip" doc:"Title of the trip"`
	StartAt   time.Time `json:"startAt" example:"2023-05-01T00:00:00Z" doc:"Start datetime of the trip"`
	EndAt     time.Time `json:"endAt" example:"2023-05-01T00:00:00Z" doc:"End datetime of the trip"`
}

type TripComment struct {
	ID        string    `json:"id" example:"7323488942953598976" doc:"ID of comment"`
	TripID    string    `json:"tripId" example:"7323488942953598976" doc:"Trip ID"`
	From      TripUser  `json:"from"`
	Content   string    `json:"content" example:"This is a comment" doc:"Content of comment"`
	CreatedAt time.Time `json:"createdAt" example:"2023-05-01T00:00:00Z" doc:"Created at time of the comment"`
}

type TripPlace struct {
	ID            string    `json:"id" example:"7323488942953598976" doc:"ID of the trip place"`
	TripID        string    `json:"tripId" example:"7323488942953598976" doc:"Trip ID"`
	ScheduledTime time.Time `json:"scheduledTime" example:"2023-05-01T00:00:00Z" doc:"Scheduled time of the place"`
	Description   string    `json:"description" example:"Lorem ipsum dolor sit amet" doc:"Description of the place"`
	PlaceID       string    `json:"placeId" example:"7323488942953598976" doc:"Place ID"`
	Place         Place     `json:"place"`
}

type Profile struct {
	ID             string    `json:"id" example:"564457817990234127" doc:"ID of user"`
	Username       string    `json:"username" example:"johndoe" doc:"Username of user"`
	FullName       string    `json:"fullName" example:"John Doe" doc:"Full name of user"`
	IsVerified     bool      `json:"isVerified" example:"false" doc:"Is user verified"`
	Bio            *string   `json:"bio" required:"true" example:"Lorem ipsum" doc:"Bio of user"`
	ProfileImage   *string   `json:"profileImage" required:"true" example:"https://example.com/profile.jpg" doc:"Profile image of user"`
	BannerImage    *string   `json:"bannerImage" required:"true" example:"https://example.com/banner.jpg" doc:"Banner image of user"`
	FollowersCount int32     `json:"followersCount" example:"100" doc:"Number of followers"`
	FollowingCount int32     `json:"followingCount" example:"50" doc:"Number of following"`
	CreatedAt      time.Time `json:"createdAt" example:"2023-01-01T00:00:00Z" doc:"Created at time of user"`
}
