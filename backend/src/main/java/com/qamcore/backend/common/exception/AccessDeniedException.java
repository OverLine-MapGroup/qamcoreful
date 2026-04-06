package com.qamcore.backend.common.exception;

import org.springframework.http.HttpStatus;

public class AccessDeniedException extends AppException {
    public AccessDeniedException(String messageKey, Object... args) {
        super(HttpStatus.FORBIDDEN, messageKey, args);
    }
}

