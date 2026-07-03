package com.example.backend.modules.notification.controller;

import com.example.backend.modules.notification.entity.Notification;
import com.example.backend.modules.notification.repo.NotificationRepository;
import com.example.backend.modules.notification.service.SseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final SseService sseService;
    private final NotificationRepository notificationRepository;

    // API giúp Frontend đăng ký nhận tin nhắn thời gian thực
    @GetMapping(value = "/subscribe/{userId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@PathVariable Integer userId) {
        return sseService.createConnection(userId);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getNotificationsByUserId(@PathVariable("userId") Integer userId) {
        try {
            List<Notification> list = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", list
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Không thể tải danh sách thông báo"
            ));
        }
    }
}
