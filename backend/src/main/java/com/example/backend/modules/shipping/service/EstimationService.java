package com.example.backend.modules.shipping.service;

import com.example.backend.modules.shipping.dto.DeliveryEstimate;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

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
        String requestUrl = String.format("%s?api_key=%s&start=%s,%s&end=%s,%s",
                apiUrl, apiKey, storeLng, storeLat, customerLng, customerLat);

        try {
            Map<String, Object> response = restTemplate.getForObject(requestUrl, Map.class);

            List<Map<String, Object>> features = (List<Map<String, Object>>) response.get("features");
            Map<String, Object> properties = (Map<String, Object>) features.get(0).get("properties");
            Map<String, Object> summary = (Map<String, Object>) properties.get("summary");

            Double distanceMeters = ((Number) summary.get("distance")).doubleValue();
            Double durationSeconds = ((Number) summary.get("duration")).doubleValue();

            Double distanceKm = distanceMeters / 1000.0;
            Double durationMinutes = durationSeconds / 60.0;

            LocalDateTime estimatedTime = LocalDateTime.now().plusMinutes(durationMinutes.longValue() + 30);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm - dd/MM/yyyy");

            return DeliveryEstimate.builder()
                    .distanceKm(Math.round(distanceKm * 10.0) / 10.0)
                    .durationMinutes(Math.round(durationMinutes * 10.0) / 10.0)
                    .estimatedDeliveryDate(estimatedTime.format(formatter))
                    .build();

        } catch (Exception e) {
            return DeliveryEstimate.builder()
                    .distanceKm(0.0)
                    .durationMinutes(0.0)
                    .estimatedDeliveryDate("Chưa thể tính toán")
                    .build();
        }
    }
}
