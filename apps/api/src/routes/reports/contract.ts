import { oc } from "@orpc/contract";
import * as dto from "./dto";

export const contract = {
  get: oc
    .input(dto.getInput)
    .output(dto.getOutput)
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
      method: "GET",
      path: "/reports/:id",
      summary: "Get Report",
      description: "Retrieve a specific report by its ID.",
      tags: ["Reports"],
    }),
  list: oc
    .input(dto.listInput)
    .output(dto.listOutput)
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
      method: "GET",
      path: "/reports",
      summary: "List Reports",
      description: "Retrieve a list of reports.",
      tags: ["Reports"],
    }),
  search: oc
    .input(dto.searchInput)
    .output(dto.searchOutput)
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
      method: "GET",
      path: "/reports/search",
      summary: "Search Reports",
      description: "Search for reports based on query parameters.",
      tags: ["Reports"],
    }),
  create: oc
    .input(dto.createInput)
    .output(dto.createOutput)
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
      method: "POST",
      path: "/reports",
      summary: "Create Report",
      description: "Create a new report.",
      tags: ["Reports"],
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
      method: "PATCH",
      path: "/reports/:id",
      summary: "Update Report",
      description: "Update an existing report.",
      tags: ["Reports"],
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
      method: "DELETE",
      path: "/reports/:id",
      summary: "Delete Report",
      description: "Delete a specific report by its ID.",
      tags: ["Reports"],
    }),
};
