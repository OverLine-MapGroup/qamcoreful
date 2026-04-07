package com.qamcore.backend.common.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final org.slf4j.Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private final MessageSource messageSource;

    public GlobalExceptionHandler(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpServletRequest request
    ) {
        List<ApiErrorResponse.ValidationError> validationErrors = new ArrayList<>();
        ex.getBindingResult().getFieldErrors().forEach(fieldError -> {
            String field = fieldError.getField();
            String resolvedMessage = resolveMessage(fieldError.getDefaultMessage(), null);
            validationErrors.add(new ApiErrorResponse.ValidationError(field, resolvedMessage));
        });

        HttpStatus status = HttpStatus.BAD_REQUEST;
        ApiErrorResponse body = new ApiErrorResponse(
                LocalDateTime.now(),
                status.value(),
                status.getReasonPhrase(),
                resolveMessage("error.validation.failed", null),
                request.getRequestURI(),
                validationErrors
        );

        log.warn("Validation failed: {} {}", request.getMethod(), request.getRequestURI());
        return ResponseEntity.status(status).body(body);
    }

    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    public ResponseEntity<ApiErrorResponse> handleBadRequest(
            RuntimeException ex,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.BAD_REQUEST;

        String message = resolveMessage(ex.getMessage(), null);
        ApiErrorResponse body = new ApiErrorResponse(
                LocalDateTime.now(),
                status.value(),
                status.getReasonPhrase(),
                message,
                request.getRequestURI(),
                null
        );

        log.warn("Business error (400) {} {}: {}", request.getMethod(), request.getRequestURI(), ex.getMessage());
        return ResponseEntity.status(status).body(body);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleBadCredentials(
            BadCredentialsException ex,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.UNAUTHORIZED;
        ApiErrorResponse body = new ApiErrorResponse(
                LocalDateTime.now(),
                status.value(),
                status.getReasonPhrase(),
                "Invalid username or password",
                request.getRequestURI(),
                null
        );
        log.warn("Authentication failed (401): {}", ex.getMessage());
        return ResponseEntity.status(status).body(body);
    }

    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<ApiErrorResponse> handleForbidden(
            SecurityException ex,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.FORBIDDEN;

        String message = resolveMessage(ex.getMessage(), null);
        ApiErrorResponse body = new ApiErrorResponse(
                LocalDateTime.now(),
                status.value(),
                status.getReasonPhrase(),
                message,
                request.getRequestURI(),
                null
        );

        log.warn("Business error (403) {} {}: {}", request.getMethod(), request.getRequestURI(), ex.getMessage());
        return ResponseEntity.status(status).body(body);
    }

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiErrorResponse> handleAppException(
            AppException ex,
            HttpServletRequest request
    ) {
        HttpStatus status = ex.getStatus();
        boolean isServerError = status.is5xxServerError();

        String resolvedMessage = resolveMessage(ex.getMessageKey(), ex.getMessageArgs());
        String message = isServerError ? "Internal Server Error" : resolvedMessage;
        ApiErrorResponse body = new ApiErrorResponse(
                LocalDateTime.now(),
                status.value(),
                status.getReasonPhrase(),
                message,
                request.getRequestURI(),
                null
        );

        if (isServerError) {
            log.error("Internal server error ({}): {}", status.value(), ex.getMessageKey(), ex);
        } else {
            log.warn("Business error ({}): {}", status.value(), ex.getMessageKey());
        }

        return ResponseEntity.status(status).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleInternalServerError(
            Exception ex,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        log.error("Unhandled exception for {} {}", request.getMethod(), request.getRequestURI(), ex);

        ApiErrorResponse body = new ApiErrorResponse(
                LocalDateTime.now(),
                status.value(),
                status.getReasonPhrase(),
                "Internal Server Error",
                request.getRequestURI(),
                null
        );
        return ResponseEntity.status(status).body(body);
    }

    private String resolveMessage(String rawOrKey, Object[] args) {
        if (rawOrKey == null) {
            return null;
        }

        String candidate = rawOrKey.trim();

        if (candidate.startsWith("{") && candidate.endsWith("}") && candidate.length() > 2) {
            candidate = candidate.substring(1, candidate.length() - 1).trim();
        }

        boolean isMessageKey = candidate.startsWith("error.") || candidate.startsWith("validation.");
        if (!isMessageKey) {
            return rawOrKey;
        }

        Locale locale = LocaleContextHolder.getLocale();
        try {
            Object[] safeArgs = args == null ? new Object[0] : args;
            return messageSource.getMessage(candidate, safeArgs, locale);
        } catch (Exception ignored) {
            return candidate;
        }
    }
}

