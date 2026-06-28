package com.example.backend.modules.cart.service;

import com.example.backend.modules.cart.dto.request.CartRequest;
import com.example.backend.modules.cart.dto.response.CartResponse;
import com.example.backend.modules.cart.entity.Cart;
import com.example.backend.modules.cart.entity.CartItem;
import com.example.backend.modules.cart.repo.CartItemRepository;
import com.example.backend.modules.cart.repo.CartRepository;
import com.example.backend.modules.product.api.ProductInternalService;
import com.example.backend.modules.product.api.ProductResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductInternalService productInternalService;

    // --- Hàm tiện ích: Lấy giỏ hàng của User, nếu chưa có thì tạo mới ---
    private Cart getOrCreateCart(Integer userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUserId(userId);
            return cartRepository.save(newCart);
        });
    }

    // 1. Lấy danh sách sản phẩm trong giỏ
    public List<CartResponse> getCartItems(Integer userId) {
        Optional<Cart> cartOpt = cartRepository.findByUserId(userId);

        if (cartOpt.isEmpty()) {
            return new ArrayList<>();
        }

        List<CartItem> items = cartItemRepository.findByCartId(cartOpt.get().getId());

        return items.stream().map(item -> {

            // Lấy thông tin sản phẩm thông qua Internal API của module Product
            ProductResponse product = productInternalService.getProductSnapshot(item.getProductId());

            return CartResponse.builder()
                    .productId(product.getProductId())
                    .productName(product.getProductName())
                    .price(product.getPrice())
                    .imageUrl(product.getImageUrl())
                    .quantity(item.getQuantity())
                    .isChecked(item.getIsChecked())
                    .build();

        }).collect(Collectors.toList());
    }

    // 2. Thêm sản phẩm vào giỏ
    @Transactional(rollbackFor = Exception.class)
    public void addToCart(Integer userId, CartRequest request) {
        Cart cart = getOrCreateCart(userId);

        Optional<CartItem> existingItem = cartItemRepository
                .findByCartIdAndProductId(cart.getId(), request.getProductId());

        if (existingItem.isPresent()) {
            // Sản phẩm đã có -> Cộng dồn số lượng
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            cartItemRepository.save(item);
        } else {
            // Sản phẩm chưa có -> Thêm mới
            CartItem newItem = new CartItem();
            newItem.setCartId(cart.getId());
            newItem.setProductId(request.getProductId());
            newItem.setQuantity(request.getQuantity());
            newItem.setIsChecked(false);

            cartItemRepository.save(newItem);
        }
    }

    // 3. Cập nhật số lượng (+ / -)
    @Transactional(rollbackFor = Exception.class)
    public void updateQuantity(Integer userId, CartRequest request) {
        Optional<Cart> cartOpt = cartRepository.findByUserId(userId);
        if (cartOpt.isEmpty()) return;

        CartItem item = cartItemRepository
                .findByCartIdAndProductId(cartOpt.get().getId(), request.getProductId())
                .orElseThrow(() -> new RuntimeException("Sản phẩm không có trong giỏ hàng"));

        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);
    }

    // 4. Xóa sản phẩm khỏi giỏ
    @Transactional(rollbackFor = Exception.class)
    public void removeFromCart(Integer userId, CartRequest request) {
        Optional<Cart> cartOpt = cartRepository.findByUserId(userId);

        cartOpt.ifPresent(cart ->
                cartItemRepository.deleteByCartIdAndProductId(cart.getId(), request.getProductId())
        );
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateItemStatus(Integer userId, Integer productId, Boolean isChecked) {
        // 1. Tìm giỏ hàng của người dùng hiện tại
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Giỏ hàng không tồn tại"));

        // 2. Tìm sản phẩm cụ thể trong giỏ hàng đó
        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không có trong giỏ hàng"));

        // 3. Cập nhật trạng thái check
        item.setIsChecked(isChecked);

        // 4. Lưu lại xuống database
        cartItemRepository.save(item);
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateAllItemStatus(Integer userId, Boolean isChecked) {
        // Tìm giỏ hàng của người dùng hiện tại
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Giỏ hàng không tồn tại"));

        // Cập nhật toàn bộ item thuộc giỏ hàng này
        cartItemRepository.updateStatusByCartId(cart.getId(), isChecked);
    }
}
