package com.chatservice.chatservice.Controller;

import com.chatservice.chatservice.DTO.ChatNotification;
import com.chatservice.chatservice.Model.ChatMessage;
import com.chatservice.chatservice.Service.ChatMessageService;
import com.chatservice.chatservice.feign.UserClient;
import com.chatservice.chatservice.feign.UserResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/chat")
public class ChatController {
    
    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageService chatMessageService;
    private final UserClient userClient;

    @MessageMapping("")
    public void processMessage(@Payload ChatMessage chatMessage) {
        logger.info("Processing message from sender: {} to recipient: {}", 
                   chatMessage.getSenderId(), chatMessage.getRecipientId());
        
        // Validate input
        if (chatMessage.getContent() == null || chatMessage.getContent().trim().isEmpty()) {
            logger.warn("Message content is empty or null");
            return;
        }
        
        // Limit message length
        if (chatMessage.getContent().length() > 1000) {
            chatMessage.setContent(chatMessage.getContent().substring(0, 1000));
        }
        
        // Validate sender exists in UsersService
        UserResponse sender = fetchUserFromService(chatMessage.getSenderId());
        if (sender != null) {
            chatMessage.setSenderName(sender.getNom());
            logger.info("Sender found: {}", sender.getNom());
        } else {
            chatMessage.setSenderName("Unknown User");
            logger.warn("Sender not found for ID: {}", chatMessage.getSenderId());
        }
        
        // Validate recipient exists in UsersService
        UserResponse recipient = fetchUserFromService(chatMessage.getRecipientId());
        if (recipient == null) {
            logger.warn("Recipient not found for ID: {}", chatMessage.getRecipientId());
            // Don't process message if recipient doesn't exist
            return;
        } else {
            logger.info("Recipient found: {}", recipient.getNom());
        }

        ChatMessage savedMsg = chatMessageService.save(chatMessage);
        messagingTemplate.convertAndSendToUser(
                chatMessage.getRecipientId().toString(), "/queue/messages",
                new ChatNotification(
                        savedMsg.getId(),
                        savedMsg.getSenderId(),
                        savedMsg.getRecipientId(),
                        savedMsg.getContent()
                )
        );
    }

    @GetMapping("/messages/{senderId}/{recipientId}")
    public ResponseEntity<List<ChatMessage>> findChatMessages(@PathVariable Integer senderId,
                                                              @PathVariable Integer recipientId,
                                                              @RequestParam(defaultValue = "0") int page,
                                                              @RequestParam(defaultValue = "50") int size) {
        logger.info("Fetching messages between sender: {} and recipient: {}", senderId, recipientId);
        
        // Validate both users exist
        UserResponse sender = fetchUserFromService(senderId);
        UserResponse recipient = fetchUserFromService(recipientId);
        
        if (sender == null || recipient == null) {
            logger.warn("One or both users not found");
            return ResponseEntity.notFound().build();
        }
        
        logger.info("Both users found, fetching messages");
        if (page > 0 || size != 50) {
            // Use pagination
            Page<ChatMessage> messages = chatMessageService.findChatMessages(senderId, recipientId, page, size);
            return ResponseEntity.ok(messages.getContent());
        } else {
            // Return all messages (backward compatibility)
            return ResponseEntity.ok(chatMessageService.findChatMessages(senderId, recipientId));
        }
    }
    
    @GetMapping("/validate-user/{id}")
    public ResponseEntity<Boolean> validateUserEndpoint(@PathVariable Integer id) {
        logger.info("Validating user ID: {}", id);
        UserResponse user = fetchUserFromService(id);
        boolean isValid = user != null;
        logger.info("User validation result: {}", isValid);
        return ResponseEntity.ok(isValid);
    }
    
    @GetMapping("/user/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Integer id) {
        logger.info("Fetching user details for ID: {}", id);
        UserResponse user = fetchUserFromService(id);
        if (user != null) {
            logger.info("User found: {}", user.getNom());
            return ResponseEntity.ok(user);
        } else {
            logger.warn("User not found for ID: {}", id);
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/clients")
    public ResponseEntity<List<UserResponse>> getAllClients() {
        logger.info("Fetching all clients");
        try {
            List<UserResponse> clients = userClient.getAllClients();
            logger.info("Found {} clients", clients.size());
            return ResponseEntity.ok(clients);
        } catch (Exception e) {
            logger.error("Error fetching clients: {}", e.getMessage(), e);
            return ResponseEntity.ok(new ArrayList<>());
        }
    }
    
    @GetMapping("/sellers")
    public ResponseEntity<List<UserResponse>> getAllSellers() {
        logger.info("Fetching all sellers");
        try {
            List<UserResponse> sellers = userClient.getAllSellers();
            logger.info("Found {} sellers", sellers.size());
            return ResponseEntity.ok(sellers);
        } catch (Exception e) {
            logger.error("Error fetching sellers: {}", e.getMessage(), e);
            return ResponseEntity.ok(new ArrayList<>());
        }
    }
    
    // New endpoint to get all users (both clients and sellers)
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        logger.info("Fetching all users");
        List<UserResponse> allUsers = new ArrayList<>();
        
        try {
            // Fetch clients
            List<UserResponse> clients = userClient.getAllClients();
            allUsers.addAll(clients);
            logger.info("Found {} clients", clients.size());
        } catch (Exception e) {
            logger.error("Error fetching clients: {}", e.getMessage(), e);
        }
        
        try {
            // Fetch sellers
            List<UserResponse> sellers = userClient.getAllSellers();
            allUsers.addAll(sellers);
            logger.info("Found {} sellers", sellers.size());
        } catch (Exception e) {
            logger.error("Error fetching sellers: {}", e.getMessage(), e);
        }
        
        logger.info("Total users found: {}", allUsers.size());
        return ResponseEntity.ok(allUsers);
    }

    private UserResponse fetchUserFromService(Integer userId) {
    UserResponse user = null;
    try { user = userClient.getClientById(userId); } catch (Exception ignored) {}
    if (user == null) try { user = userClient.getSellerById(userId); } catch (Exception ignored) {}

    if (user != null) {
        logger.debug("User found (ID: {})", userId);
    } else {
        logger.warn("User not found (ID: {}) as client or seller", userId);
    }

    return user;
}
}