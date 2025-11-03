package assets

import "wanderlust/pkg/storage"

type GetPresignedUrlInput struct {
	Bucket    storage.BucketName `query:"bucket" required:"true" example:"default" enum:"default,profile-images,banner-images,places,reviews,diaries"`
	AssetType string             `query:"assetType" required:"true" example:"image" enum:"image,video"`
	FileExt   string             `query:"fileExt" required:"true" example:"png" enum:"jpg,png,webp,jpeg,mp4"`
}

type GetPresignedUrlOutput struct {
	Body GetPresignedUrlOutputBody
}

type GetPresignedUrlOutputBody struct {
	Url           string             `json:"url" example:"https://example.com/image.jpg" doc:"URL of asset upload endpoint"`
	Id            string             `json:"id" example:"7323488942953598976" doc:"ID of the asset"`
	Bucket        storage.BucketName `json:"bucket" example:"default" doc:"Bucket of the asset"`
	FileExtension string             `json:"fileExtension" example:"png" doc:"File extension of the asset"`
	FileName      string             `json:"fileName" example:"7323488942953598976.png" doc:"File name of the asset"`
}
