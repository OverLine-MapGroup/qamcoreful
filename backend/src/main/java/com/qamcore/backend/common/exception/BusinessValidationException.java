package com.qamcore.backend.common.exception;

import org.springframework.http.HttpStatus;

public class BusinessValidationException extends AppException {
    public BusinessValidationException(String messageKey, Object... args) {
        super(HttpStatus.BAD_REQUEST, messageKey, args);
    }
}

