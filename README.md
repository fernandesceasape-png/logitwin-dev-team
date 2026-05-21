# 🚢 LogiTwin — Digital Twin para Gestão Logística 

**Transformando dados complexos em visibilidade operacional em tempo real.**

O **LogiTwin** é uma solução de Gêmeo Digital de alto impacto, validada pelo **Programa Centelha (Nota 4.20)** e acelerada globalmente pela **Fundação Wadhwani (Ignite)**. Nosso propósito é eliminar a "invisibilidade" entre os sistemas de gestão (ERP) e a operação física do pátio logístico.

🎥 Demonstração do Sistema

<img width="800" height="342" alt="LogiTwin-ezgif com-video-to-gif-converter" src="https://github.com/user-attachments/assets/66382dde-2f31-496d-846c-693070f4aac1" />


📺 Vídeo completo da demonstração:

https://www.youtube.com/watch?v=bnDIuSrNgz0

## 📌 O Problema
No dia a dia logístico, existe um gap crítico entre o dado sistêmico e a realidade do pátio. Gestores muitas vezes não possuem visibilidade imediata de cargas paradas, atrasos de faturamento por falta de unidades de manuseio ou gargalos de SLA que impactam o custo operacional.

## 🚀 A Solução
O LogiTwin atua como uma camada de inteligência e visualização que:
* **Garante Visibilidade:** Dashboard intuitivo para monitoramento de cargas e containers.
* **Gestão por Exceção:** Alertas visuais automáticos para pedidos pendentes (7 e 30 dias).
* **Fidelidade Técnica:** Estrutura de dados espelhada no padrão de mercado (SAP), facilitando futuras integrações.

## 🛠️ Estrutura Técnica (Squad)
O projeto está organizado para simular um ambiente de produção real:

* **Painel de Controle (Frontend):** Interface em React/Vite com sistema de busca em tempo real e drill-down de pedidos.
* **Motor de Simulação (Backend):** API preparada para o processamento de fluxos logísticos.
* **Amostras de Dados (SAP Logic):** Mapeamento e consumo das tabelas essenciais:
    * `VBAK`: Cabeçalho de Ordens de Venda.
    * `LIPS`: Dados de Item de Remessa (Delivery).
    * `VEKP`: Unidades de Manuseio (Handling Units/Containers).

## 📂 Organização do Repositório
* `/painel-de-controle-da-interface`: Código-fonte do Frontend.
* `/motor-de-simulacao`: Lógica de backend e processamento.
* `/amostras-de-dados`: Mocks e estruturas de dados (JSON).

## ▶️ Como Rodar o Projeto

Você vai precisar de **Node.js 18+** instalado e VSCode para abrir o projeto. Abra **dois terminais**.

**Terminal 1 — Backend**
```bash
cd simulation-engine/backend_logitwin_2
npm install
node server.js
```
Confirme que aparece: `Servidor rodando na porta 3001`

**Terminal 2 — Frontend**
```bash
cd frontend-dashboard/frontend_logitwin_2
npm install
npm run dev
```
Acesse: **http://localhost:3000**

> O backend precisa estar rodando antes de abrir o frontend.

## 👥 Governança e Time
* **Product Owner:** Tarcísio Fernandes
* **Equipe de Desenvolvimento da Residência Tecnológica do Porto Digital:** Maísa Letícia, Manoel Rodrigues, Jordy Arlego e  Maria Luiza.
* **Mentoria:** Rafael Rodrigues
