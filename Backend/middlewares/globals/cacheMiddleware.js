const cache = new Map()
const TEN_MINUTES_IN_MS = 10 * 60 * 1000

const cacheMiddleware = (req, res, next) => {
    const key = req.originalUrl
    const cachedResponse = cache.get(key)

    if (cachedResponse && Date.now() < cachedResponse.expiresAt) {
        return res
            .status(cachedResponse.statusCode)
            .json(cachedResponse.body)
    }

    if (cachedResponse) {
        cache.delete(key)
    }

    const originalJson = res.json.bind(res)

    res.json = (body) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            cache.set(key, {
                body,
                statusCode: res.statusCode,
                expiresAt: Date.now() + TEN_MINUTES_IN_MS
            })
        }

        return originalJson(body)
    }

    next()
}

const clearCache = () => {
    cache.clear()
}

const invalidateCacheMiddleware = (req, res, next) => {
    res.on("finish", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            clearCache()
        }
    })

    next()
}

module.exports = {
    cacheMiddleware,
    clearCache,
    invalidateCacheMiddleware
}
