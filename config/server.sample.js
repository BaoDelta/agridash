exports.connection = {
  host: "0.0.0.0",
  port: 7000
};

exports.devPort = 7070;

exports.database = {
  client: "pg",
  connection: {
    host: "[DB_HOST]",
    database: "[DB_URL]",
    user: "[DB_USER]",
    password: "[DB_PASSWORD]"
  }
};
