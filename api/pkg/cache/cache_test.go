package cache_test

import (
	"context"
	"encoding/json"
	"testing"
	"time"
	"wanderlust/pkg/cache"

	"github.com/go-redis/redismock/v9"
	"github.com/google/go-cmp/cmp"
	"github.com/redis/go-redis/v9"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type Address struct {
	Street string `json:"street"`
	City   string `json:"city"`
	State  string `json:"state"`
	Zip    string `json:"zip"`
}

type Friend struct {
	Username string  `json:"username"`
	Cars     []Car   `json:"cars"`
	Image    *string `json:"image"`
}

type Car struct {
	Brand string `json:"brand"`
	Model string `json:"model"`
}

// Just a dummy struct to test different types of data
type ComplexType struct {
	FirstName    string    `json:"firstName"`
	LastName     string    `json:"lastName"`
	Age          int       `json:"age"`
	Address      Address   `json:"address"`
	PhoneNumbers []string  `json:"phoneNumbers"`
	Emails       []string  `json:"emails"`
	Friends      []Friend  `json:"friends"`
	IsActive     bool      `json:"isActive"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

func TestReadObjShouldPass(t *testing.T) {
	db, mock := redismock.NewClientMock()

	defer func() {
		require.NoError(t, mock.ExpectationsWereMet())
	}()

	c := cache.Cache{
		Client: db,
	}

	type TestData struct {
		Name string `json:"name"`
	}

	serialized, err := json.Marshal(TestData{
		Name: "John Doe",
	})

	assert.NoError(t, err)

	mock.ExpectGet("key").SetVal(string(serialized))

	var data TestData

	err = c.ReadObj(context.TODO(), "key", &data)

	assert.NoError(t, err)
	assert.Equal(t, "John Doe", data.Name)
}

func TestReadObjShouldPassWhenReadingComplexType(t *testing.T) {
	db, mock := redismock.NewClientMock()

	defer func() {
		require.NoError(t, mock.ExpectationsWereMet())
	}()

	c := cache.Cache{
		Client: db,
	}

	img := "https://example.com/image.jpg"

	originalStruct := ComplexType{
		FirstName: "John",
		LastName:  "Doe",
		Age:       30,
		Address: Address{
			Street: "123 Main St",
			City:   "New York",
			State:  "NY",
			Zip:    "10001",
		},
		PhoneNumbers: []string{"123-456-7890", "098-765-4321"},
		Emails:       []string{"john.doe@example.com"},
		Friends: []Friend{
			{
				Username: "john.doe",
				Cars: []Car{
					{
						Brand: "Toyota",
						Model: "Camry",
					},
					{
						Brand: "Honda",
						Model: "Civic",
					},
				},
				Image: nil,
			},
			{
				Username: "jane.doe",
				Cars: []Car{
					{
						Brand: "BMW",
						Model: "X5",
					},
				},
				Image: &img,
			},
		},
		IsActive:  true,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	serialized, err := json.Marshal(originalStruct)

	assert.NoError(t, err)

	mock.ExpectGet("key").SetVal(string(serialized))

	var data ComplexType

	err = c.ReadObj(context.TODO(), "key", &data)

	assert.NoError(t, err)
	assert.True(t, cmp.Equal(originalStruct, data), "ComplexType should be equal")
}

func TestReadObjShouldFailWhenKeyDoesNotExist(t *testing.T) {
	db, mock := redismock.NewClientMock()

	defer func() {
		require.NoError(t, mock.ExpectationsWereMet())
	}()

	c := cache.Cache{
		Client: db,
	}

	type TestData struct {
		Name string `json:"name"`
	}

	mock.ExpectGet("key").SetErr(redis.Nil)

	var data TestData

	err := c.ReadObj(context.TODO(), "key", &data)

	assert.Error(t, err)
	assert.ErrorContains(t, err, "getting key")
}

func TestReadObjShouldFailWhenValueIsNotSerializable(t *testing.T) {
	db, mock := redismock.NewClientMock()

	defer func() {
		require.NoError(t, mock.ExpectationsWereMet())
	}()

	c := cache.Cache{
		Client: db,
	}

	type TestData struct {
		Name string `json:"name"`
	}

	mock.ExpectGet("key").SetVal("not-json")

	var data TestData

	err := c.ReadObj(context.TODO(), "key", &data)

	assert.Error(t, err)
	assert.ErrorContains(t, err, "unmarshaling key")
}

func TestSetObjShouldPass(t *testing.T) {
	db, mock := redismock.NewClientMock()

	defer func() {
		require.NoError(t, mock.ExpectationsWereMet())
	}()

	c := cache.Cache{
		Client: db,
	}

	type TestData struct {
		Name string `json:"name"`
	}

	serialized, err := json.Marshal(TestData{
		Name: "John Doe",
	})

	assert.NoError(t, err)
	exp := time.Second * 10

	mock.ExpectSet("key", string(serialized), exp).SetVal("OK")

	err = c.SetObj(context.TODO(), "key", TestData{
		Name: "John Doe",
	}, exp)

	assert.NoError(t, err)
}

func TestSetObjShouldPassWhenWritingComplexType(t *testing.T) {
	db, mock := redismock.NewClientMock()

	defer func() {
		require.NoError(t, mock.ExpectationsWereMet())
	}()

	c := cache.Cache{
		Client: db,
	}

	img := "https://example.com/image.jpg"

	originalStruct := ComplexType{
		FirstName: "John",
		LastName:  "Doe",
		Age:       30,
		Address: Address{
			Street: "123 Main St",
			City:   "New York",
			State:  "NY",
			Zip:    "10001",
		},
		PhoneNumbers: []string{"123-456-7890", "098-765-4321"},
		Emails:       []string{"john.doe@example.com"},
		Friends: []Friend{
			{
				Username: "john.doe",
				Cars: []Car{
					{
						Brand: "Toyota",
						Model: "Camry",
					},
					{
						Brand: "Honda",
						Model: "Civic",
					},
				},
				Image: nil,
			},
			{
				Username: "jane.doe",
				Cars: []Car{
					{
						Brand: "BMW",
						Model: "X5",
					},
				},
				Image: &img,
			},
		},
		IsActive:  true,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	serialized, err := json.Marshal(originalStruct)

	assert.NoError(t, err)

	mock.ExpectSet("key", string(serialized), time.Second*10).SetVal("OK")

	err = c.SetObj(context.TODO(), "key", originalStruct, time.Second*10)

	assert.NoError(t, err)
}

func TestSetObjShouldFailWhenValueIsNotSerializable(t *testing.T) {
	db, mock := redismock.NewClientMock()

	defer func() {
		require.NoError(t, mock.ExpectationsWereMet())
	}()

	c := cache.Cache{
		Client: db,
	}

	type UnserializableType struct {
		Ch []chan string
	}

	data := UnserializableType{
		Ch: []chan string{make(chan string)},
	}

	err := c.SetObj(context.TODO(), "key", data, time.Second*10)

	assert.Error(t, err)
	assert.ErrorContains(t, err, "marshaling key")
}

func TestSetObjShouldFailWithCorrectErrWhenRedisWriteFails(t *testing.T) {
	db, mock := redismock.NewClientMock()

	defer func() {
		require.NoError(t, mock.ExpectationsWereMet())
	}()

	c := cache.Cache{
		Client: db,
	}

	type Data struct {
		Name string `json:"name"`
	}

	data := Data{
		Name: "John Doe",
	}

	serialized, err := json.Marshal(data)

	assert.NoError(t, err)

	mock.ExpectSet("key", string(serialized), time.Second*10).SetErr(redis.ErrClosed)

	err = c.SetObj(context.TODO(), "key", data, time.Second*10)

	assert.Error(t, err)
	assert.ErrorContains(t, err, "setting key")
}

func TestHasShouldPass(t *testing.T) {
	db, mock := redismock.NewClientMock()

	defer func() {
		require.NoError(t, mock.ExpectationsWereMet())
	}()

	c := cache.Cache{
		Client: db,
	}

	mock.ExpectGet("key").SetVal("OK")

	assert.True(t, c.Has(context.TODO(), "key"))
}

func TestHasShouldFailWhenKeyDoesNotExist(t *testing.T) {
	db, mock := redismock.NewClientMock()

	defer func() {
		require.NoError(t, mock.ExpectationsWereMet())
	}()

	c := cache.Cache{
		Client: db,
	}

	mock.ExpectGet("key").SetErr(redis.Nil)

	assert.False(t, c.Has(context.TODO(), "key"))
}
