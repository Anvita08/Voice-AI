export interface AIRequest {
    userId: string;
    message: string;
}

export interface AIResponse {
    responseId: string;
    message: string;
    timestamp: Date;
}