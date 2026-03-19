<div align="center">

# 🚛 NeuroFleetX

### AI-Powered Intelligent Fleet Management System

> A full-stack AI-driven fleet management platform with real-time IoT telemetry, predictive maintenance, route optimization, and role-based dashboards.

</div>

---

## ✨ Features

- 🧠 **AI Predictive Maintenance** — Forecasts vehicle breakdowns before they happen
- 🗺️ **Route Optimization** — AI computes the most efficient delivery routes
- 📡 **Real-Time IoT Telemetry** — Live GPS, speed, fuel & engine monitoring
- 👥 **Role-Based Dashboards** — Separate portals for Admin, Driver & Customer
- 🔒 **JWT Authentication** — Secure role-based access control

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18 |
| Backend | JAVA + SpringBoot |
| AI Service | Python (Flask/FastAPI) |
| Database | MySQL |

---

## 🚀 Quick Start

**1. Clone the repo**
```bash
git clone https://github.com/YOUR_USERNAME/neurofleetx.git
cd neurofleetx
```

**2. Start AI Service**
```bash
cd ai-service
pip install -r requirements.txt
python app.py          # http://localhost:8000
```

**3. Start Backend**
```bash
cd backend
npm install && npm run dev    # http://localhost:5000
```

**4. Start Frontend**
```bash
cd frontend
npm install && npm start      # http://localhost:3000
```

**5. Setup Database**
```bash
mysql -u root -p your_db < database/schema.sql
```

---

## 🗂️ Project Structure

```
NEUROFLEETX/
├── ai-service/        # Python ML models (maintenance + routing)
├── backend/           # Node.js REST API
├── database/          # SQL schema
└── frontend/          # React app (Admin, Driver, Customer portals)
```

---

## 👥 User Roles

| Role | Access |
|------|--------|
| 🔴 Admin | Full fleet control, analytics, user management |
| 🟡 Driver | Trip assignments, route navigation, status updates |
| 🟢 Customer | Shipment tracking, delivery ETA, order history |

---

## 📄 License

Licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

<div align="center">

Made with ❤️ by the **NeuroFleetX Team** · ⭐ Star if you find it helpful!

</div>