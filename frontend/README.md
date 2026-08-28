![MasterHead](https://okhosting.com/wp-content/uploads/Software.jpg)
# Parking Management System 🚗

Welcome to the **Parking Management System** project! This is a **React**-based application that allows managing vehicle entries, exits, and statistics in a parking lot.  
The application consumes the **Parking Management API**, deployed at: [Parking Management API](https://parking-management-api-k4ih.onrender.com/)  

Frontend in production: [Website](https://aplicacion-de-gestion-para-parqueadero.vercel.app)

---

## Overview 🌐

**StellarPark** is a web-based parking management system designed to handle:  

- **Vehicle tracking**  
- **User management** (clients and administrative staff)  
- **Administrative operations**  

The system supports three user types: public visitors, registered clients, and administrative personnel, each with tailored interfaces and functionality.  

---

## Key Features ✨

- **Vehicle registration**: Record vehicle entries.  
- **Exit control**: Track vehicle exits and calculate parking fees.  
- **Real-time statistics**: Shows parked vehicles, daily revenue, and available spaces.  
- **Multi-user management**: Different interfaces for clients and admins with role-based access.  
- **AI assistant**: ChatBot available to all authenticated users.  
- **User-friendly, responsive UI**: Mobile-first design using Tailwind CSS.  

---

## System Architecture 🏗️

- **Frontend**: React SPA using **Vite** for development and build.  
- **Routing**: React Router DOM for client-side navigation.  
- **Styling**: Tailwind CSS, mobile-first and responsive.  
- **HTTP client**: Axios for backend API requests.  
- **State management**: useState and centralized services (AuthService) for session handling.  
- **Deployment**: Vercel for static hosting; GitHub Pages optional.  
- **AI Integration**: Virtual Assistant via `VITE_API_BREINLOGIC_URL`.  

**Key Components**:  
- `App.jsx`: Entry point with route mapping and user flow.  
- `Login.jsx` and `LoginClient.jsx`: Authentication handling for different roles.  
- `AdminHomeDashboard.jsx`: Admin dashboard with session control.  
- `services/AuthService.js`: Token management and authentication verification.  

---

## Technologies Used 🛠️

| Technology | Purpose | Version |
|------------|---------|--------|
| React | UI framework and components | ^18.2.0 |
| Vite | Build tool and dev server | ^5.1.4 |
| React Router DOM | Client-side routing | ^7.2.0 |
| Tailwind CSS | Utility-first CSS framework | ^3.4.1 |
| Axios | HTTP client | ^1.8.4 |
| Lucide React | Icon library | ^0.344.0 |

---

## Installation & Setup ⚙️

### Local
1. Clone repository:
```bash
git clone https://github.com/tu-usuario/parqueadero-react.git
cd parqueadero-react
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm start
```

4. Open `http://localhost:3000` in your browser.

### Environment Variables

Create a `.env` file with the following variables:

```env
VITE_API_URL=https://parking-management-api-k4ih.onrender.com
VITE_API_BREINLOGIC_URL=<AI service endpoint>
```

---

## Project Structure 📂

```
parqueadero-react/
├── public/                  # Public files (HTML, images, etc.)
├── src/                     # Source code
│   ├── assets/              # Images and logos
│   ├── components/          # Reusable components
│   ├── pages/               # Application pages
│   ├── services/            # Business logic and API
│   ├── styles/              # CSS / Tailwind
│   ├── App.jsx              # Main component
│   └── main.jsx             # React/Vite entry point
├── .gitignore
├── package.json
└── README.md
```

---

## Screenshots 📸

*Home Page*  
![alt text](<img_md/Imagen de WhatsApp 2025-09-03 a las 11.04.30_43019ea4.jpg>)

*Client Registration*  
![alt text](img_md/image.png)

*Client Login*  
![alt text](<img_md/Imagen de WhatsApp 2025-09-03 a las 11.11.13_08042782.jpg>)

*Employee Login*  
![alt text](<img_md/Imagen de WhatsApp 2025-09-03 a las 11.11.13_d259503a.jpg>)

*Dashboard*  
![alt text](<img_md/Imagen de WhatsApp 2025-09-03 a las 11.04.30_4fa49f51.jpg>)

*Client Management*  
![alt text](<img_md/Imagen de WhatsApp 2025-09-03 a las 11.08.57_1f26e31e.jpg>)

*Admin Management*  
![alt text](<img_md/Imagen de WhatsApp 2025-09-03 a las 11.19.11_61373be4.jpg>)

*AI Support Agent*  
![alt text](<img_md/Imagen de WhatsApp 2025-09-03 a las 11.21.52_d20782a3.jpg>)

---

## Login Flow 🔑

* **Admins/Employees**: `Login.jsx` → POST to `${VITE_API_URL}/Administrador/login`  
* **Clients**: `LoginClient.jsx` → POST to `${VITE_API_URL}/Cliente/login`  
* Token management via `AuthService.js` → localStorage  
* Redirect to appropriate dashboard if session is valid  

---

## Contributing 🚀

1. Fork the repository.  
2. Create a branch: `git checkout -b feature/new-feature`.  
3. Make changes and commit: `git commit -m 'Add new feature'`.  
4. Push the branch: `git push origin feature/new-feature`.  
5. Open a **Pull Request** describing your changes.  

---

## License 📄

MIT License. See [LICENSE](LICENSE) for details.

---

## Contact 📧

* **Name**: Breiner Martínez  
* **Email**: [breynersmartinezmunoz@gmail.com](mailto:breynersmartinezmunoz@gmail.com)  
* **GitHub**: [@Breynersmartinez](https://github.com/Breynersmartinez)  
* **Website**: [https://aplicacion-de-gestion-para-parqueadero.vercel.app](https://aplicacion-de-gestion-para-parqueadero.vercel.app)

---

Thank you for visiting the project! 😊
