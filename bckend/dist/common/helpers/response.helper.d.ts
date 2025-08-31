export declare class ApiResultResponse {
    static success(message: string, statusCode?: number, resultData?: any, success?: boolean): {
        status: boolean;
        statusCode: number;
        message: string;
        resultData: any;
        success: boolean;
    };
    static error(message: string, statusCode?: number, errors?: any, success?: boolean): {
        status: boolean;
        statusCode: number;
        message: string;
        errors: any;
        success: boolean;
    };
}
