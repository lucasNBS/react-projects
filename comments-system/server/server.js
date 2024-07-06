import fastify from "fastify";
import sensible from "@fastify/sensible";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import cookie from "@fastify/cookie";
import dotenv from "dotenv";
dotenv.config();

const app = fastify();
const db = new PrismaClient();

app.register(sensible);
app.register(cookie, { secret: process.env.COOKIE_SECRET });
app.register(cors, {
  origin: "http://localhost:3000",
  credentials: true,
});

const CURRENT_USER_ID = (await db.user.findFirst({ where: { name: "Kyle" } }))
  .id;

app.addHook("onRequest", (req, res, done) => {
  if (req.cookies.userId !== CURRENT_USER_ID) {
    req.cookies.userId = CURRENT_USER_ID;
    res.clearCookie("userId");
    res.setCookie("userId", CURRENT_USER_ID);
  }
  done();
});

const COMMENT_SELECT_FIELDS = {
  id: true,
  message: true,
  parentId: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      name: true,
    },
  },
};

app.get("/posts", async (req, res) => {
  return await commitToDb(
    db.post.findMany({
      select: {
        id: true,
        title: true,
      },
    })
  );
});

app.get("/posts/:id", async (req, res) => {
  return await commitToDb(
    db.post
      .findUnique({
        where: {
          id: req.params.id,
        },
        select: {
          title: true,
          body: true,
          comments: {
            orderBy: {
              createdAt: "desc",
            },
            select: {
              ...COMMENT_SELECT_FIELDS,
              _count: { select: { likes: true } },
            },
          },
        },
      })
      .then(async (post) => {
        const likes = await db.like.findMany({
          where: {
            userId: req.cookies.userId,
            commentId: {
              in: post.comments.map((comment) => comment.id),
            },
          },
        });

        return {
          ...post,
          comments: post.comments.map((comment) => {
            const { _count, ...commentFields } = comment;

            return {
              ...commentFields,
              likedByMe: likes.find((like) => like.commentId === comment.id),
              likeCount: _count.likes,
            };
          }),
        };
      })
  );
});

app.post("/posts/:id/comments", async (req, res) => {
  if (req.body.message === "" || req.body.message == null) {
    return res.send(app.httpErrors.badRequest("Message is required"));
  }

  return await commitToDb(
    db.comment
      .create({
        data: {
          message: req.body.message,
          userId: req.cookies.userId,
          parentId: req.body.parentId,
          postId: req.params.id,
        },
        select: COMMENT_SELECT_FIELDS,
      })
      .then((comment) => {
        return {
          ...comment,
          likeCount: 0,
          likedByMe: false,
        };
      })
  );
});

app.put("/posts/:postId/comments/:commentId", async (req, res) => {
  if (req.body.message === "" || req.body.message == null) {
    return res.send(app.httpErrors.badRequest("Message is required"));
  }

  const { userId } = await db.comment.findUnique({
    where: {
      id: req.params.commentId,
    },
    select: { userId: true },
  });

  if (userId !== req.cookies.userId) {
    return res.send(
      app.httpErrors.unauthorized(
        "You do not have permission to perform this action"
      )
    );
  }

  return await commitToDb(
    db.comment.update({
      where: { id: req.params.commentId },
      data: {
        message: req.body.message,
      },
      select: {
        message: true,
      },
    })
  );
});

app.delete("/posts/:postId/comments/:commentId", async (req, res) => {
  const { userId } = await db.comment.findUnique({
    where: {
      id: req.params.commentId,
    },
    select: { userId: true },
  });

  if (userId !== req.cookies.userId) {
    return res.send(
      app.httpErrors.unauthorized(
        "You do not have permission to perform this action"
      )
    );
  }

  return await commitToDb(
    db.comment.delete({
      where: { id: req.params.commentId },
      select: { id: true },
    })
  );
});

app.post("/posts/:postId/comments/:commentId/toggleLike", async (req, res) => {
  const data = {
    commentId: req.params.commentId,
    userId: req.cookies.userId,
  };

  const like = await db.like.findUnique({
    where: { userId_commentId: data },
  });

  if (like == null) {
    return await commitToDb(db.like.create({ data })).then(() => {
      return { addLike: true };
    });
  } else {
    return await commitToDb(
      db.like.delete({ where: { userId_commentId: data } })
    ).then(() => {
      return { addLike: false };
    });
  }
});

async function commitToDb(promise) {
  const [error, data] = await app.to(promise);

  if (error) return app.httpErrors.internalServerError(error.message);

  return data;
}

app.listen({ port: 8000 });
