# 🚀 Async Job Processor API

A high-performance API using NestJS and Azure Service Bus to manage long-running background jobs with an asynchronous request-reply pattern. Built with **NestJS**, this API serves as the entry point for an asynchronous, message-driven system — created to solve the real-world challenge of processing time-consuming operations (like PDF invoice generation) without blocking the client.

This project was developed as a **portfolio piece** to explore and implement best practices within the **Microsoft Azure** ecosystem. It is part of a distributed architecture, with the background worker available in a separate repository: [`job-processor-function`](https://github.com/Caua-Vinicius/job-processor-function).

---

## 🏛️ System Architecture

The solution implements the **Asynchronous Request-Reply** pattern to ensure a resilient and scalable backend. It decouples request handling from heavy processing, enabling efficient system design.

### 🧭 Flow Overview

1. **Request Ingestion (NestJS API):**  
   A client submits a `POST /invoices` request. The API validates input, creates a job record in the database (`Queued` status), and immediately returns `202 Accepted` with a `jobId`.

2. **Job Queuing (Azure Service Bus):**  
   The job details are dispatched to a queue in **Azure Service Bus**, acting as a message broker.

3. **Asynchronous Processing (Azure Function):**  
   An **Azure Function** listens to the queue. It updates the job to `Processing`, executes the work (e.g., generates a PDF), and sets the final status to `Completed` or `Failed`.

4. **Status Polling:**  
   Clients poll `GET /jobs/:id/status` to check job progress.

---

## 🔐 Key Design & Security Concepts

### ✅ Managed Identity (This Repository)

This API uses **Azure Managed Identity** to authenticate with services like Service Bus and Key Vault. No connection strings or secrets are stored in configs — enabling secure, passwordless communication between Azure services.

### 🔐 Environment Secrets (Worker Repository)

The Azure Function worker retrieves secrets from **Azure Application Settings**. This is a best-practice security feature that provides the application with an identity in Azure Active Directory, allowing it to authenticate with other Azure resources (like Service Bus and Key Vault) without needing any connection strings or secrets stored in the application's configuration. This passwordless approach significantly enhances the security posture of the application.

### 📄 Secure File Downloads via API Streaming

- **Secure Fetch:** Files are securely fetched from private Blob Storage using the API’s Managed Identity.
- **Efficient Streaming:** Files are streamed directly to clients without loading into memory.
- **Controlled Response:** Custom headers like `Content-Disposition` and `Cache-Control` are set by the API.

This method protects storage assets while delivering excellent performance.

## 🛠️ Technology Stack

- **Framework:** [NestJS](https://nestjs.com/) (TypeScript)
- **Database:** Azure Cosmos DB (MongoDB API)
- **Messaging:** Azure Service Bus
- **Node.js Version:** v22.x (Azure App Service compatibility)

---

## ⚙️ Environment Setup & Deployment

### ▶️ Local Execution

This project is architected to be deployed and run within the Azure ecosystem. Due to its use of **Managed Identity** for connecting to other Azure resources, it is not possible to replicate the full functionality on a local machine without significant and complex environment simulation.

The primary purpose of this repository is to showcase a production-ready architecture deployed on Azure.

### ☁️ Azure Deployment

This API was successfully deployed and validated on **Azure App Service**. The deployment process confirmed that the Managed Identity was correctly configured and that the API could successfully communicate with all other Azure resources:

- Azure Service Bus
- Azure Cosmos DB
- Azure Key Vault
- Azure Blob Storage

> ℹ️ To reduce costs, live Azure resources are not kept running continuously. The codebase is **deployment-ready**.

---

## 🔮 Future Improvements

- ✅ Add authentication/authorization (JWT + Guards)
- ⚙️ Implement CI/CD with GitHub Actions
- 🧪 Add unit/integration tests using Jest
- ➕ Expand job types (e.g., report generation)

---

## ✍️ Author

**Cauã Vinicius**

[LinkedIn Profile](https://www.linkedin.com/in/caua-vinicius/)
