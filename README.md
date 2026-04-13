🚢 LogiTwin — Digital Twin para Gestão Logística 

**Transformando dados complexos em visibilidade operacional em tempo real.**

O **LogiTwin** é uma solução de Gêmeo Digital de alto impacto, validada pelo **Programa Centelha (Nota 4.20)** e acelerada globalmente pela **Fundação Wadhwani (Ignite)**. Nosso propósito é eliminar a "invisibilidade" entre os sistemas de gestão (ERP) e a operação física do pátio logístico.

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

## 👥 Governança e Time
* **Product Owner:** Tarcísio Fernandes
* **Equipe de Desenvolvimento:** Jordy Arlego, Luiza e Mai.
* **Mentoria:** Rafael Rodrigues
