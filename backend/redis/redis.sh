docker pull redis:latest
docker run -itd --restart always --name redis_chat -p 6380:6379 redis