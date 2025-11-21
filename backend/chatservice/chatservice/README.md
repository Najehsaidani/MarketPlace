# Chat Service

A real-time chat application built with Spring Boot, WebSocket, and MongoDB.

## Features

- Real-time messaging using WebSocket and STOMP
- User authentication with UsersService
- Separate lists for clients and sellers
- Message history persistence in MongoDB
- Responsive UI with modern design

## Prerequisites

- Java 21
- Maven
- MongoDB
- UsersService running on port 8088

## Installation

1. Clone the repository
2. Navigate to the chatservice directory
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

## Usage

1. Access the chat application at `http://localhost:8085`
2. Enter your User ID from UsersService
3. Select your user type (client or seller)
4. Start chatting with other users

## API Endpoints

### WebSocket Endpoints
- `/ws` - WebSocket connection endpoint
- `/app/chat` - Send messages
- `/user/{userId}/queue/messages` - Receive messages

### REST Endpoints
- `GET /messages/{senderId}/{recipientId}` - Get chat history
- `GET /validate-user/{id}` - Validate user existence
- `GET /user/{id}` - Get user details
- `GET /clients` - Get all clients
- `GET /sellers` - Get all sellers
- `GET /users` - Get all users (clients and sellers)

## Architecture

The chat service uses:
- Spring Boot for the backend framework
- MongoDB for message storage
- WebSocket for real-time communication
- Feign Client for communication with UsersService
- STOMP protocol for message routing

## Security

The application validates all users against the UsersService before allowing them to chat.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.