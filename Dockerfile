# syntax=docker/dockerfile:1

# STAGE 1: Use the pre-built .NET SDK to skip the massive 250MB manual download
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

# Quickly install Node.js for the React build
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /src

# Restore and install dependencies
COPY RankingApp.csproj ./
COPY ClientApp/package*.json ./ClientApp/
RUN cd ClientApp && npm ci --no-audit --no-fund

# Copy the rest of the code and publish the app
COPY . .
RUN dotnet publish RankingApp.csproj -c Release -o /app/publish /p:UseAppHost=false

# STAGE 2: Lightweight Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime

ENV ASPNETCORE_ENVIRONMENT=Production \
    DOTNET_PRINT_TELEMETRY_MESSAGE=false

# Install PHP for your tierapp backend
RUN apt-get update \
    && apt-get install -y --no-install-recommends bash php-cli php-mysql php-curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the compiled .NET/React app and PHP scripts
COPY --from=build /app/publish ./
COPY tierapp ./tierapp
COPY start.sh ./start.sh

RUN chmod +x ./start.sh

EXPOSE 10000

CMD ["/app/start.sh"]