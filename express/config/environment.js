const data = {
    env: "production",
    port: 80,
    timezone: "America/Denver",
    server_timezone: "UTC",
    sql: {
        url: "TODO",
    },
    jwt: {
        secret: "qZR2wNUmI5H_2KVUpLk9MZngqVXdNLXpD0nT9SsY4KhZiHWJt4XEk-q72diBXsDRANNckLCnr5EY_t7-2rjzm9TXkItp3mte6cdjLDpj7pCMcUNxclrjrw71Sd9gzODI3te33XThVntCa",
    },
    allowedOrigins: [
        "http://localhost:4000",
        "http://localhost:5173",
        "http://auction.danielsjunk.com",
    ],
    session: {
        secret: "put something here",
    },
    endpoint: {
        production: {
            web: "http://auction.danielsjunk.com",
        },
        local: {
            web: "http://localhost:5173",
        },
    },
    db: {
        name: "",
        port: "",
        host: "",
        user: "",
        password: "",
        socket: "",
    },
};

export default data;
