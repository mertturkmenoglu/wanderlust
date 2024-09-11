# Monitoring

- Grafana runs at `http://localhost:3001`
- Prometheus runs at `http://localhost:9090`

## Grafana

- Login with `admin` / `admin`
- Add a new data source
  - Name: `Prometheus`
  - Type: `Prometheus`
  - URL: `http://prometheus:9090`
