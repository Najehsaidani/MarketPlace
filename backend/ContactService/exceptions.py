from starlette import status


class AppException(Exception):
    """Base class for custom exceptions with message and HTTP status code."""

    def __init__(self, message: str, status_code: int = status.HTTP_400_BAD_REQUEST):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class NotFoundException(AppException):
    def __init__(
        self,
        message="This resource was not found.",
    ):
        super().__init__(message, status.HTTP_404_NOT_FOUND)

class UnauthorizedException(AppException):
    def __init__(
        self,
        message="Wrong credentials.",
    ):
        super().__init__(message, status.HTTP_401_UNAUTHORIZED)

class AlreadyExistsException(AppException):
    def __init__(
            self,
            message="This resource already exists.",
    ):
        super().__init__(message, status.HTTP_409_CONFLICT)