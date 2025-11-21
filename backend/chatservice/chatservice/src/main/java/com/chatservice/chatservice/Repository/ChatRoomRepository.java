package com.chatservice.chatservice.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.chatservice.chatservice.Model.ChatRoom;

import java.util.Optional;

public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {
    Optional<ChatRoom> findBySenderIdAndRecipientId(Integer senderId, Integer recipientId);
}