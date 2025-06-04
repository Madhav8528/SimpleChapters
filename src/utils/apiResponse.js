class ApiResponse {

    constructor(
        statusCode = 200,
        data,
        message
    ){

        this.statusCode = statusCode
        this.data = data
        this.message = message
    }
}

export { ApiResponse }