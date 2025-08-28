package com.readverse.security;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class CustomJwtFilter extends OncePerRequestFilter {

	private final JwtUtils jwtUtils;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		// 1.check for request header - Authorization

		String headerValue = request.getHeader("Authorization");
		try {
			if (headerValue != null && headerValue.startsWith("Bearer")) {
				// 2. if it exits extract JWt
				String jwt = headerValue.substring(7);
				// 3. validate token n get the populate authentication object
				Authentication authentication = jwtUtils.populateAuthenticationTokenFromJWT(jwt);

				// 4. store this auth obj under spring security context holder
				SecurityContextHolder.getContext().setAuthentication(authentication);

			}
			// pass the contorl to the next filter in filter chain
			filterChain.doFilter(request, response);
		} catch (ExpiredJwtException e) {

			sendErrorResponse(response, "Token expired", HttpServletResponse.SC_UNAUTHORIZED);
		} catch (MalformedJwtException e) {

			sendErrorResponse(response, "Malformed token", HttpServletResponse.SC_BAD_REQUEST);
		} catch (SignatureException e) {

			sendErrorResponse(response, "Invalid token signature", HttpServletResponse.SC_UNAUTHORIZED);
		} catch (IllegalArgumentException e) {

			sendErrorResponse(response, "Invalid token", HttpServletResponse.SC_BAD_REQUEST);
		} catch (Exception e) {

			sendErrorResponse(response, "Authentication failed", HttpServletResponse.SC_UNAUTHORIZED);
		}

	}

	private void sendErrorResponse(HttpServletResponse response, String message, int status) throws IOException {
		response.setStatus(status);
		response.setContentType("application/json");
		response.getWriter().write("{\"error\": \"" + message + "\"}");
	}

}
