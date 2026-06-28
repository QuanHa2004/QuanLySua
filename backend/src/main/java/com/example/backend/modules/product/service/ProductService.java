package com.example.backend.modules.product.service;

import com.example.backend.modules.product.api.ProductResponse;
import com.example.backend.modules.product.dto.request.AddProductRequest;
import com.example.backend.modules.product.dto.request.ProductFilterRequest;
import com.example.backend.modules.product.dto.response.AdminProductResponse;
import com.example.backend.modules.product.dto.response.ProductDetailResponse;
import com.example.backend.modules.product.dto.response.ProductFilterResponse;
import com.example.backend.modules.product.entity.Category;
import com.example.backend.modules.product.entity.Product;
import com.example.backend.modules.product.entity.ProductDetail;
import com.example.backend.modules.product.repo.ProductDetailRepository;
import com.example.backend.modules.product.repo.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductDetailRepository productDetailRepository;
    private final ObjectMapper objectMapper;


    public List<AdminProductResponse> getAllProductsForAdmin() {
        // Lấy danh sách sản phẩm gốc từ DB
        return productRepository.findAll().stream().map(product -> {

            // 1. Tạo danh sách Lô hàng (Batch) mẫu của biến thể này (nếu có)
            List<AdminProductResponse.BatchDto> batchList = new ArrayList<>();
            batchList.add(AdminProductResponse.BatchDto.builder()
                    .expirationDate(product.getExpirationDate()) // Trường ngày hết hạn từ thực thể
                    .quantity(product.getQuantity())             // Số lượng tồn kho của lô này
                    .build());

            // 2. Tạo danh sách Biến thể (Variant)
            List<AdminProductResponse.VariantDto> variantList = new ArrayList<>();
            variantList.add(AdminProductResponse.VariantDto.builder()
                    .variantName(product.getName()) // Hoặc trường tên biến thể cụ thể của bạn
                    .price(product.getPrice())
                    .stockQuantity(product.getQuantity())
                    .batches(batchList) // Gắn lô hàng vào biến thể
                    .build());

            // 3. Đóng gói vào đối tượng Sản phẩm hoàn chỉnh
            return AdminProductResponse.builder()
                    .productId(product.getId())
                    .productName(product.getName())
                    .isHot(product.getIsHot() != null && product.getIsHot())
                    .isDeleted(product.getIsDeleted() != null && product.getIsDeleted())
                    .variants(variantList) // Gắn danh sách biến thể vào sản phẩm
                    .build();
        }).toList();
    }


    public List<ProductResponse> getAllProducts() {
        // Lấy tất cả sản phẩm từ Database
        List<Product> products = productRepository.findAll();

        return products.stream()
                // Lọc bỏ những sản phẩm đã bị xóa mềm (isDeleted = true)
                .filter(p -> p.getIsDeleted() == null || !p.getIsDeleted())
                .map(p -> {
                    // Lấy tên danh mục an toàn
                    String catName = p.getCategory() != null ? p.getCategory().getName() : "Chưa phân loại";

                    return ProductResponse.builder()
                            .productId(p.getId())
                            .productName(p.getName())
                            .price(p.getPrice())
                            .imageUrl(p.getImageUrl())
                            // Các trường này có thể trả về null hoặc giá trị mặc định nếu Frontend không cần
                            .build();
                }).collect(Collectors.toList());
    }


    @Transactional(rollbackFor = Exception.class)
    public void addProduct(AddProductRequest request) {

        // 1. Kiểm tra trùng lặp
        if (productRepository.existsByName(request.getProductName().trim())) {
            throw new IllegalArgumentException("DUPLICATE_PRODUCT");
        }

        // 2. Tạo Category Object rỗng (chỉ chứa ID) để map vào Product mà không cần query lại DB
        Category categoryRef = new Category();
        categoryRef.setId(request.getCategoryId());

        // 3. Map dữ liệu vào bảng Product
        Product product = new Product();
        product.setName(request.getProductName().trim());
        product.setCategory(categoryRef);
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setDiscountPercent(request.getDiscountPercent());

        // Nếu không có HSD thì set ngày mặc định xa tít tắp, hoặc để tùy logic của bạn
        product.setExpirationDate(request.getExpirationDate() != null ? request.getExpirationDate() : LocalDate.now().plusYears(1));

        product.setImageUrl(request.getImageUrl());
        product.setDescription(request.getDescription());
        product.setIsHot(request.getIsHot() == 1);
        product.setIsDeleted(false);

        // Lưu và lấy ID sản phẩm mới
        Product savedProduct = productRepository.save(product);

        // 4. Map dữ liệu vào bảng ProductDetail
        try {
            String vitaminsJson = request.getVitamins() != null ? objectMapper.writeValueAsString(request.getVitamins()) : "{}";
            String mineralsJson = request.getMinerals() != null ? objectMapper.writeValueAsString(request.getMinerals()) : "{}";

            ProductDetail detail = new ProductDetail();
            detail.setProductId(savedProduct.getId()); // Khóa chính của bảng Detail

            detail.setOrigin(request.getOrigin());
            detail.setIngredients(request.getIngredients());
            detail.setUsage(request.getUsage());
            detail.setStorage(request.getStorage());
            detail.setOtherNutrients(request.getOtherNutrients());

            // Map vĩ lượng
            detail.setCalories(request.getCalories());
            detail.setProtein(request.getProtein());
            detail.setFat(request.getFat());
            detail.setCarbohydrates(request.getCarbohydrates());
            detail.setSugar(request.getSugar());

            // Map vi lượng JSON
            detail.setVitamins(vitaminsJson);
            detail.setMinerals(mineralsJson);

            productDetailRepository.save(detail);

        } catch (Exception e) {
            log.error("Lỗi parse JSON thành phần dinh dưỡng", e);
            throw new IllegalArgumentException("Dữ liệu Vitamin/Khoáng chất không hợp lệ");
        }
    }

    public List<ProductFilterResponse> filterProducts(ProductFilterRequest request) {
        List<Product> products;

        // 1. Kiểm tra điều kiện lọc
        if (request.getCategoryId() == null) {
            products = productRepository.findAll();
        } else {
            products = productRepository.findByCategoryId(request.getCategoryId());
        }

        // 2. Map dữ liệu sang DTO
        return products.stream().map(p -> {

            // Lấy tên danh mục một cách an toàn (tránh NullPointerException)
            String catName = (p.getCategory() != null) ? p.getCategory().getName() : "Chưa phân loại";

            return ProductFilterResponse.builder()
                    .productId(p.getId())
                    .productName(p.getName())
                    .categoryName(catName)
                    .price(p.getPrice())
                    .imageUrl(p.getImageUrl())
                    .quantity(p.getQuantity())

                    .build();
        }).collect(Collectors.toList());
    }


    public ProductDetailResponse getProductDetail(Integer productId) {
        // 1. Tìm sản phẩm trong Database
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + productId));

        // Lấy tên danh mục
        String categoryName = product.getCategory() != null ? product.getCategory().getName() : "Khác";

        ProductDetail detail = productDetailRepository.findById(productId).orElse(null);

        // 2. Build DTO trả về cho Frontend
        var responseBuilder = ProductDetailResponse.builder()
                .productId(product.getId())
                .productName(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .imageUrl(product.getImageUrl())
                .quantity(product.getQuantity())
                .categoryName(categoryName);

        // Nếu sản phẩm có nhập thông tin dinh dưỡng thì đắp thêm vào
        if (detail != null) {
            responseBuilder
                    .ingredients(detail.getIngredients())
                    .usageInstruction(detail.getUsage())
                    .calories(detail.getCalories())
                    .protein(detail.getProtein())
                    .fat(detail.getFat())
                    .carbs(detail.getCarbohydrates())
                    .vitamins(detail.getVitamins())
                    .minerals(detail.getMinerals());
        }

        return responseBuilder.build();
    }
}
