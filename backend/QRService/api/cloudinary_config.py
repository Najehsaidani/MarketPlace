import cloudinary

from envconfig import EnvFile

cloudinary.config(
    cloud_name=EnvFile.CLOUDINARY_NAME,
    api_key=EnvFile.CLOUDINARY_API_KEY,
    api_secret=EnvFile.CLOUDINARY_API_SECRET,
)
