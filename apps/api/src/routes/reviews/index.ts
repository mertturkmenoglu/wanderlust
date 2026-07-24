import { container } from '@/ioc';
import { defineModule } from '@/lib/define-module';
import { CreateReviewMethod } from './methods/create';
import { DeleteReviewMethod } from './methods/delete';
import { GetReviewMethod } from './methods/get';
import { GetRatingsMethod } from './methods/get-ratings';
import { LikeReviewMethod } from './methods/like';
import { ListReviewAssetsByPlaceIdMethod } from './methods/list-assets-by-place-id';
import { ListReviewsByPlaceIdMethod } from './methods/list-by-place-id';
import { ListReviewsByUsernameMethod } from './methods/list-by-username';
import { ListReviewLikesMethod } from './methods/list-likes';
import { LikeStatusProvider } from './provides/like-status';
import { os } from './shared/router';

export const module = defineModule({
	exports: [
		GetReviewMethod,
		CreateReviewMethod,
		DeleteReviewMethod,
		ListReviewsByUsernameMethod,
		ListReviewsByPlaceIdMethod,
		GetRatingsMethod,
		ListReviewAssetsByPlaceIdMethod,
		LikeReviewMethod,
		ListReviewLikesMethod,
		LikeStatusProvider,
	],
	router: () => {
		const get = container.get(GetReviewMethod);
		const create = container.get(CreateReviewMethod);
		const del = container.get(DeleteReviewMethod);
		const listByUsername = container.get(ListReviewsByUsernameMethod);
		const listByPlaceId = container.get(ListReviewsByPlaceIdMethod);
		const getRatings = container.get(GetRatingsMethod);
		const listAssetsByPlaceId = container.get(ListReviewAssetsByPlaceIdMethod);
		const like = container.get(LikeReviewMethod);
		const listLikes = container.get(ListReviewLikesMethod);

		return os.router({
			get: get.route(),
			create: create.route(),
			delete: del.route(),
			listByUsername: listByUsername.route(),
			listByPlaceId: listByPlaceId.route(),
			getRatings: getRatings.route(),
			listAssetsByPlaceId: listAssetsByPlaceId.route(),
			like: like.route(),
			listLikes: listLikes.route(),
		});
	},
});
