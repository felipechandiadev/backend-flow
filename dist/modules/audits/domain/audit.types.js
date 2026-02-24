"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditActionType = void 0;
var AuditActionType;
(function (AuditActionType) {
    AuditActionType["CREATE"] = "CREATE";
    AuditActionType["UPDATE"] = "UPDATE";
    AuditActionType["DELETE"] = "DELETE";
    AuditActionType["LOGIN_SUCCESS"] = "LOGIN_SUCCESS";
    AuditActionType["LOGIN_FAILED"] = "LOGIN_FAILED";
    AuditActionType["LOGOUT"] = "LOGOUT";
    AuditActionType["PASSWORD_CHANGE"] = "PASSWORD_CHANGE";
    AuditActionType["PASSWORD_RESET"] = "PASSWORD_RESET";
    AuditActionType["PERMISSION_GRANTED"] = "PERMISSION_GRANTED";
    AuditActionType["PERMISSION_REVOKED"] = "PERMISSION_REVOKED";
})(AuditActionType || (exports.AuditActionType = AuditActionType = {}));
//# sourceMappingURL=audit.types.js.map