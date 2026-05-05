# Runbook AssetDock Web

## Pré-requisitos
- Node 20+
- Arquivo `.env` na raiz (copiar de `.env.example`)
- Backend `assetdock-api` rodando nas portas 8080 e 8081

## Variáveis críticas
- `VITE_API_URL` deve incluir `/api/v1` (ex: `http://localhost:8080/api/v1`).
- `VITE_MANAGEMENT_URL` aponta para a porta do actuator (ex: `http://localhost:8081`).

## Inicialização
```bash
npm run dev
```

## Importante Após Alterar `.env`
O Vite não recarrega automaticamente as variáveis de ambiente sem um restart.
Sempre que editar o `.env`, pare o servidor (Ctrl+C) e rode `npm run dev` novamente.
