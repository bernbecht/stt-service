USE_MOCK=false
if [ "$1" = "--mock" ]; then
    USE_MOCK=true
fi

echo "Starting Redis..."
redis-server --daemonize yes

echo "Starting API Gateway..."
if [ "$USE_MOCK" = true ]; then
    cd api-gateway && npm run dev:mock-whisper &
else
    cd api-gateway && npm run dev &
fi

echo "Starting Worker..."
cd api-gateway && npm run worker &

if [ "$USE_MOCK" = false ]; then
    echo "Starting Whisper Service..."
    cd ../whisper-service && python app/main.py &
fi

wait