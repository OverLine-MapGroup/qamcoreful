package com.qamcore.backend.checkin.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateBookingUrlRequest {
    @NotBlank(message = "{validation.booking.url.notblank}")
    private String bookingUrl;
}