package uploads

import (
	"net/http"
	"wanderlust/pkg/storage"

	"github.com/labstack/echo/v4"
	"gocloud.dev/blob"
)

func Handler(c echo.Context) error {
	bucketName, err := storage.ToBucketName(c.QueryParam("bucket"))

	if err != nil {
		return err
	}

	ctx := c.Request().Context()

	bucket, err := storage.OpenBucket(ctx, bucketName)

	if err != nil {
		return err
	}

	defer bucket.Close()

	fileName := c.QueryParam("obj")

	if fileName == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "obj query param is required")
	}

	err = bucket.Upload(
		ctx,
		fileName,
		c.Request().Body,
		&blob.WriterOptions{
			ContentType: c.QueryParam("contentType"),
		},
	)

	if err != nil {
		return err
	}

	url, err := storage.GetUrl(ctx, bucketName, fileName)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, map[string]any{
		"url": url,
	})
}
