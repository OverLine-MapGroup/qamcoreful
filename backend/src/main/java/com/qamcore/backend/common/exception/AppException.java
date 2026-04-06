package com.qamcore.backend.common.exception;

import org.springframework.http.HttpStatus;

public abstract class AppException extends RuntimeException {
    private final HttpStatus status;
    private final String messageKey;
    private final Object[] messageArgs;

    protected AppException(HttpStatus status, String messageKey, Object... messageArgs) {
        super(messageKey);
        this.status = status;
        this.messageKey = messageKey;
        this.messageArgs = messageArgs == null ? new Object[0] : messageArgs;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getMessageKey() {
        return messageKey;
    }

    public Object[] getMessageArgs() {
        return messageArgs;
    }
}

