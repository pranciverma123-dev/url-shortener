
// const redis = require("redis");

// const client = redis.createClient({
//   socket: {
//     host: "127.0.0.1",
//     port: 6380
//   }
// });

// client.connect();

// module.exports = client;
const redisClient = {
  get: async () => null,
  set: async () => {},
  del: async () => {},
};

module.exports = redisClient;