import type { Agent } from './agent';
import { client, withContext } from './orpc';
import { $, logged } from './utils';
import { usernames } from './well-known';

export class Actions {
	@logged
	async accolades_list(agent: Agent) {
		await client.accolades.list({}, withContext(agent.getToken()));
	}

	@logged
	async accolades_get(agent: Agent) {
		const res = await client.accolades.list({}, withContext(agent.getToken()));
		const accolade = $.Random.element(res.accolades);
		await client.accolades.get(
			{ id: accolade.id },
			withContext(agent.getToken()),
		);
	}

	@logged
	async accolades_getPlaces(agent: Agent) {
		const res = await client.accolades.list({}, withContext(agent.getToken()));
		const accolade = $.Random.element(res.accolades);
		await client.accolades.getPlaces(
			{
				id: accolade.id,
			},
			withContext(agent.getToken()),
		);
	}

	@logged
	async aggregator_home(agent: Agent) {
		await client.aggregator.home({}, withContext(agent.getToken()));
	}

	@logged
	async amenities_list(agent: Agent) {
		await client.amenities.list({}, withContext(agent.getToken()));
	}

	@logged
	async bookmarks_list(agent: Agent) {
		await client.bookmarks.list({}, withContext(agent.getToken()));
	}

	@logged
	async bookmarks_create(agent: Agent) {
		agent.getLogger().info('Not implemented: bookmarks_create');
	}

	@logged
	async bookmarks_delete(agent: Agent) {
		agent.getLogger().info('Not implemented: bookmarks_delete');
	}

	@logged
	async categories_get(agent: Agent) {
		const res = await client.categories.list({}, withContext(agent.getToken()));
		const category = $.Random.element(res.categories);
		await client.categories.get(
			{ id: category.id },
			withContext(agent.getToken()),
		);
	}

	@logged
	async categories_list(agent: Agent) {
		await client.categories.list({}, withContext(agent.getToken()));
	}

	@logged
	async cities_list(agent: Agent) {
		await client.cities.list({}, withContext(agent.getToken()));
	}

	@logged
	async cities_listFeatured(agent: Agent) {
		await client.cities.listFeatured({}, withContext(agent.getToken()));
	}

	@logged
	async cities_get(agent: Agent) {
		const res = await client.cities.list({}, withContext(agent.getToken()));
		const city = $.Random.element(res.cities);
		await client.cities.get({ id: city.id }, withContext(agent.getToken()));
	}

	@logged
	async collections_get(agent: Agent) {
		const res = await client.collections.list(
			{},
			withContext(agent.getToken()),
		);
		const collection = $.Random.element(res.collections);
		await client.collections.get(
			{ id: collection.id },
			withContext(agent.getToken()),
		);
	}

	@logged
	async collections_list(agent: Agent) {
		await client.collections.list({}, withContext(agent.getToken()));
	}

	@logged
	async collections_placesList(agent: Agent) {
		const res = await client.places.list({}, withContext(agent.getToken()));
		const place = $.Random.element(res.places);
		await client.collections.places.list(
			{ placeId: place.id },
			withContext(agent.getToken()),
		);
	}

	@logged
	async collections_citiesList(agent: Agent) {
		const res = await client.cities.list({}, withContext(agent.getToken()));
		const city = $.Random.element(res.cities);
		await client.collections.cities.list(
			{ cityId: city.id },
			withContext(agent.getToken()),
		);
	}

	@logged
	async favorites_list(agent: Agent) {
		await client.favorites.list({}, withContext(agent.getToken()));
	}

	@logged
	async favorites_create(agent: Agent) {
		agent.getLogger().info('Not implemented: favorites_create');
	}

	@logged
	async favorites_delete(agent: Agent) {
		agent.getLogger().info('Not implemented: favorites_delete');
	}

	@logged
	async favorites_listByUsername(agent: Agent) {
		await client.favorites.listByUsername(
			{ username: $.Random.element(usernames) },
			withContext(agent.getToken()),
		);
	}

	@logged
	async getMe(agent: Agent) {
		await client.users.getMe({}, withContext(agent.getToken()));
	}
}
