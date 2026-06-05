export const onRequestGet: PagesFunction = () =>
  Response.json({
    status: "ok",
    service: "cursor-training-api",
    stream: "baseline",
  });
