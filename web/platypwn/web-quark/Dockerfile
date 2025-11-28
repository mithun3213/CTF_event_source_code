FROM python:3.13-slim

RUN apt-get update && \
  apt-get install -y --no-install-recommends unzip curl

# Install Quarkdown
COPY install.sh /install.sh
RUN chmod +x /install.sh && /install.sh

RUN pip install --no-cache-dir flask

WORKDIR /app
COPY app.py /app/app.py

EXPOSE 5000

CMD ["python", "app.py"]
