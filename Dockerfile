# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS build

ENV DEBIAN_FRONTEND=noninteractive \
    DOTNET_CLI_TELEMETRY_OPTOUT=1 \
    DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl gnupg wget \
    && wget https://packages.microsoft.com/config/debian/12/packages-microsoft-prod.deb -O /tmp/packages-microsoft-prod.deb \
    && dpkg -i /tmp/packages-microsoft-prod.deb \
    && rm /tmp/packages-microsoft-prod.deb \
    && apt-get update \
    && apt-get install -y --no-install-recommends dotnet-sdk-10.0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /src

COPY RankingApp.csproj ./
COPY ClientApp/package*.json ./ClientApp/

RUN cd ClientApp && npm ci --no-audit --no-fund

COPY . .

RUN dotnet publish RankingApp.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0-bookworm-slim AS runtime

ENV ASPNETCORE_ENVIRONMENT=Production \
    DOTNET_PRINT_TELEMETRY_MESSAGE=false

RUN apt-get update \
    && apt-get install -y --no-install-recommends bash php-cli php-mysql php-curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=build /app/publish ./
COPY tierapp ./tierapp
COPY start.sh ./start.sh

RUN chmod +x ./start.sh

EXPOSE 10000

CMD ["/app/start.sh"]