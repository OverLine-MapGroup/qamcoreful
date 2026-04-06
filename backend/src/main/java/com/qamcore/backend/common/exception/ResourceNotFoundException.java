package com.qamcore.backend.common.exception;

import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends AppException {
    public ResourceNotFoundException(String messageKey, Object... args) {
        super(HttpStatus.NOT_FOUND, messageKey, args);
    }
}

