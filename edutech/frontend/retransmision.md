# Instalaciones:
```bash
npm install @jitsi/react-sdk

# Para todo el asunto del servidor por Docker
git clone https://github.com/jitsi/docker-jitsi-meet

npm install lucide-react
npm install agora-rtc-sdk-ng agora-rtc-react
npm install agora-rtc-react agora-rtc-sdk-ng
npm install peerjs

# Este no es necesario ya que Daily.co no se usa
npm install @daily-co/daily-react
```

Para la ejecución:
```bash
cd edutech/frontend/docker-jitsi-meet
docker-compose up -d 
```

Y ejecutar manualmente el contenedor "todo-docker-lab" en el caso de no funcionar
