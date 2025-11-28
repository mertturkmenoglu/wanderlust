import { oc } from "@orpc/contract";
import * as dto from "./dto";

export const contract = {
  listAll: oc
    .input(dto.listAllInput)
    .output(dto.listAllOutput)
    .errors({
      UNAUTHORIZED: {},
      INTERNAL_SERVER_ERROR: {},
    })
    .route({
      path: "/lists",
      method: "GET",
      summary: "List All Lists",
      description: "Retrieve all lists for the authenticated user.",
      tags: ["Lists"],
    }),
  listPublic: oc
    .input(dto.listPublicInput)
    .output(dto.listPublicOutput)
    .errors({
      INTERNAL_SERVER_ERROR: {},
    })
    .route({
      path: "/lists/user/:username",
      method: "GET",
      summary: "List Public Lists of a User",
      description: "Retrieve all public lists of a specified user.",
      tags: ["Lists"],
    }),
  get: oc
    .input(dto.getInput)
    .output(dto.getOutput)
    .errors({
      UNAUTHORIZED: {},
      FORBIDDEN: {},
      NOT_FOUND: {},
      INTERNAL_SERVER_ERROR: {},
    })
    .route({
      path: "/lists/:id",
      method: "GET",
      summary: "Get a List",
      description: "Retrieve a specific list by its ID.",
      tags: ["Lists"],
    }),
  checkStatus: oc
    .input(dto.checkStatusInput)
    .output(dto.checkStatusOutput)
    .errors({
      UNAUTHORIZED: {},
      INTERNAL_SERVER_ERROR: {},
    })
    .route({
      path: "/lists/:id/status",
      method: "GET",
      summary: "Check List Status",
      description: "Check the status of a specific list.",
      tags: ["Lists"],
    }),
  create: oc
    .input(dto.createInput)
    .output(dto.createOutput)
    .errors({
      UNAUTHORIZED: {},
      FORBIDDEN: {},
      BAD_REQUEST: {},
      CONFLICT: {},
      UNPROCESSABLE_CONTENT: {},
      INTERNAL_SERVER_ERROR: {},
    })
    .route({
      path: "/lists",
      method: "POST",
      summary: "Create a List",
      description: "Create a new list.",
      tags: ["Lists"],
      successStatus: 201,
      successDescription: "Created",
    }),
  update: oc
    .input(dto.updateInput)
    .output(dto.updateOutput)
    .errors({
      UNAUTHORIZED: {},
      FORBIDDEN: {},
      NOT_FOUND: {},
      BAD_REQUEST: {},
      CONFLICT: {},
      UNPROCESSABLE_CONTENT: {},
      INTERNAL_SERVER_ERROR: {},
    })
    .route({
      path: "/lists/:id",
      method: "PATCH",
      summary: "Update a List",
      description: "Update an existing list.",
      tags: ["Lists"],
    }),
  delete: oc
    .input(dto.deleteInput)
    .output(dto.deleteOutput)
    .errors({
      UNAUTHORIZED: {},
      FORBIDDEN: {},
      NOT_FOUND: {},
      INTERNAL_SERVER_ERROR: {},
    })
    .route({
      path: "/lists/:id",
      method: "DELETE",
      summary: "Delete a List",
      description: "Delete a specific list by its ID.",
      tags: ["Lists"],
      successStatus: 204,
      successDescription: "No Content",
    }),
  appendItem: oc
    .input(dto.appendItemInput)
    .output(dto.appendItemOutput)
    .errors({
      UNAUTHORIZED: {},
      FORBIDDEN: {},
      NOT_FOUND: {},
      BAD_REQUEST: {},
      CONFLICT: {},
      UNPROCESSABLE_CONTENT: {},
      INTERNAL_SERVER_ERROR: {},
    })
    .route({
      path: "/lists/:id/items",
      method: "POST",
      summary: "Append Item to List",
      description: "Append a new item to an existing list.",
      tags: ["Lists"],
    }),
  updateItems: oc
    .input(dto.updateItemsInput)
    .output(dto.updateItemsOutput)
    .errors({
      UNAUTHORIZED: {},
      FORBIDDEN: {},
      NOT_FOUND: {},
      BAD_REQUEST: {},
      CONFLICT: {},
      UNPROCESSABLE_CONTENT: {},
      INTERNAL_SERVER_ERROR: {},
    })
    .route({
      path: "/lists/:id/items",
      method: "PATCH",
      summary: "Update Items in List",
      description: "Update items in an existing list.",
      tags: ["Lists"],
    }),
  removeItem: oc
    .input(dto.removeItemInput)
    .output(dto.removeItemOutput)
    .errors({
      UNAUTHORIZED: {},
      FORBIDDEN: {},
      NOT_FOUND: {},
      BAD_REQUEST: {},
      CONFLICT: {},
      UNPROCESSABLE_CONTENT: {},
      INTERNAL_SERVER_ERROR: {},
    })
    .route({
      path: "/lists/:id/items/:itemId",
      method: "DELETE",
      summary: "Remove Item from List",
      description: "Remove an item from an existing list.",
      tags: ["Lists"],
    }),
};
