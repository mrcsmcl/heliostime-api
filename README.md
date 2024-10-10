# Heliostime API

A **Heliostime** é uma API desenvolvida para o jogo em Unreal Engine em desenvolvimento, **Letz Kill**. Esta API identifica a localização do jogador através do seu IP, calcula a posição do sol em tempo real (a cada 15 minutos) e ajusta a iluminação do jogo para refletir essa posição. Além disso, a API integra dados do OpenWeather para fornecer informações climáticas, como temperatura e condições meteorológicas, permitindo que o jogo reaja a variações como chuva e mudanças de temperatura.

## Funcionalidades

- Identifica a localização do jogador através do IP.
- Calcula a posição do sol com atualização a cada 15 minutos.
- Atualiza a iluminação do jogo para refletir a posição do sol na localização do jogador.
- Consulta a temperatura e condições climáticas usando a API do OpenWeather.

## docker-compose.yml

```yaml
version: '3.8'

services:
  heliostime:
    build: .
    ports:
      - "3000:3000"
    environment:
      - API_KEY=your_api_key
    restart: unless-stopped
```

## Configurações Necessárias

Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis de ambiente:

```makefile
PORT=3000
OPENWEATHER_API_KEY=your_api_key
```