# RebootFront
This is the frontend part of the Reboot Alert Manager project, built using **Angular** and **TailwindCSS**. It connects to the backend Spring Boot API and displays data related to rebooted and postponed machines, with role-based views for technicians and managers.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.8.

Make sure the following are installed:

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Angular CLI](https://angular.io/cli)
- Git

---

## Clone the Repository


```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

## Install Dependencies


```bash
npm install
```

## Run the Development Server

```bash
ng serve
```
- Open your browser at http://localhost:4200.

## Note

- If any changes are made to the Spring Boot API (backend), make sure to update the API URLs accordingly in:

    - src/app/services/api.service.ts

    - src/app/services/auth.service.ts
