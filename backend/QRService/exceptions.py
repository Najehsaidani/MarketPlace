"""
Exceptions Module.

Defines custom exceptions.
"""

from fastapi import status


class AppException(Exception):
    """Base class for custom exceptions with message and HTTP status code."""

    def __init__(self, message: str, status_code: int = status.HTTP_400_BAD_REQUEST):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class SomethingWentWrong(AppException):
    def __init__(self, message="Une erreur inattendue est survenue sur le serveur. Veuillez réessayer plus tard."):
        super().__init__(message, status.HTTP_500_INTERNAL_SERVER_ERROR)


class BadRequest(AppException):
    def __init__(self, message="La requête est incorrecte. Veuillez vérifier les informations soumises."):
        super().__init__(message, status.HTTP_400_BAD_REQUEST)

class Unauthorized(AppException):
    def __init__(self, message="Vous n'êtes pas autorisé à accéder à cette ressource."):
        super().__init__(message, status.HTTP_401_UNAUTHORIZED)

class AlreadyExists(AppException):
    def __init__(
        self,
        message="Cette ressource existe déjà.",
    ):
        super().__init__(message, status.HTTP_409_CONFLICT)


class NotFoundException(AppException):
    def __init__(
        self,
        message="Cette ressource n'a pas été trouvée.",
    ):
        super().__init__(message, status.HTTP_404_NOT_FOUND)


class UnprocessableEntityException(AppException):
    def __init__(
        self,
        message="Le type ou la valeur de cette ressource est incorrect.",
    ):
        super().__init__(message, status.HTTP_422_UNPROCESSABLE_ENTITY)
