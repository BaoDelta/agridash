exports.connection = {
  host: "localhost",
  port: 3000
};

exports.database = {
  client: "pg",
  connection: {
    host: "localhost",
    port: 5432,
    database: "[DB_URL]",
    user: "[DB_USER]",
    password: "[DB_PASSWORD]"
  }
};
