package com.chatservice.chatservice.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.chatservice.chatservice.Model.ChatRoom;
import com.chatservice.chatservice.Repository.ChatRoomRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;

    public Optional<String> getChatRoomId(
            Integer senderId,
            Integer recipientId,
            boolean createNewRoomIfNotExists
    ) {
        // Check if chat room already exists in either direction
        return chatRoomRepository
                .findBySenderIdAndRecipientId(senderId, recipientId)
                .map(ChatRoom::getChatId)
                .or(() -> chatRoomRepository
                        .findBySenderIdAndRecipientId(recipientId, senderId)
                        .map(ChatRoom::getChatId))
                .or(() -> {
                    if(createNewRoomIfNotExists) {
                        var chatId = createChatId(senderId, recipientId);
                        return Optional.of(chatId);
                    }
                    return Optional.empty();
                });
    }

    private String createChatId(Integer senderId, Integer recipientId) {
        // Create a consistent chat ID regardless of sender/recipient order
        int minId = Math.min(senderId, recipientId);
        int maxId = Math.max(senderId, recipientId);
        var chatId = String.format("%d_%d", minId, maxId);

        // Check if chat room already exists
        Optional<ChatRoom> existingRoom = chatRoomRepository
                .findBySenderIdAndRecipientId(minId, maxId);
        
        if (existingRoom.isPresent()) {
            return existingRoom.get().getChatId();
        }

        ChatRoom chatRoom = ChatRoom
                .builder()
                .chatId(chatId)
                .senderId(minId)
                .recipientId(maxId)
                .build();

        chatRoomRepository.save(chatRoom);
        return chatId;
    }
}