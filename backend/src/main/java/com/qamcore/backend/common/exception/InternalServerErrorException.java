package com.qamcore.backend.common.exception;

import org.springframework.http.HttpStatus;

public class InternalServerErrorException extends AppException {
    public InternalServerErrorException(String messageKey, Object... args) {
        super(HttpStatus.INTERNAL_SERVER_ERROR, messageKey, args);
    }
}

