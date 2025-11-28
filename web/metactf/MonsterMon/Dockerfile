# Start from the official Golang base image
FROM golang:1.22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the Go Modules manifests
COPY go.mod go.sum ./

# Copy the source code into the container
COPY flag.txt monstermon.go index.html data.json script.js style.css ./

COPY images/ images/

RUN go get .

EXPOSE 8080

# Command to run the executable
CMD ["go", "run", "."]
