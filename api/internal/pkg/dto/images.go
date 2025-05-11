package dto

import "wanderlust/internal/pkg/upload"

type PresignedUrlInput struct {
	Bucket  upload.BucketName `query:"bucket" required:"true" example:"default" enum:"default,profile-images,banner-images,pois,reviews,diaries"`
	FileExt string            `query:"fileExt" required:"true" example:"png" enum:"jpg,png,webp,jpeg"`
}

type PresignedUrlOutput struct {
	Body PresignedUrlOutputBody
}

type PresignedUrlOutputBody struct {
	Url           string            `json:"url" example:"https://example.com/image.jpg" doc:"URL of image upload endpoint"`
	Id            string            `json:"id" example:"7323488942953598976" doc:"ID of image"`
	Bucket        upload.BucketName `json:"bucket" example:"default" doc:"Bucket of image"`
	FileExtension string            `json:"fileExtension" example:"png" doc:"File extension of image"`
	FileName      string            `json:"fileName" example:"7323488942953598976.png" doc:"File name of image"`
}
