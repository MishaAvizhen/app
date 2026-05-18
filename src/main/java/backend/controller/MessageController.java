package backend.controller;





import backend.entity.Message;
import backend.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class MessageController
{

    @Autowired
    private MessageRepository messageRepository;

    @GetMapping("/hello")
    public ResponseEntity<Map<String, String>> sayHello() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hello World from Spring Boot!");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/messages")
    public ResponseEntity<List<Message>> getAllMessages() {
        List<Message> messages = messageRepository.findAll();
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/messages")
    public ResponseEntity<Message> createMessage(@RequestBody Map<String, String> request) {
        String content = request.get("content");
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Message message = new Message(content);
        Message saved = messageRepository.save(message);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "hello-world-backend");
        return ResponseEntity.ok(health);
    }

    // Замените старый метод удаления по ID на этот простой вариант:
    @DeleteMapping("/messages/{id}")
    public ResponseEntity<?> deleteMessageById(@PathVariable Long id) {
        try {
            messageRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}