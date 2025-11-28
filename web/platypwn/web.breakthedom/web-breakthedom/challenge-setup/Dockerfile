FROM python:latest

WORKDIR /usr/app/src

RUN pip install requests bs4

COPY challenge-setup.py .

CMD ["python", "./challenge-setup.py"]
