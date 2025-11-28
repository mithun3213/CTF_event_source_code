FROM python:3.13-slim

# Install Firefox + dependencies + CA certs
RUN apt-get update && apt-get install -y \
    firefox-esr \
    wget \
    xvfb \
    libgtk-3-0 \
    libdbus-glib-1-2 \
    libdbus-1-3 \
    libasound2 \
    libx11-xcb1 \
    libxt6 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install geckodriver
RUN wget -O /tmp/geckodriver.tar.gz \
    https://github.com/mozilla/geckodriver/releases/download/v0.34.0/geckodriver-v0.34.0-linux64.tar.gz \
    --no-check-certificate \
    && tar -xzf /tmp/geckodriver.tar.gz -C /usr/local/bin \
    && rm /tmp/geckodriver.tar.gz \
    && chmod +x /usr/local/bin/geckodriver

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 80

CMD ["python3", "main.py"]
