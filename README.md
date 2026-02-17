<h1 align="center">
  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.herokuapp.com/?font=Inter&weight=600&size=30&pause=1000&color=2563EB&center=true&vCenter=true&width=500&lines=Becas+TEC+Platform;Gesti%C3%B3n+de+Becas+Estudiantiles;MERN+Stack+%2B+Docker" alt="Typing SVG" />
  </a>
</h1>

<p align="center">
  <img src="https://img.shields.io/badge/VERSION-v2.1-blue?style=for-the-badge&logo=git&logoColor=white" alt="Version" />
  <img src="https://img.shields.io/badge/ESTATUS-FINALIZADO-059669?style=for-the-badge&logo=fire&logoColor=white" alt="Status" />
  <img src="https://img.shields.io/github/last-commit/aalcantaraxxx/Becas-TEC-Platform?style=for-the-badge&logo=github&color=1e293b" alt="Last Commit" />
  <a href="https://becas.tec.protesispiernas.com/">
    <img src="https://img.shields.io/website?down_message=offline&label=LIVE%20SERVER&style=for-the-badge&up_message=online&url=https%3A%2F%2Fbecas.tec.protesispiernas.com%2F&logo=internet-explorer&color=059669" alt="Website Status" />
  </a>
</p>

<br />

## ⚡ Sobre el Proyecto

**Becas TEC Platform** es una solución integral diseñada para digitalizar y optimizar el proceso de solicitud, gestión y asignación de becas estudiantiles.

Este repositorio contiene el código fuente completo, estructurado en una arquitectura de microservicios (Frontend y Backend separados) y contenerizado para un despliegue ágil.

### 🛠️ Tech Stack & Arquitectura

<p align="left">
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Estilos-Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Backend-Node.js-339933?style=flat-square&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/API-Express-000000?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Database-MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/DevOps-Docker-2496ED?style=flat-square&logo=docker&logoColor=white" />
</p>

---

## 🚀 Despliegue y Acceso

El proyecto se encuentra actualmente desplegado en un VPS privado y es accesible públicamente.

<div align="center">
  <a href="https://becas.tec.protesispiernas.com/" target="_blank">
    <img src="https://img.shields.io/badge/VISITAR_PLATAFORMA-059669?style=for-the-badge&logo=rocket&logoColor=white" alt="Live Demo" />
  </a>
</div>

### 📸 Vistas Previas

| **Landing Page** | **Panel de Diseño** |
| :---: | :---: |
| <img src="https://raw.githubusercontent.com/Aalcantaraxxx/Full-Stack/refs/heads/main/Actividad2/img/Home.png" width="400" alt="Vista Home"> | <img src="https://raw.githubusercontent.com/Aalcantaraxxx/Full-Stack/refs/heads/main/Actividad2/img/Dise%C3%B1ador.png" width="400" alt="Vista Diseñador"> |

---

## 📂 Estructura del Repositorio

El proyecto sigue una estructura modular para facilitar la escalabilidad:

```bash
Becas-TEC-Platform/
├── backend/            # API RESTful (Node.js + Express)
├── src/            
│   ├── config/         # 
│   ├── routes/         # Definición de endpoints (Auth, Users, Becas)
│   ├── controllers/    # Lógica de negocio
│   └── database/       # Conexión y modelos MySQL
├── frontend/           # Cliente Web (React + Vite)
│   ├── src/
│   └── public/
├── .gitignore          # Archivos excluidos
└── docker-compose.yml  # Orquestación de contenedores (Próximamente) 