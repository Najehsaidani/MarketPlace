package com.chatservice.chatservice.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.chatservice.chatservice.Model.ChatMessage;

import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findByChatId(String chatId);
    Page<ChatMessage> findByChatId(String chatId, Pageable pageable);
}