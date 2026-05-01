package com.qamcore.backend.common.config;

import com.qamcore.backend.common.context.TenantContext; // Убедись, что создал этот класс ранее!
import com.qamcore.backend.iam.model.User;
import com.qamcore.backend.iam.service.security.CustomUserDetailsService;
import com.qamcore.backend.iam.service.security.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            final String authHeader = request.getHeader("Authorization");
            final String jwt;
            final String username;
            Long tenantId = null;
            String role = null;

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            try {
                jwt = authHeader.substring(7);

                if (!jwt.contains(".")) {
                    filterChain.doFilter(request, response);
                    return;
                }

                username = jwtService.extractUserName(jwt);
                tenantId = jwtService.extractTenantId(jwt);
                role = jwtService.extractRole(jwt);
            } catch (Exception e) {
                System.out.println("DEBUG JWT: Token parsing failed: " + e.getClass().getSimpleName() + " - " + e.getMessage());
                filterChain.doFilter(request, response);
                return;
            }

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                System.out.println("DEBUG JWT: Processing token for username: " + username);
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                System.out.println("DEBUG JWT: Loaded user: " + (userDetails != null ? userDetails.getUsername() : "null"));
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    System.out.println("DEBUG JWT: Token is valid");
                    // Validate that role from JWT matches user's role in database
                    if (userDetails instanceof User customUser) {
                        String jwtRole = jwtService.extractRole(jwt);
                        String userRole = customUser.getRole().name();
                        // Normalize both roles to uppercase to avoid case sensitivity issues
                        if (!jwtRole.equalsIgnoreCase(userRole)) {
                            System.out.println("DEBUG JWT: Role mismatch - JWT: " + jwtRole + ", User: " + userRole);
                            filterChain.doFilter(request, response);
                            return;
                        }
                    }
                        
                    // Create authorities from JWT token role to ensure consistency
                    // Only proceed if role is not null to prevent 500 errors on login
                    if (role != null) {
                        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));
                        
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                authorities
                        );

                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);

                        if (tenantId != null) {
                            TenantContext.setTenantId(tenantId);
                        }
                    }
                }
            }
            filterChain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }
}