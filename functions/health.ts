export const onRequestGet: PagesFunction = () =>
  Response.json({
    status: "ok",
    service: "cursor-training-api",
    streams: ["baseline", "lenstemper", "superpowers"],
    apps: {
      baseline: "/apps/training/baseline/",
      lenstemper: "/apps/training/lenstemper/",
      superpowers: "/apps/training/superpowers/",
    },
  });
