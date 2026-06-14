const responseTimerMiddleware = (req, res, next) => {
    const startTime = Date.now()

    res.on("finish", () => {
        const endTime = Date.now()
        const elapsedTime = endTime - startTime

        console.log(
            `${req.method} ${req.url} - ${elapsedTime} milliseconds`
        )
    })

    next()
}

module.exports = responseTimerMiddleware