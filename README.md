# MoodTrip 🧳✨

**AI-Powered Group Travel Planning with Collaborative Moodboards**

MoodTrip is a modern web application that helps groups plan travel experiences through AI-generated moodboards, collaborative voting, and smart availability matching. Built with Next.js 15, TypeScript, and Tailwind CSS.

## ✨ Features

### 🎨 **AI-Generated Moodboards**
- **DALL-E 3 Integration** - Generate stunning travel images from text prompts
- **Color Palette Extraction** - Automatically extract 5-color palettes from images
- **AI Summaries** - GPT-4o-mini generates evocative descriptions
- **Smart Tags** - Automatic categorization and tagging

### 👥 **Collaborative Planning**
- **Group-Based Organization** - Create and manage travel groups
- **Voting System** - Up/Maybe/Down voting with real-time counts
- **Comments & Discussion** - Threaded conversations on ideas
- **Group Fit Scoring** - Smart matching based on availability

### 📅 **Availability Management**
- **Personal Sliders** - Set availability (0-100%) for each month
- **Group Heatmaps** - Visual representation of group availability
- **Smart Recommendations** - Best months for group travel
- **Weighted Scoring** - Adjacent months get 0.5x weight

### 🗺️ **Trip Planning**
- **Kanban Boards** - TODO/DOING/DONE task management
- **Task Creation** - Add and assign tasks to trip members
- **Status Tracking** - Visual progress monitoring
- **Idea Promotion** - Convert ideas to actionable trips

### 📊 **Analytics & Notifications**
- **PostHog Integration** - Track user engagement and behavior
- **Real-time Notifications** - New ideas, trip promotions, comments
- **Email Ready** - Prepared for Resend/Postmark integration
- **PWA Push** - Ready for push notification implementation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database
- OpenAI API key
- Unsplash API key (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/moodtrip.git
   cd moodtrip
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/moodtrip"
   
   # OpenAI
   OPENAI_API_KEY="sk-your-openai-key"
   
   # Unsplash (optional)
   UNSPLASH_ACCESS_KEY="your-unsplash-key"
   
   # PostHog (optional)
   NEXT_PUBLIC_POSTHOG_KEY="phc-your-posthog-key"
   NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"
   ```

4. **Set up the database**
   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3001](http://localhost:3001)

## 📱 Screenshots

### 🏠 **Group Feed**
![Group Feed](https://via.placeholder.com/800x600/3B82F6/FFFFFF?text=Group+Feed+with+Ideas)
- Beautiful masonry grid layout
- AI-generated cover images
- Group fit badges
- Vote counts and engagement metrics

### 💡 **Create Idea**
![Create Idea](https://via.placeholder.com/800x600/8B5CF6/FFFFFF?text=Create+New+Idea)
- Intuitive form with chips for budget, month, kids-friendly
- Real-time validation
- Smooth animations and transitions

### 🎨 **Idea Detail**
![Idea Detail](https://via.placeholder.com/800x600/10B981/FFFFFF?text=Idea+Detail+with+Moodboard)
- Responsive image mosaic
- Color palette with copy-to-clipboard
- AI-generated summary
- Voting and comments section

### 📅 **Availability Page**
![Availability](https://via.placeholder.com/800x600/F59E0B/FFFFFF?text=Availability+Management)
- Interactive month sliders
- Group heatmap visualization
- Best months recommendations

### 🗺️ **Trip Board**
![Trip Board](https://via.placeholder.com/800x600/EF4444/FFFFFF?text=Trip+Planning+Board)
- Kanban-style task management
- Drag-and-drop ready
- Task creation and assignment

## 🏗️ Architecture

### **Frontend**
- **Next.js 15** - App Router with Server Components
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling with custom theme
- **Framer Motion** - Smooth animations and transitions
- **shadcn/ui** - Accessible component library

### **Backend**
- **Server Actions** - Type-safe API endpoints
- **Prisma ORM** - Database management
- **PostgreSQL** - Primary database
- **File System** - Local image storage

### **AI Integration**
- **OpenAI DALL-E 3** - Image generation
- **OpenAI GPT-4o-mini** - Text generation and analysis
- **node-vibrant** - Color palette extraction
- **Unsplash API** - Fallback stock images

### **Analytics & Monitoring**
- **PostHog** - User analytics and event tracking
- **Console Logging** - Development notifications
- **Error Handling** - Comprehensive error management

## 📁 Project Structure

```
moodtrip/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── g/[slug]/          # Group pages
│   │   ├── i/[id]/            # Idea detail pages
│   │   ├── t/[id]/            # Trip board pages
│   │   └── actions.ts         # Server actions
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── TopNav.tsx        # Navigation
│   │   ├── EmptyStates.tsx   # Empty state components
│   │   └── ...
│   ├── lib/                  # Utilities and services
│   │   ├── prisma.ts         # Database client
│   │   ├── ai.ts            # AI service integration
│   │   ├── analytics.ts     # PostHog analytics
│   │   └── notify.ts        # Notification service
│   └── styles/              # Global styles
├── prisma/                  # Database schema
├── public/                  # Static assets
└── README.md
```

## 🎯 Key Features Deep Dive

### **AI Moodboard Generation**
```typescript
// Automatic moodboard creation with idempotency
const generateMoodboard = async (ideaId: string) => {
  // 1. Generate images with DALL-E 3
  const images = await generateImages(prompt)
  
  // 2. Extract color palette
  const palette = await extractPalette(imageUrls)
  
  // 3. Generate AI summary
  const summary = await generateSummary(prompt)
  
  // 4. Update idea status
  await updateIdeaStatus(ideaId, 'PUBLISHED')
}
```

### **Group Fit Calculation**
```typescript
// Smart availability matching
const calculateGroupFit = (ideaId: string) => {
  const targetMonth = idea.monthHint
  const months = [
    { month: targetMonth - 1, weight: 0.5 },
    { month: targetMonth, weight: 1.0 },
    { month: targetMonth + 1, weight: 0.5 }
  ]
  // Calculate weighted average...
}
```

### **Real-time Notifications**
```typescript
// Event-driven notifications
onNewIdea(groupId, ideaId)      // New idea created
onPromoteTrip(groupId, tripId)  // Idea promoted to trip
// Ready for email and PWA push integration
```

## 🔧 Development

### **Available Scripts**
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript checks
```

### **Database Management**
```bash
pnpm prisma generate    # Generate Prisma client
pnpm prisma db push     # Push schema to database
pnpm prisma studio      # Open Prisma Studio
```

### **Environment Variables**
See `.env.local.example` for all required environment variables.

## 🚀 Deployment

### **Vercel (Recommended)**
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### **Docker**
```bash
docker build -t moodtrip .
docker run -p 3001:3001 moodtrip
```

### **Manual Deployment**
```bash
pnpm build
pnpm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for DALL-E 3 and GPT-4o-mini
- **Vercel** for Next.js and deployment platform
- **Tailwind CSS** for the utility-first CSS framework
- **shadcn/ui** for the beautiful component library
- **PostHog** for analytics and user insights

---

**Built with ❤️ for travelers who love beautiful, collaborative planning experiences.**