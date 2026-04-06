package com.qamcore.backend.checkin.repository;

import com.qamcore.backend.checkin.model.BookingEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingEventRepository extends JpaRepository<BookingEvent, Long> {
}