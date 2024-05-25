import { clerkMiddleware } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createFactory } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { authorize, getAuth, rateLimiter } from "../../middlewares";
import { Env } from "../../start";
import { validateId } from "../dto";
import { createEventSchema, updateEventSchema } from "./dto";
import * as repository from "./repository";

const factory = createFactory<Env>();

const peek = factory.createHandlers(async (c) => {
  const results = await repository.peek();

  return c.json(
    {
      data: results,
    },
    200,
  );
});

const getById = factory.createHandlers(
  zValidator("param", validateId),
  async (c) => {
    const { id } = c.req.valid("param");
    const event = await repository.getById(id);

    if (!event) {
      throw new HTTPException(404, {
        message: "Not found",
      });
    }

    return c.json(
      {
        data: event,
      },
      200,
    );
  },
);

const create = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  zValidator("json", createEventSchema),
  authorize({ type: "create-event" }),
  async (c) => {
    const dto = c.req.valid("json");

    try {
      const event = await repository.create(dto);

      return c.json(
        {
          data: event,
        },
        201,
      );
    } catch (e) {
      throw new HTTPException(500, {
        message: "Something went wrong",
      });
    }
  },
);

const update = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  zValidator("param", validateId),
  zValidator("json", updateEventSchema),
  authorize({ type: "update-event" }),
  async (c) => {
    const { id } = c.req.valid("param");
    const dto = c.req.valid("json");

    const event = await repository.update(id, dto);

    if (!location) {
      throw new HTTPException();
    }

    return c.json(
      {
        data: event,
      },
      200,
    );
  },
);

const deleteEvent = factory.createHandlers(
  clerkMiddleware(),
  getAuth,
  zValidator("param", validateId),
  authorize({ type: "delete-event" }),
  async (c) => {
    const { id } = c.req.valid("param");
    const event = await repository.deleteEvent(id);

    if (!event) {
      throw new HTTPException(404, {
        message: "Not found",
      });
    }

    return c.json(
      {
        data: event,
      },
      200,
    );
  },
);

export const eventsRouter = new Hono()
  .use(rateLimiter())
  .get("/peek", ...peek)
  .get("/:id", ...getById)
  .post("/", ...create)
  .patch("/:id", ...update)
  .delete("/:id", ...deleteEvent);
