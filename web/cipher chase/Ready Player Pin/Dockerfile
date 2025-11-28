FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY src/ /app/
RUN pip install --no-cache-dir -r requirements.txt

RUN useradd -ms /bin/bash ctf

COPY flag.txt /flag.txt

RUN FLAG_NAME=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 16) && \
    mv /flag.txt /$FLAG_NAME && \
    chown ctf:ctf /$FLAG_NAME && \
    chmod 400 /$FLAG_NAME

EXPOSE 8080

USER ctf

CMD ["python", "app.py"]
