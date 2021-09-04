const { transports, format } = require("winston")

const timezoned = () => {
    return new Date().toLocaleString()
}

const config = {
    mysqlOptions: {
        host: 'localhost',
        user: 'root',
        password: 'parola',
        database: 'schema'
    },
    sessionOptions: {
        saveUninitialized: false,
        secret: 'GenerateSecreteHash',
        resave: false,
        cookie: {
            httpOnly: true,
            maxAge: 36000000
        }
    },
    winstonOptions: {
        level: 'silly',
        format: format.combine(
            format.timestamp({ format: timezoned }),
            format.json()
        ),
        transports: [
            new transports.Console()
        ]
    }
}

exports.get = function get () {
    return config
}