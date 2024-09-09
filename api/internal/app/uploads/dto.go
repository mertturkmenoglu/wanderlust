package uploads

// UploadObj
// @Description UploadObj
type UploadObj struct {
	Url string `json:"url" example:"https://example.com/image.jpg" validate:"required"`
	Key string `json:"key" example:"a690dd36-6a90-465f-81d5-bf0a03be084c" validate:"required"`
} //@name UploadsUploadObj
