const logger = (req, res, next) => {
    const { url, ip, method } = req

    console.log(
        `[${new Date().toISOString()}] Requested ${url} from ip ${ip} with method ${method}`
    )

    next()
}

module.exports = logger