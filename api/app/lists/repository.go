package lists

import (
	"context"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/pagination"
	"wanderlust/pkg/tracing"
	"wanderlust/pkg/utils"

	"github.com/cockroachdb/errors"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	db   *db.Queries
	pool *pgxpool.Pool
}

func (r *Repository) getWithoutItems(ctx context.Context, id string) (*dto.List, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.FindListById(ctx, id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.Wrap(ErrNotFound, err.Error())
		}

		return nil, errors.Wrap(ErrFailedToFetch, err.Error())
	}

	list := dto.ToListWithoutItems(res.List, res.Profile)

	return &list, nil
}

func (r *Repository) getWithItems(ctx context.Context, id string) (*dto.List, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.FindListById(ctx, id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.Wrap(ErrNotFound, err.Error())
		}

		return nil, errors.Wrap(ErrFailedToFetch, err.Error())
	}

	items, err := r.db.FindManyListItems(ctx, id)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToFetch, err.Error())
	}

	places := make([]dto.Place, 0)

	if len(items) > 0 {
		places, err = dto.ToPlaces(items[0].Places)

		if err != nil {
			return nil, errors.Wrap(ErrFailedToFetch, err.Error())
		}
	}

	list := dto.ToListWithItems(res, items, places)

	return &list, nil
}

func (r *Repository) listByUserId(ctx context.Context, userId string, params dto.PaginationQueryParams) ([]dto.List, int64, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.FindManyListsByUserId(ctx, db.FindManyListsByUserIdParams{
		UserID: userId,
		Offset: int32(pagination.GetOffset(params)),
		Limit:  int32(params.PageSize),
	})

	if err != nil {
		return nil, 0, errors.Wrap(ErrFailedToList, err.Error())
	}

	count, err := r.db.CountListsByUserId(ctx, userId)

	if err != nil {
		return nil, 0, errors.Wrap(ErrFailedToList, err.Error())
	}

	profile, err := r.db.FindUserById(ctx, userId)

	if err != nil {
		return nil, 0, errors.Wrap(ErrFailedToList, err.Error())
	}

	lists := dto.ToListsWithoutItems(res, db.Profile{
		ID:             profile.ID,
		Username:       profile.Username,
		FullName:       profile.FullName,
		ProfileImage:   profile.ProfileImage,
		IsVerified:     profile.IsVerified,
		Bio:            profile.Bio,
		BannerImage:    profile.BannerImage,
		FollowersCount: profile.FollowersCount,
		FollowingCount: profile.FollowingCount,
		CreatedAt:      profile.CreatedAt,
	})

	return lists, count, nil
}

func (r *Repository) listPublicLists(ctx context.Context, userId string, params dto.PaginationQueryParams) ([]dto.List, int64, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.FindManyListsByUserIdAndIsPublic(ctx, db.FindManyListsByUserIdAndIsPublicParams{
		UserID: userId,
		Offset: int32(pagination.GetOffset(params)),
		Limit:  int32(params.PageSize),
	})

	if err != nil {
		return nil, 0, errors.Wrap(ErrFailedToList, err.Error())
	}

	count, err := r.db.CountListsByUserIdAndIsPublic(ctx, userId)

	if err != nil {
		return nil, 0, errors.Wrap(ErrFailedToList, err.Error())
	}

	profile, err := r.db.FindUserById(ctx, userId)

	if err != nil {
		return nil, 0, errors.Wrap(ErrFailedToList, err.Error())
	}

	lists := dto.ToListsWithoutItems(res, db.Profile{
		ID:             profile.ID,
		Username:       profile.Username,
		FullName:       profile.FullName,
		ProfileImage:   profile.ProfileImage,
		IsVerified:     profile.IsVerified,
		Bio:            profile.Bio,
		BannerImage:    profile.BannerImage,
		FollowersCount: profile.FollowersCount,
		FollowingCount: profile.FollowingCount,
		CreatedAt:      profile.CreatedAt,
	})

	return lists, count, nil
}

func (r *Repository) getListStatus(ctx context.Context, userId string, placeId string) ([]dto.ListStatus, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	idsAndNames, err := r.db.FindListIdAndNameByUserId(ctx, userId)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToList, err.Error())
	}

	listIds := make([]string, len(idsAndNames))

	for i, v := range idsAndNames {
		listIds[i] = v.ID
	}

	rows, err := r.db.FindPlaceInListStatus(ctx, db.FindPlaceInListStatusParams{
		PlaceID: placeId,
		Column2: listIds,
	})

	if err != nil {
		return nil, errors.Wrap(ErrFailedToList, err.Error())
	}

	results := make([]dto.ListStatus, len(idsAndNames))

	for i, list := range idsAndNames {
		var includes = false

		for _, row := range rows {
			if row.ListID == list.ID {
				includes = true
				break
			}
		}

		results[i] = dto.ListStatus{
			ID:       list.ID,
			Name:     list.Name,
			Includes: includes,
		}
	}

	return results, nil
}

func (r *Repository) countUserLists(ctx context.Context, userId string) (int64, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	count, err := r.db.CountListsByUserId(ctx, userId)

	if err != nil {
		return 0, errors.Wrap(ErrFailedToCount, err.Error())
	}

	return count, nil
}

type CreateParams = db.CreateListParams

func (r *Repository) create(ctx context.Context, userId string, params CreateParams) (*dto.List, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.CreateList(ctx, params)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToCreate, err.Error())
	}

	dbUser, err := r.db.FindUserById(ctx, userId)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToCreate, err.Error())
	}

	list := dto.ToListWithoutItems(res, db.Profile{
		ID:             dbUser.ID,
		Username:       dbUser.Username,
		FullName:       dbUser.FullName,
		ProfileImage:   dbUser.ProfileImage,
		IsVerified:     dbUser.IsVerified,
		Bio:            dbUser.Bio,
		BannerImage:    dbUser.BannerImage,
		FollowersCount: dbUser.FollowersCount,
		FollowingCount: dbUser.FollowingCount,
		CreatedAt:      dbUser.CreatedAt,
	})

	return &list, nil
}

func (r *Repository) remove(ctx context.Context, id string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tag, err := r.db.RemoveList(ctx, id)

	if err != nil {
		return errors.Wrap(ErrFailedToDelete, err.Error())
	}

	if tag.RowsAffected() == 0 {
		return errors.Wrap(ErrNotFound, "no rows affected")
	}

	return nil
}

type UpdateParams = db.UpdateListParams

func (r *Repository) update(ctx context.Context, params UpdateParams) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tag, err := r.db.UpdateList(ctx, params)

	if err != nil {
		return errors.Wrap(ErrFailedToUpdate, err.Error())
	}

	if tag.RowsAffected() == 0 {
		return errors.Wrap(ErrNotFound, "no rows affected")
	}

	return nil
}

func (r *Repository) createItem(ctx context.Context, listId string, placeId string) (*db.ListItem, error) {
	lastIndex, err := r.db.FindListLastIndexById(ctx, listId)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToCreateItem, err.Error())
	}

	asInt, ok := lastIndex.(int32)

	if !ok {
		return nil, errors.Wrap(ErrFailedToCreateItem, "failed to convert last index to int32")
	}

	index := asInt + 1

	count, err := r.db.CountListItemsByListId(ctx, listId)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToCreateItem, err.Error())
	}

	if count >= MAX_ITEMS_PER_LIST {
		return nil, ErrMaxListItemsReached
	}

	res, err := r.db.CreateListItem(ctx, db.CreateListItemParams{
		ListID:  listId,
		PlaceID: placeId,
		Index:   index,
	})

	if err != nil {
		return nil, errors.Wrap(ErrFailedToCreateItem, err.Error())
	}

	return &res, nil
}

func (r *Repository) updateItems(ctx context.Context, listId string, placeIds []string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tx, err := r.pool.Begin(ctx)

	if err != nil {
		return errors.Wrap(ErrFailedToUpdateItems, err.Error())
	}

	defer tx.Rollback(ctx)

	qtx := r.db.WithTx(tx)

	_, err = qtx.RemoveListItemsByListId(ctx, listId)

	if err != nil {
		return errors.Wrap(ErrFailedToUpdateItems, err.Error())
	}

	for i, placeId := range placeIds {
		index, err := utils.SafeInt64ToInt32(int64(i))

		if err != nil {
			return errors.Wrap(ErrFailedToUpdateItems, err.Error())
		}

		_, err = qtx.CreateListItem(ctx, db.CreateListItemParams{
			ListID:  listId,
			PlaceID: placeId,
			Index:   index + 1,
		})

		if err != nil {
			return errors.Wrap(ErrFailedToUpdateItems, err.Error())
		}
	}

	err = tx.Commit(ctx)

	if err != nil {
		return errors.Wrap(ErrFailedToUpdateItems, err.Error())
	}

	return nil
}
