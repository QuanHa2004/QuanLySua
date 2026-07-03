package com.example.backend.modules.notification.service;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SseService {
    // Lưu trữ danh sách các đường ống đang mở (Key: userId, Value: SseEmitter)
    private final Map<Integer, SseEmitter> emitters = new ConcurrentHashMap<>();

    // Tạo kết nối mới khi User/Admin mở trình duyệt lên
    public SseEmitter createConnection(Integer userId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE); // Kết nối không giới hạn thời gian

        emitters.put(userId, emitter);

        // Hủy kết nối nếu có lỗi hoặc đóng trình duyệt
        emitter.onCompletion(() -> emitters.remove(userId));
        emitter.onTimeout(() -> emitters.remove(userId));
        emitter.onError((e) -> emitters.remove(userId));

        return emitter;
    }

    // Gửi thông báo thời gian thực đến đích danh 1 User/Admin
    public void sendNotificationRealtime(Integer userId, Object notificationData) {
        SseEmitter emitter = emitters.get(userId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name("NOTIFICATION_EVENT")
                        .data(notificationData));
            } catch (IOException e) {
                emitters.remove(userId); // Xóa nếu đường ống bị hỏng
            }
        }
    }
}
