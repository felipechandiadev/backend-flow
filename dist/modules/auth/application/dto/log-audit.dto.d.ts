export declare class LogAuditDto {
    userName: string;
    action: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'LOGOUT';
    userId?: string;
    details?: string;
}
