package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {

    @Bean
    public RestTemplate restTemplate() {
        // Sử dụng Factory lõi của Spring để cấu hình timeout
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();

        // Cài đặt thời gian tính bằng mili-giây (5000ms = 5 giây)
        factory.setConnectTimeout(5000); // Thời gian chờ kết nối
        factory.setReadTimeout(5000);    // Thời gian chờ dữ liệu trả về

        return new RestTemplate(factory);
    }
}
