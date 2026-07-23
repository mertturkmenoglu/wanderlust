import { container } from '@/ioc';
import { defineModule } from '@/lib/define-module';
import { CheckUsernameAvailabilityMethod } from './methods/check-username-availability';
import { FollowMethod } from './methods/follow';
import { GetUserMethod } from './methods/get';
import { GetUserByIdMethod } from './methods/get-by-id';
import { GetMeMethod } from './methods/get-me';
import { ListActivitiesMethod } from './methods/list-activities';
import { ListFollowersMethod } from './methods/list-followers';
import { ListFollowingMethod } from './methods/list-following';
import { ListTopPlacesMethod } from './methods/list-top-places';
import { SearchFollowingMethod } from './methods/search-following';
import { UpdateMethod } from './methods/update';
import { UpdateImageMethod } from './methods/update-image';
import { UpdateTopPlacesMethod } from './methods/update-top-places';
import { UserRolesProvider } from './provides/roles';
import { os } from './shared/router';

export const module = defineModule({
	exports: [
		GetUserMethod,
		GetUserByIdMethod,
		GetMeMethod,
		ListFollowersMethod,
		ListFollowingMethod,
		ListTopPlacesMethod,
		UpdateTopPlacesMethod,
		ListActivitiesMethod,
		SearchFollowingMethod,
		FollowMethod,
		UpdateMethod,
		CheckUsernameAvailabilityMethod,
		UpdateImageMethod,
		UserRolesProvider,
	],
	router: () => {
		const get = container.get(GetUserMethod);
		const getById = container.get(GetUserByIdMethod);
		const getMe = container.get(GetMeMethod);
		const listFollowers = container.get(ListFollowersMethod);
		const listFollowing = container.get(ListFollowingMethod);
		const listTopPlaces = container.get(ListTopPlacesMethod);
		const updateTopPlaces = container.get(UpdateTopPlacesMethod);
		const listActivities = container.get(ListActivitiesMethod);
		const searchFollowing = container.get(SearchFollowingMethod);
		const follow = container.get(FollowMethod);
		const update = container.get(UpdateMethod);
		const checkUsernameAvailability = container.get(
			CheckUsernameAvailabilityMethod,
		);
		const updateImage = container.get(UpdateImageMethod);

		return os.router({
			updateImage: updateImage.route(),
			get: get.route(),
			getById: getById.route(),
			getMe: getMe.route(),
			listFollowers: listFollowers.route(),
			listFollowing: listFollowing.route(),
			listTopPlaces: listTopPlaces.route(),
			updateTopPlaces: updateTopPlaces.route(),
			listActivities: listActivities.route(),
			searchFollowing: searchFollowing.route(),
			follow: follow.route(),
			update: update.route(),
			checkUsernameAvailability: checkUsernameAvailability.route(),
		});
	},
});
