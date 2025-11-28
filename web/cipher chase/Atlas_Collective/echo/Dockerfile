<<<<<<< HEAD
FROM python:3.11-slim

WORKDIR /opt/echo

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
=======
FROM python:3.11-slim

WORKDIR /opt/echo

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
>>>>>>> d4a2367056d677336c8a5b16802e91d113b52a21
