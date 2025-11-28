import { oc } from "@orpc/contract";
import * as dto from "./dto";

export const contract = {
  list: oc
    .input(dto.listInput)
    .output(dto.listOutput)
    .errors({
      INTERNAL_SERVER_ERROR: {},
    })
    .route({
      path: "/categories",
      method: "GET",
      description: "List all categories",
      summary: "List all categories",
      tags: ["Categories"],
    }),
  create: oc
    .input(dto.createInput)
    .output(dto.createOutput)
    .errors({
      BAD_REQUEST: {},
      UNAUTHORIZED: {},
      FORBIDDEN: {},
      CONFLICT: {},
      UNPROCESSABLE_CONTENT: {},
      INTERNAL_SERVER_ERROR: {},
    })
    .route({
      path: "/categories",
      method: "POST",
      description: "Create a new category",
      summary: "Create a new category",
      tags: ["Categories"],
      successStatus: 201,
      successDescription: "Created",
    }),
  update: oc
    .input(dto.updateInput)
    .output(dto.updateOutput)
    .errors({
      BAD_REQUEST: {},
      UNAUTHORIZED: {},
      FORBIDDEN: {},
      NOT_FOUND: {},
      CONFLICT: {},
      UNPROCESSABLE_CONTENT: {},
      INTERNAL_SERVER_ERROR: {},
    })
    .route({
      path: "/categories/:id",
      method: "PATCH",
      description: "Update an existing category",
      summary: "Update an existing category",
      tags: ["Categories"],
      successStatus: 200,
      successDescription: "Updated",
    }),
  delete: oc
    .input(dto.deleteInput)
    .output(dto.deleteOutput)
    .errors({
      BAD_REQUEST: {},
      UNAUTHORIZED: {},
      FORBIDDEN: {},
      NOT_FOUND: {},
      CONFLICT: {},
      UNPROCESSABLE_CONTENT: {},
      INTERNAL_SERVER_ERROR: {},
    })
    .route({
      path: "/categories/:id",
      method: "DELETE",
      description: "Delete an existing category",
      summary: "Delete an existing category",
      tags: ["Categories"],
      successStatus: 204,
      successDescription: "No Content",
    }),
};
