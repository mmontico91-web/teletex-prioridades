# Teletex — Painel de Prioridades do Arquiteto de Segurança

Sistema de gestão de prioridades entre o time comercial e o arquiteto de segurança.
Histórico de 3 meses. Export CSV para prestação de contas.

---

## Estrutura

```
index.html          → Formulário para os vendedores enviarem prioridades
dashboard.html      → Dashboard do arquiteto (com PIN)
netlify/functions/  → Serverless functions (backend)
data/priorities.json → Banco de dados (GitHub como storage)
```

---

## Deploy — Passo a Passo

### 1. Repositório GitHub

Crie um repositório **privado** no GitHub para os dados (pode ser o mesmo projeto ou um separado).

No repositório, crie o arquivo `data/priorities.json` com o conteúdo:
```json
[]
```

### 2. Personal Access Token (GitHub)

1. Vá em https://github.com/settings/tokens → **Generate new token (classic)**
2. Scopes necessários: `repo` (acesso total ao repositório)
3. Copie o token gerado (você só vê uma vez)

### 3. Deploy no Netlify

1. Faça push deste projeto para um repositório GitHub (pode ser o `mmontico91-web/Sorteio` ou um novo)
2. No Netlify: **Add new site → Import an existing project → GitHub**
3. Selecione o repositório e deploy

### 4. Variáveis de Ambiente no Netlify

Em **Site settings → Environment variables**, adicione:

| Variável | Valor |
|---|---|
| `GITHUB_TOKEN` | Seu Personal Access Token |
| `GITHUB_OWNER` | `mmontico91-web` (seu username) |
| `GITHUB_REPO` | Nome do repositório de dados |

### 5. Alterar o PIN do Dashboard

No arquivo `dashboard.html`, linha:
```javascript
const DASHBOARD_PIN = 'teletex2026';
```
Troque `teletex2026` pelo PIN que quiser.

---

## URLs após deploy

- **Vendedores enviam prioridades:** `https://seu-site.netlify.app/`
- **Dashboard do arquiteto:** `https://seu-site.netlify.app/dashboard.html`

---

## Como usar

### Vendedores
1. Acessam a URL principal
2. Selecionam o nome, preenchem cliente, oportunidade SF, tipo, urgência, descrição e prazo
3. Clicam em "Enviar Prioridade"

### Arquiteto (você)
1. Acessa `/dashboard.html` com o PIN
2. Visualiza todas as prioridades ordenadas por urgência + prazo
3. Clica em ✏ para editar status e adicionar notas
4. Usa ▶ e ✓ para atualizar rapidamente
5. Clica em "Exportar CSV" para gerar relatório

### Relatório para o Diretor
- Clique em **Exportar CSV** no dashboard
- O arquivo `.csv` abre diretamente no Excel (com BOM UTF-8)
- Contém todos os campos + nota do arquiteto + timestamps

---

## Dados salvos por entrada

| Campo | Descrição |
|---|---|
| vendedor | Nome do vendedor |
| cliente | Nome do cliente |
| oportunidade_sf | Código/nome no Salesforce |
| tipo | Projeto / Reunião / Proposta / POC |
| urgencia | 1 a 5 |
| descricao | Descrição da atividade |
| prazo | Data limite com o cliente |
| status | pendente / em andamento / concluído / cancelado |
| nota_arquiteto | Suas observações |
| created_at | Timestamp de criação |
| updated_at | Timestamp da última atualização |

---

## Histórico

Todo commit no GitHub registra quem criou/atualizou e quando.
O sistema mantém os últimos 3 meses de dados ativos.
Para auditoria completa, o histórico de commits do GitHub tem tudo.
