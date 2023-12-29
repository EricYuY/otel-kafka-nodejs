<!-- markdownlint-disable-next-line -->
# NodeJS+Kafka OTel

## Detalle

Demo para instrumentar peticiones asíncronas entre NodeJS y Kafka, donde no se tendría visibilidad automáticamente.

Arquitectura (simple):
![image](https://github.com/EricYuY/otel-kafka-nodejs/assets/73684844/696fb681-1627-42eb-b107-8b4a147b5179)


## Prequesitos:
- Docker (https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04)
- Tenant Dynatrace
  - Features (https://docs.dynatrace.com/docs/shortlink/otel-wt-nodejs)

Pasos para replicar:

## 1. Clonar repositorio
```
git clone https://github.com/EricYuY/otel-kafka-nodejs.git
```
## 2. Instalar agente DT, para Docker: 
```
docker run -d \
--restart=on-failure:5 \
--pid=host \
--net=host \
--cap-drop ALL \
--cap-add CHOWN \
--cap-add DAC_OVERRIDE \
--cap-add DAC_READ_SEARCH \
--cap-add FOWNER \
--cap-add FSETID \
--cap-add KILL \
--cap-add NET_ADMIN \
--cap-add NET_RAW \
--cap-add SETFCAP \
--cap-add SETGID \
--cap-add SETUID \
--cap-add SYS_ADMIN \
--cap-add SYS_CHROOT \
--cap-add SYS_PTRACE \
--cap-add SYS_RESOURCE \
--security-opt apparmor:unconfined \
-v /:/mnt/root \
-e ONEAGENT_INSTALLER_SCRIPT_URL=https://www.{id}.live.dynatrace.com/api/v1/deployment/installer/agent/unix/default/latest?arch=x86 \
-e ONEAGENT_INSTALLER_DOWNLOAD_TOKEN=dt0c01.XXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX \
dynatrace/oneagent --set-infra-only=false --set-app-log-content-access=true --set-host-group={host-group}
```
## 3. Desplegar app
```
docker compose up
```
## Opcional:

Si se va a utilizar Otel exporter:
```
1. Descomentar "OpenTelemetry Collector" del docker-compose.yml
2. Agregar credenciales (endpoint y Token) en otel-collector/conf.yml
```

Comandos adicionales:
```
Detener contenedores:   docker stop $(docker ps -a -q)
Eliminar contenedores:  docker container prune
Eliminar imagenes:      docker image prune -a
```
