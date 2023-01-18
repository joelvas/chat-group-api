class ApiResponse {
    constructor(success, message) {
        this.success = success;
        this.message = message;
    }
    setSuccess(success) {
        this.success = success;
    }
    getSuccess() {
        return this.success;
    }
    setMessage(message) {
        this.message = message;
    }
    getMessage() {
        return this.message;
    }
}
export default ApiResponse;
