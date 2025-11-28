import { oc } from "@orpc/contract";
import * as dto from "./dto";

export const contract = {
  list: oc
    .input(dto.listInput)
    .output(dto.listOutput)
    .errors({
      BAD_REQUEST: {},
      FORBIDDEN: {},
      UNAUTHORIZED: {},
      NOT_FOUND: {},
      CONFLICT: {},
      UNPROCESSABLE_CONTENT: {},
      INTERNAL_SERVER_ERROR: {},
    })
    .route({
      method: "GET",
      path: "/collections",
      summary: "List Collections",
      description: "Retrieve a list of collections with pagination support.",
      tags: ["Collections"],
    }),
  get: oc
    .input(dto.getInput)
    .output(dto.getOutput)
    .errors({
      BAD_REQUEST: {},
      FORBIDDEN: {},
      UNAUTHORIZED: {},
      NOT_FOUND: {},
      CONFLICT: {},
      UNPROCESSABLE_CONTENT: {},
      INTERNAL_SERVER_ERROR: {},
    })
    .route({
      method: "GET",
      path: "/collections/:id",
      summary: "Get Collection",
      description: "Retrieve a specific collection by its ID.",
      tags: ["Collections"],
    }),
  create: oc
    .input(dto.createInput)
    .output(dto.createOutput)
    .errors({
      BAD_REQUEST: {},
      FORBIDDEN: {},
      UNAUTHORIZED: {},
      NOT_FOUND: {},
      CONFLICT: {},
      UNPROCESSABLE_CONTENT: {},
      INTERNAL_SERVER_ERROR: {},
    })
    .route({
      method: "POST",
      path: "/collections",
      summary: "Create Collection",
      description: "Create a new collection.",
      tags: ["Collections"],
    }),
  delete: oc
    .input(dto.deleteInput)
    .output(dto.deleteOutput)
    .errors({
      BAD_REQUEST: {},
      FORBIDDEN: {},
      UNAUTHORIZED: {},
      NOT_FOUND: {},
      CONFLICT: {},
      UNPROCESSABLE_CONTENT: {},
      INTERNAL_SERVER_ERROR: {},
    })
    .route({
      method: "DELETE",
      path: "/collections/:id",
      summary: "Delete Collection",
      description: "Delete a specific collection by its ID.",
      tags: ["Collections"],
    }),
  update: oc
    .input(dto.updateInput)
    .output(dto.updateOutput)
    .errors({
      BAD_REQUEST: {},
      FORBIDDEN: {},
      UNAUTHORIZED: {},
      NOT_FOUND: {},
      CONFLICT: {},
      UNPROCESSABLE_CONTENT: {},
      INTERNAL_SERVER_ERROR: {},
    })
    .route({
      method: "PATCH",
      path: "/collections/:id",
      summary: "Update Collection",
      description: "Update a specific collection by its ID.",
      tags: ["Collections"],
    }),
  appendItem: oc
    .input(dto.appendItemInput)
    .output(dto.appendItemOutput)
    .errors({
      BAD_REQUEST: {},
      FORBIDDEN: {},
      UNAUTHORIZED: {},
      NOT_FOUND: {},
      CONFLICT: {},
      UNPROCESSABLE_CONTENT: {},
      INTERNAL_SERVER_ERROR: {},
    })
    .route({
      method: "POST",
      path: "/collections/:id/items",
      summary: "Append Item to Collection",
      description: "Append an item to a specific collection by its ID.",
      tags: ["Collections"],
    }),
  removeItem: oc
    .input(dto.removeItemInput)
    .output(dto.removeItemOutput)
    .errors({
      BAD_REQUEST: {},
      FORBIDDEN: {},
      UNAUTHORIZED: {},
      NOT_FOUND: {},
      CONFLICT: {},
      UNPROCESSABLE_CONTENT: {},
      INTERNAL_SERVER_ERROR: {},
    })
    .route({
      method: "DELETE",
      path: "/collections/:id/items/:placeId",
      summary: "Remove Item from Collection",
      description: "Remove an item from a specific collection by its ID.",
      tags: ["Collections"],
    }),
  reorderItems: oc
    .input(dto.reorderItemsInput)
    .output(dto.reorderItemsOutput)
    .errors({
      BAD_REQUEST: {},
      FORBIDDEN: {},
      UNAUTHORIZED: {},
      NOT_FOUND: {},
      CONFLICT: {},
      UNPROCESSABLE_CONTENT: {},
      INTERNAL_SERVER_ERROR: {},
    })
    .route({
      method: "PATCH",
      path: "/collections/:id/items",
      summary: "Reorder Items in Collection",
      description: "Reorder items in a specific collection by its ID.",
      tags: ["Collections"],
    }),
  createPlaceRelation: oc
    .input(dto.createPlaceRelationInput)
    .output(dto.createPlaceRelationOutput)
    .errors({
      BAD_REQUEST: {},
      FORBIDDEN: {},
      UNAUTHORIZED: {},
      NOT_FOUND: {},
      CONFLICT: {},
      UNPROCESSABLE_CONTENT: {},
      INTERNAL_SERVER_ERROR: {},
    })
    .route({
      method: "POST",
      path: "/collections/:id/places",
      summary: "Create Place Relation",
      description: "Create a relation between a collection and a place.",
      tags: ["Collections"],
    }),
  deletePlaceRelation: oc
    .input(dto.deletePlaceRelationInput)
    .output(dto.deletePlaceRelationOutput)
    .errors({
      BAD_REQUEST: {},
      FORBIDDEN: {},
      UNAUTHORIZED: {},
      NOT_FOUND: {},
      CONFLICT: {},
      UNPROCESSABLE_CONTENT: {},
      INTERNAL_SERVER_ERROR: {},
    })
    .route({
      method: "DELETE",
      path: "/collections/:id/places/:placeId",
      summary: "Delete Place Relation",
      description: "Delete a relation between a collection and a place.",
      tags: ["Collections"],
    }),
  createCityRelation: oc
    .input(dto.createCityRelationInput)
    .output(dto.createCityRelationOutput)
    .errors({
      BAD_REQUEST: {},
      FORBIDDEN: {},
      UNAUTHORIZED: {},
      NOT_FOUND: {},
      CONFLICT: {},
      UNPROCESSABLE_CONTENT: {},
      INTERNAL_SERVER_ERROR: {},
    })
    .route({
      method: "POST",
      path: "/collections/:id/cities",
      summary: "Create City Relation",
      description: "Create a relation between a collection and a city.",
      tags: ["Collections"],
    }),
  deleteCityRelation: oc
    .input(dto.deleteCityRelationInput)
    .output(dto.deleteCityRelationOutput)
    .errors({
      BAD_REQUEST: {},
      FORBIDDEN: {},
      UNAUTHORIZED: {},
      NOT_FOUND: {},
      CONFLICT: {},
      UNPROCESSABLE_CONTENT: {},
      INTERNAL_SERVER_ERROR: {},
    })
    .route({
      method: "DELETE",
      path: "/collections/:id/cities/:cityId",
      summary: "Delete City Relation",
      description: "Delete a relation between a collection and a city.",
      tags: ["Collections"],
    }),
  listByPlaceId: oc
    .input(dto.listByPlaceIdInput)
    .output(dto.listByPlaceIdOutput)
    .errors({
      BAD_REQUEST: {},
      FORBIDDEN: {},
      UNAUTHORIZED: {},
      NOT_FOUND: {},
      CONFLICT: {},
      UNPROCESSABLE_CONTENT: {},
      INTERNAL_SERVER_ERROR: {},
    })
    .route({
      method: "GET",
      path: "/collections/place/:placeId",
      summary: "List Collections by Place ID",
      description:
        "Retrieve all collections associated with a specific place ID.",
      tags: ["Collections"],
    }),
  listByCityId: oc
    .input(dto.listByCityIdInput)
    .output(dto.listByCityIdOutput)
    .errors({
      BAD_REQUEST: {},
      FORBIDDEN: {},
      UNAUTHORIZED: {},
      NOT_FOUND: {},
      CONFLICT: {},
      UNPROCESSABLE_CONTENT: {},
      INTERNAL_SERVER_ERROR: {},
    })
    .route({
      method: "GET",
      path: "/collections/city/:cityId",
      summary: "List Collections by City ID",
      description:
        "Retrieve all collections associated with a specific city ID.",
      tags: ["Collections"],
    }),
  listAllPlaceCollections: oc
    .input(dto.listAllPlaceCollectionsInput)
    .output(dto.ListAllPlaceCollectionsOutput)
    .errors({
      BAD_REQUEST: {},
      FORBIDDEN: {},
      UNAUTHORIZED: {},
      NOT_FOUND: {},
      CONFLICT: {},
      UNPROCESSABLE_CONTENT: {},
      INTERNAL_SERVER_ERROR: {},
    })
    .route({
      method: "GET",
      path: "/collections/place",
      summary: "List All Place Collections",
      description: "Retrieve all collections associated with any place.",
      tags: ["Collections"],
    }),
  listAllCityCollections: oc
    .input(dto.ListAllCityCollectionsInput)
    .output(dto.ListAllCityCollectionsOutput)
    .errors({
      BAD_REQUEST: {},
      FORBIDDEN: {},
      UNAUTHORIZED: {},
      NOT_FOUND: {},
      CONFLICT: {},
      UNPROCESSABLE_CONTENT: {},
      INTERNAL_SERVER_ERROR: {},
    })
    .route({
      method: "GET",
      path: "/collections/city",
      summary: "List All City Collections",
      description: "Retrieve all collections associated with any city.",
      tags: ["Collections"],
    }),
};
