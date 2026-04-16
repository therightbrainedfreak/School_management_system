const sPayLoad = {
    success: true,
    status: 200,
    data: {
        user: {
            id: "fajsdkjfal",
            username: "fhsdkjfas",
            role: "ksjdfas"
        }
    },
    metadata: {
        server_time: Date.now(),
        version: "v1.0.0"
    }
}

const ePayLoad = {
    success: false,
    status: 401,
    error: {
        code: "AUTH_EXPIRED",
        message: "Your session has times out. Please login again."
    },
    metadata: {
        server_time: Date.now(),
        version: "v1.0.0"
    }
}

// server time default date.now() number.
// db storage is ISO8601 string.