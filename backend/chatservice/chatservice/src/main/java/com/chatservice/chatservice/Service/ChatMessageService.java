package com.chatservice.chatservice.Service;

import com.chatservice.chatservice.Model.ChatMessage;
import com.chatservice.chatservice.Repository.ChatMessageRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
    private final ChatMessageRepository repository;
    private final ChatRoomService chatRoomService;

    public ChatMessage save(ChatMessage chatMessage) {
        // Set timestamp if not already set
        if (chatMessage.getTimestamp() == null) {
            chatMessage.setTimestamp(new java.util.Date());
        }
        
        Optional<String> chatIdOptional = chatRoomService
                .getChatRoomId(chatMessage.getSenderId(), chatMessage.getRecipientId(), true);
        
        if (chatIdOptional.isPresent()) {
            chatMessage.setChatId(chatIdOptional.get());
            repository.save(chatMessage);
            return chatMessage;
        } else {
            throw new RuntimeException("Could not create chat room");
        }
    }

    public List<ChatMessage> findChatMessages(Integer senderId, Integer recipientId) {
        Optional<String> chatId = chatRoomService.getChatRoomId(senderId, recipientId, false);
        if (chatId.isPresent()) {
            List<ChatMessage> messages = repository.findByChatId(chatId.get());
            // Sort messages by timestamp
            messages.sort(Comparator.comparing(ChatMessage::getTimestamp));
            return messages;
        } else {
            return new ArrayList<>();
        }
    }
    
    public Page<ChatMessage> findChatMessages(Integer senderId, Integer recipientId, int page, int size) {
        Optional<String> chatId = chatRoomService.getChatRoomId(senderId, recipientId, false);
        if (chatId.isPresent()) {
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "timestamp"));
            return repository.findByChatId(chatId.get(), pageable);
        } else {
            return Page.empty();
        }
    }
}