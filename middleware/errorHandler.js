// export const errorHandler = (req, res, next) => {
//     const errorStatus = err.status || 500;
//     const errorMessage = err.message || "Something went wrong!"
//     return res.status(errorStatus).json({
//         success: false,
//         status: errorStatus,
//         message: errorMessage,
//         stack: err.stack
//     })
// }

export const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500

    res.status(statusCode)

    const message = err.message.indexOf('Cast to ObjectId failed') !== -1 ? "Data was not found" : err.message

    res.json({
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack

    })
}