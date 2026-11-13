# Stage 1: Build the frontend React bundle
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production Python runtime
FROM python:3.9-slim
WORKDIR /app

# Install system audio dependencies for soundfile
RUN apt-get update && apt-get install -y --no-install-recommends \
    libsndfile1 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code and built frontend distribution
COPY backend ./backend
COPY assets ./assets
COPY --from=frontend-builder /app/dist ./dist

# Expose port (default 8000, or dynamically bind to $PORT for cloud hosts)
ENV PORT=8000
EXPOSE 8000

CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT}"]

