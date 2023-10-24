export const wrap = (expressMiddleware) => (socket, next) => {
  socket.request.is = (urlEncoded) => urlEncoded === "urlencoded";
  return expressMiddleware(socket.request, {}, next);
};
