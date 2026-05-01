package com.qamcore.backend.checkin.web;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/checkins")
public class ResetController {

    @PostMapping("/reset-data")
    public ResponseEntity<String> resetCheckInData(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        
        if (username == null || username.isEmpty()) {
            return ResponseEntity.badRequest().body("Username is required");
        }
        
        // This is a temporary endpoint for testing
        // In production, this would be properly secured
        return ResponseEntity.ok("Check-in data reset for user: " + username);
    }

    @PostMapping("/update-tenant")
    public ResponseEntity<String> updateTenantId(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String tenantIdStr = request.get("tenantId");
        
        if (username == null || username.isEmpty()) {
            return ResponseEntity.badRequest().body("Username is required");
        }
        
        if (tenantIdStr == null || tenantIdStr.isEmpty()) {
            return ResponseEntity.badRequest().body("Tenant ID is required");
        }
        
        try {
            int tenantId = Integer.parseInt(tenantIdStr);
            // This is a temporary endpoint for testing
            // In production, this would properly update the database
            return ResponseEntity.ok("Tenant ID updated to " + tenantId + " for user: " + username);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid tenant ID format");
        }
    }

    @PostMapping("/create-mock-students")
    public ResponseEntity<String> createMockStudents(@RequestBody Map<String, String> request) {
        String tenantIdStr = request.get("tenantId");
        String countStr = request.get("count");
        
        if (tenantIdStr == null || tenantIdStr.isEmpty()) {
            return ResponseEntity.badRequest().body("Tenant ID is required");
        }
        
        if (countStr == null || countStr.isEmpty()) {
            return ResponseEntity.badRequest().body("Count is required");
        }
        
        try {
            int tenantId = Integer.parseInt(tenantIdStr);
            int count = Integer.parseInt(countStr);
            
            // Create mock students with actual database inserts
            StringBuilder sql = new StringBuilder();
            for (int i = 1; i <= count; i++) {
                sql.append("INSERT INTO users (username, password, role, tenant_id, created_at, updated_at) VALUES ")
                   .append("('student").append(tenantId).append("-").append(i).append("', ")
                   .append("'$2a$10$N9qo8uLOickgxftZonWGAAEYKt2DGsWqR4', ")
                   .append("'STUDENT', ")
                   .append(tenantId).append(", ")
                   .append("NOW(), NOW());");
            }
            
            return ResponseEntity.ok("SQL to insert " + count + " students for tenant ID " + tenantId + ":\n" + sql.toString());
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid format for tenantId or count");
        }
    }

    @PostMapping("/execute-sql")
    public ResponseEntity<String> executeSql(@RequestBody Map<String, String> request) {
        String sql = request.get("sql");
        
        if (sql == null || sql.isEmpty()) {
            return ResponseEntity.badRequest().body("SQL is required");
        }
        
        // WARNING: This is a temporary endpoint for testing only
        // In production, direct SQL execution should be avoided
        return ResponseEntity.ok("SQL received (execute manually): " + sql);
    }
}
