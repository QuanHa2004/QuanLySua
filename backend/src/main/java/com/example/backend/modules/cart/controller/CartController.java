package com.example.backend.modules.cart.controller;

import com.example.backend.modules.cart.dto.request.CartRequest;
import com.example.backend.modules.cart.dto.request.CartStatusRequest;
import com.example.backend.modules.cart.dto.response.CartResponse;
import com.example.backend.modules.cart.service.CartService;
import com.example.backend.modules.user.api.UserInternalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/customer/carts")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final UserInternalService userInternalService;

    private Integer getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        return userInternalService.getUserIdByEmail(email);
    }

    @GetMapping("/current_user")
    public ResponseEntity<?> getMyCart() {
        try {
            Integer userId = getCurrentUserId();
            List<CartResponse> items = cartService.getCartItems(userId);

            return ResponseEntity.ok(Map.of("items", items));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody CartRequest request) {
        try {
            Integer userId = getCurrentUserId();
            cartService.addToCart(userId, request);

            return ResponseEntity.ok(Map.of("message", "Thêm vào giỏ thành công"));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateQuantity(@RequestBody CartRequest request) {
        try {
            Integer userId = getCurrentUserId();
            cartService.updateQuantity(userId, request);

            return ResponseEntity.ok(Map.of("message", "Cập nhật thành công"));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/remove")
    public ResponseEntity<?> removeFromCart(@RequestBody CartRequest request) {
        try {
            Integer userId = getCurrentUserId();
            cartService.removeFromCart(userId, request);

            return ResponseEntity.ok(Map.of("message", "Xóa thành công"));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{productId}/status")
    public ResponseEntity<?> updateItemStatus(
            @PathVariable("productId") Integer productId,
            @RequestBody CartStatusRequest request) {
        try {
            Integer userId = getCurrentUserId();

            cartService.updateItemStatus(userId, productId, request.getIsChecked());

            return ResponseEntity.ok(Map.of("message", "Cập nhật trạng thái thành công"));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/status/all")
    public ResponseEntity<?> updateAllItemStatus(@RequestBody CartStatusRequest request) {
        try {
            Integer userId = getCurrentUserId();

            cartService.updateAllItemStatus(userId, request.getIsChecked());

            return ResponseEntity.ok(Map.of("message", "Cập nhật tất cả trạng thái thành công"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}