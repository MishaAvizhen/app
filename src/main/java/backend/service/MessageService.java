package backend.service;




import backend.entities.Message;
import backend.repository.MessageRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {

    private MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    public Message saveMessage(Message message) {
        message.setCreatedAt(LocalDateTime.now());
        return messageRepository.save(message);
    }

    @Transactional
    public void deleteMessage(Long  id) {
         messageRepository.deleteById(id);

    }

    public Message getHelloWorld() {
        return new Message("Hello World from Spring Boot and MySQL!");
    }
}