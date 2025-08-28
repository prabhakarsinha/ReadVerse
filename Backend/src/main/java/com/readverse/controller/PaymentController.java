package com.readverse.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import com.readverse.dto.BookLicenseReqDTO;
import com.readverse.service.BookLicenseService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@RestController
@RequestMapping("/api/payment")
@NoArgsConstructor
@AllArgsConstructor
public class PaymentController {
	@Value("${razorpay.key_id}")
	private String keyId;

	@Value("${razorpay.key_secret}")
	private String keySecret;

	@Value("${razorpay.webhook_secret}")
	private String webhookSecret;
	
	@Autowired
	private  BookLicenseService bookLicenseService;

	// Create order
	@PostMapping("/create-order")
	public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Object> data) throws Exception {
		RazorpayClient client = new RazorpayClient(keyId, keySecret);

		JSONObject options = new JSONObject();
		options.put("amount", ((Integer) data.get("amount")) * 100); // in paise
		options.put("currency", "INR");
		String shortUuid = UUID.randomUUID().toString().replace("-", "").substring(0, 12);
		options.put("receipt", "rcpt_" + shortUuid); // ~17 chars total
		JSONObject notes = new JSONObject();
		notes.put("userId", data.get("userId"));
		notes.put("bookId", data.get("bookId"));
		options.put("notes", notes);
		Order order = client.orders.create(options);

		Map<String, Object> response = new HashMap<>();
		response.put("id", order.get("id"));
		response.put("currency", order.get("currency"));
		response.put("amount", order.get("amount"));

		return ResponseEntity.ok(response);
	}

	// web hook
	@PostMapping("/webhook")
	public ResponseEntity<String> handleWebhook(HttpServletRequest request) throws IOException {
		String payload = request.getReader().lines().collect(Collectors.joining());
		String signature = request.getHeader("X-Razorpay-Signature");

		try {
			boolean isValid = Utils.verifyWebhookSignature(payload, signature, webhookSecret);
			if (isValid) {
				JSONObject webhookData = new JSONObject(payload);
		        JSONObject notes = webhookData
		                .getJSONObject("payload")
		                .getJSONObject("payment")
		                .getJSONObject("entity")
		                .getJSONObject("notes");
				System.out.println("✅ Payment Verified");
				 Long userId = notes.getLong("userId");
			        Long bookId = notes.getLong("bookId");
			     //BookLicenseReqDTO dto=  
			    		 
			   //  dto.setBookId(
			        bookLicenseService.createLicenseForPurchase(new BookLicenseReqDTO(bookId), userId);
				
			} else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Webhook error");
		}
		return ResponseEntity.ok("Webhook received");
	}
}
