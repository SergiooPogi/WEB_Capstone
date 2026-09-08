# GabAI - Eastern Mindoro College Navigation System

A professional campus navigation and admission assistance system built with React and Express.js for your capstone project.

## 🎯 Features

### 1. **AI-Powered Q&A Assistant**
- RAG-based (Retrieval-Augmented Generation) chatbot
- Natural Language Processing for intelligent query matching
- Real-time responses with confidence scoring
- User feedback system (helpful/not helpful)
- Comprehensive FAQ database covering:
  - Admission requirements
  - Enrollment deadlines
  - Document submission
  - Available programs
  - Campus locations
  - Tuition fees
  - Scholarships

### 2. **Interactive Campus Map**
- Click-to-navigate building selection
- Turn-by-turn route visualization (like Google Maps/Waze)
- Distance and walking time calculation
- Building details with photos
- Office and facility listings
- Operating hours information
- Search and filter by category
- Real-time route highlighting

### 3. **Admin Dashboard**
- Complete FAQ management (Create, Read, Update, Delete)
- User management and monitoring
- Building/location management
- Real-time statistics and analytics
- System status monitoring
- Chat log analytics
- Role-based access control

### 4. **Enrollment Guide**
- Step-by-step enrollment process
- Document checklist
- Progress tracking
- Downloadable resources

## 🚀 Technology Stack

### Frontend
- **React 19** - Modern UI library
- **Vite** - Fast build tool
- **React Router 7** - Client-side routing
- **Tailwind CSS 4** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Lucide Icons** - Beautiful icon set

### Backend
- **Express.js** - Web framework
- **Sequelize ORM** - Database management
- **MySQL** - Relational database
- **Bcrypt** - Password hashing
- **Express Session** - Session management
- **CORS** - Cross-origin resource sharing

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MySQL Server
- npm or yarn

### 1. Clone the Repository
```bash
cd WEB_Capstone-main
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install --legacy-peer-deps
```

### 4. Database Configuration
1. Ensure MySQL is running
2. Update database credentials in `backend/models/db.js` if needed:
```javascript
export const sequelize = new Sequelize("backend", "root", "", {
  host: "localhost",
  dialect: "mysql"
});
```

### 5. Seed Database
```bash
cd backend
npm run seed
```

This will create:
- Admin user (admin@emc.edu.ph / admin123)
- Test user (john@example.com / user123)
- 8 FAQs with keywords
- 7 campus buildings

### 6. Start Development Servers

**Backend (Terminal 1):**
```bash
cd backend
npm run xian
```
Server runs at: http://localhost:3000

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```
Server runs at: http://localhost:5173

## 🔐 Admin Access

**Admin Dashboard:** http://localhost:5173/admin

**Credentials:**
- Email: `admin@emc.edu.ph`
- Password: `admin123`

## 📱 User Access

**Main Application:** http://localhost:5173

**Test User Credentials:**
- Email: `john@example.com`
- Password: `user123`

## 🗂️ Project Structure

```
WEB_Capstone-main/
├── backend/
│   ├── controllers/
│   │   ├── authController.js      # Authentication logic
│   │   ├── chatController.js      # RAG chatbot logic
│   │   ├── adminController.js     # Admin operations
│   │   └── buildingController.js  # Building management
│   ├── models/
│   │   ├── userModel.js           # User schema
│   │   ├── faqModel.js            # FAQ schema
│   │   ├── chatLogModel.js        # Chat history schema
│   │   └── buildingModel.js       # Building schema
│   ├── routes/
│   │   └── index.js               # API routes
│   ├── index.js                   # Express server
│   ├── seed.js                    # Database seeder
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Navigation bar
│   │   │   ├── Footer.jsx         # Footer
│   │   │   ├── FloatingChat.jsx   # Chat widget
│   │   │   └── ui/                # Reusable UI components
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Landing page
│   │   │   ├── QAChat.jsx         # AI chatbot page
│   │   │   ├── CampusMap.jsx      # Interactive map
│   │   │   ├── AdminDashboard.jsx # Admin panel
│   │   │   ├── Login.jsx          # Login page
│   │   │   └── SignUp.jsx         # Registration page
│   │   ├── routes.jsx             # Route definitions
│   │   ├── App.jsx                # Main app component
│   │   └── main.jsx               # Entry point
│   └── package.json
│
└── README.md
```

## 🎨 Key Features Explained

### RAG-Based Chatbot
The Q&A Assistant uses a simplified RAG (Retrieval-Augmented Generation) approach:
1. User sends a question
2. System calculates similarity with FAQ keywords using NLP
3. Returns best matching answer with confidence score
4. Logs conversation for analytics
5. Allows user feedback to improve responses

### Interactive Campus Map
The campus map provides Google Maps/Waze-like navigation:
1. Click first building to set start point (green marker)
2. Click second building to set destination (red marker)
3. System calculates route and displays:
   - Distance in meters
   - Estimated walking time
   - Visual route line
4. Click building markers to view details and photos
5. Search and filter buildings by category

### Admin Dashboard
Full-featured admin panel with:
- **Dashboard**: Real-time stats, system status
- **FAQ Management**: CRUD operations for chatbot knowledge base
- **User Management**: View and manage registered users
- **Building Management**: Update campus locations and details
- **Settings**: System configuration options

## 🔧 API Endpoints

### Public Endpoints
- `POST /api/chat/message` - Send message to chatbot
- `POST /api/chat/feedback` - Rate chatbot response
- `GET /api/buildings` - Get all buildings
- `GET /api/buildings/:id` - Get building details

### Admin Endpoints (Requires Authentication)
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/faqs` - List all FAQs
- `POST /api/admin/faqs` - Create new FAQ
- `PUT /api/admin/faqs/:id` - Update FAQ
- `DELETE /api/admin/faqs/:id` - Delete FAQ
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id` - Update user
- `POST /api/admin/buildings` - Create building
- `PUT /api/admin/buildings/:id` - Update building
- `DELETE /api/admin/buildings/:id` - Delete building

## 📝 Database Schema

### Users Table
- id, name, email, password (hashed)
- role (user/admin)
- isActive, createdAt, updatedAt

### FAQs Table
- id, question, answer, category
- keywords (JSON array for NLP matching)
- views, helpful, notHelpful
- isActive, createdAt, updatedAt

### Buildings Table
- id, name, shortName, category
- description, offices (JSON array)
- hours, coordinates (JSON)
- imageUrl, floorPlan (JSON)
- isActive, createdAt, updatedAt

### ChatLogs Table
- id, userId, sessionId
- userMessage, botResponse
- confidence, matchedFaqId
- responseTime, wasHelpful
- createdAt, updatedAt

## 🎓 For Your Professor

### RAG Implementation
The chatbot uses a keyword-based similarity matching algorithm that:
- Tokenizes user input
- Compares against FAQ keywords
- Calculates confidence scores
- Returns best match above threshold
- Falls back to generic response if confidence is low

This is a practical implementation suitable for a capstone project. For production, you could integrate:
- OpenAI GPT API
- Sentence transformers for embeddings
- Vector databases (Pinecone, Weaviate)
- Fine-tuned language models

### Campus Map Navigation
The interactive map provides:
- Visual route planning between buildings
- Distance and time calculations
- Building information panels
- Photo display capability (ready for when you add floor plans)
- Scalable architecture for adding more buildings

**Note:** When you have floor plans or campus maps, simply:
1. Add images to `frontend/public/images/`
2. Update building records with image URLs
3. The system will automatically display them

## 🚧 Future Enhancements

1. **Floor Plans**: Add detailed building floor plans
2. **Real Photos**: Upload actual campus building photos
3. **3D Map**: Integrate 3D campus visualization
4. **Mobile App**: React Native version
5. **Push Notifications**: Real-time alerts
6. **Advanced NLP**: Integrate GPT-4 or similar
7. **Voice Assistant**: Speech-to-text integration
8. **Analytics Dashboard**: Advanced reporting

## 📄 License

MIT License - Copyright (c) 2025 Christian I. Cabrera || XianFire Framework

## 👨‍💻 Development

**Scripts:**
```bash
# Backend
npm run xian          # Start with nodemon (auto-reload)
npm run xian-start    # Start without auto-reload
npm run seed          # Seed database
npm run migrate       # Run migrations

# Frontend
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview production build
```

## 🐛 Troubleshooting

**Database Connection Error:**
- Ensure MySQL is running
- Check credentials in `backend/models/db.js`
- Run `npm run seed` to create tables

**CORS Error:**
- Backend must run on port 3000
- Frontend must run on port 5173
- Check CORS configuration in `backend/index.js`

**Admin Access Denied:**
- Ensure you're logged in with admin account
- Check session cookies are enabled
- Try clearing browser cache

## 📞 Support

For issues or questions about this capstone project, please refer to the code comments and this documentation.

---

**Built with ❤️ for Eastern Mindoro College**
