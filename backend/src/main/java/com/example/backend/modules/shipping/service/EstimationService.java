package com.example.backend.modules.shipping.service;

import com.example.backend.modules.shipping.dto.DeliveryEstimate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class EstimationService {

    private final RestTemplate restTemplate;

    @Value("${openrouteservice.api-key}")
    private String apiKey;

    @Value("${openrouteservice.api-url}")
    private String apiUrl;

    @Value("${openrouteservice.store-longitude}")
    private String storeLng;

    @Value("${openrouteservice.store-latitude}")
    private String storeLat;

    public DeliveryEstimate calculateEstimate(String customerLng, String customerLat) {
        // 1. Build URL (Định dạng của ORS: start=lng,lat & end=lng,lat)
        String requestUrl = String.format("%s?api_key=%s&start=%s,%s&end=%s,%s",
                apiUrl, apiKey, storeLng, storeLat, customerLng, customerLat);

        try {
            // 2. Gọi API HTTP GET
            Map<String, Object> response = restTemplate.getForObject(requestUrl, Map.class);

            // 3. Bóc tách dữ liệu JSON từ ORS trả về
            List<Map<String, Object>> features = (List<Map<String, Object>>) response.get("features");
            Map<String, Object> properties = (Map<String, Object>) features.get(0).get("properties");
            Map<String, Object> summary = (Map<String, Object>) properties.get("summary");

            // Quãng đường trả về là mét, thời gian là giây
            Double distanceMeters = ((Number) summary.get("distance")).doubleValue();
            Double durationSeconds = ((Number) summary.get("duration")).doubleValue();

            Double distanceKm = distanceMeters / 1000.0;
            Double durationMinutes = durationSeconds / 60.0;

            // 4. Cộng thêm thời gian xử lý kho (ví dụ: kho mất 30 phút đóng gói)
            LocalDateTime estimatedTime = LocalDateTime.now().plusMinutes(durationMinutes.longValue() + 30);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm - dd/MM/yyyy");

            return DeliveryEstimate.builder()
                    .distanceKm(Math.round(distanceKm * 10.0) / 10.0) // Làm tròn 1 chữ số
                    .durationMinutes(Math.round(durationMinutes * 10.0) / 10.0)
                    .estimatedDeliveryDate(estimatedTime.format(formatter))
                    .build();

        } catch (Exception e) {
            log.error("❌ Lỗi tính toán thời gian giao hàng: {}", e.getMessage());
            // Trả về mặc định nếu API lỗi để không làm chết ứng dụng
            return DeliveryEstimate.builder()
                    .distanceKm(0.0)
                    .durationMinutes(0.0)
                    .estimatedDeliveryDate("Chưa thể tính toán")
                    .build();
        }
    }
}
