# Digital Seba Resources Portal

A comprehensive, bilingual resources management system for Digital Seba with automatic validation, search, and filtering capabilities.

## 🎯 Overview

This is a complete **Next.js + PostgreSQL** application that provides:

- 📚 **Resources Management** - Organized folder-based structure
- 🔍 **Search & Filter** - Real-time search and file type filtering
- 🌐 **Bilingual Support** - Full Bengali (বাংলা) and English support
- ✅ **Validation** - Automatic duplicate and invalid link detection
- 📊 **Reporting** - Detailed parsing and statistics reports
- 🎨 **Modern UI** - Clean, responsive, card-based design
- 🔧 **Admin Panel** - Easy-to-use data management interface

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- Git (optional)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL

# Run database migrations (if any)
npm run db:push

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
.
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Homepage
│   │   ├── layout.tsx          # Root layout with navigation
│   │   ├── admin/              # Admin panel
│   │   ├── resources/          # Resources pages
│   │   └── api/                # API routes
│   │
│   ├── components/             # React components
│   │   └── navigation.tsx      # Bilingual navigation
│   │
│   ├── data/                   # Data files
│   │   └── resources-data.ts   # ⭐ ADD YOUR LINKS HERE
│   │
│   ├── lib/                    # Utility libraries
│   │   ├── parse-resources.ts  # Resource parser
│   │   └── format-converter.ts # Format auto-converter
│   │
│   └── db/                     # Database
│       ├── index.ts            # DB connection
│       └── schema.ts           # DB schema
│
├── Documentation/              # Detailed guides
│   ├── QUICK_START_GUIDE.md
│   ├── RESOURCES_INSTRUCTIONS.md
│   ├── IMPLEMENTATION_SUMMARY.md
│   └── FINAL_OUTPUT_SUMMARY.md
│
└── public/                     # Static assets
```

## 🎯 Adding Your Resources

### Method 1: Admin Panel (Recommended)

1. Visit `/admin`
2. Paste your Google Drive links
3. Click "Auto Convert Format" (if needed)
4. Click "Parse & Validate"
5. Fix any errors
6. Click "Copy Code"
7. Paste into `src/data/resources-data.ts`
8. Save and refresh `/resources`

### Method 2: Direct Editing

Edit `src/data/resources-data.ts`:

```typescript
export const RAW_RESOURCES_DATA = `
## Academic Materials / একাডেমিক ম্যাটেরিয়াল
Programming Guide https://drive.google.com/file/d/ABC123/view
Database Tutorial https://drive.google.com/file/d/DEF456/view

## Training Materials / প্রশিক্ষণ সামগ্রী
Video Course https://drive.google.com/file/d/GHI789/view
PDF Manual https://drive.google.com/file/d/JKL012/view
`;
```

## 📋 Available Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero and features |
| `/resources` | Main resources page with search/filter |
| `/resources/report` | Detailed parsing report with statistics |
| `/admin` | Admin panel for validating and parsing data |
| `/api/health` | Health check endpoint |

## 🎨 Features

### Core Features
- ✅ Bilingual UI (English/Bengali)
- ✅ Real-time search across all files
- ✅ Filter by file type (PDF, DOC, SHEET, etc.)
- ✅ Automatic file type detection
- ✅ Duplicate link detection
- ✅ Invalid link validation
- ✅ Folder-based organization
- ✅ Responsive design (mobile/tablet/desktop)

### Technical Features
- ✅ TypeScript for type safety
- ✅ Next.js 16 with App Router
- ✅ PostgreSQL with Drizzle ORM
- ✅ Tailwind CSS for styling
- ✅ Server-side rendering
- ✅ Static page generation where possible
- ✅ Production-ready build

## 🔧 Development

```bash
# Development server
npm run dev

# Type checking
npm run typecheck

# Build for production
npm run build

# Start production server
npm run start

# Database push (apply schema changes)
npm run db:push
```

## 📊 Supported URL Formats

The system accepts Google Drive URLs in these formats:

- `https://drive.google.com/file/d/FILE_ID/view`
- `https://drive.google.com/open?id=FILE_ID`
- `https://docs.google.com/document/d/DOC_ID/edit`
- `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`
- `https://docs.google.com/presentation/d/SLIDES_ID/edit`

## 🎨 Customization

### Change Primary Color

Find and replace in `src/app/resources/resources-client.tsx`:

```typescript
// Blue to Green
bg-blue-600 → bg-green-600
bg-blue-700 → bg-green-700
```

### Change Grid Layout

```typescript
// 3 columns (current)
className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"

// 4 columns
className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
```

## 📖 Documentation

Comprehensive documentation available in the project:

- **QUICK_START_GUIDE.md** - Get started in 5 minutes
- **RESOURCES_INSTRUCTIONS.md** - Detailed implementation guide
- **IMPLEMENTATION_SUMMARY.md** - Technical overview
- **FINAL_OUTPUT_SUMMARY.md** - Expected outputs and features

## 🔍 Quality Assurance

All validation tests passed:

- ✅ TypeScript compilation - No errors
- ✅ Production build - Successful
- ✅ Runtime tests - All passing
- ✅ Responsive design - Mobile/tablet/desktop
- ✅ Accessibility - WCAG compliant
- ✅ Performance - Optimized bundle

## 🔒 Security

- All external links use `rel="noopener noreferrer"`
- URL validation before display
- No sensitive data in codebase
- Type-safe implementation
- XSS protection via React
- CSRF protection via Next.js

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS/Android)

## 🛠️ Troubleshooting

### Resources not showing?
1. Check `src/data/resources-data.ts` has data
2. Visit `/resources/report` for errors
3. Verify URL format matches examples

### Duplicates detected?
1. Visit `/resources/report`
2. See "Duplicate URLs" section
3. Remove duplicates from data file

### Search not working?
1. Clear browser cache
2. Check browser console
3. Verify JavaScript is enabled

## 📞 Support

- Check `/admin` for data validation
- Review `/resources/report` for detailed errors
- Read documentation files for guidance

## 🎯 Production Deployment

```bash
# Build optimized production bundle
npm run build

# Start production server
npm run start

# Or deploy to Vercel/Netlify/etc.
# (Next.js apps deploy easily to major platforms)
```

## 📄 License

This project is built for Digital Seba.

## ✨ Credits

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Drizzle ORM](https://orm.drizzle.team/) - Database
- [PostgreSQL](https://www.postgresql.org/) - Database

---

## 🚀 Current Status

**✅ PRODUCTION READY**

The application is fully functional and waiting for your Google Drive links to be added.

**Next Step**: Add your resources to `src/data/resources-data.ts`

**Time Required**: 5-10 minutes

---

**Need help?** Check the documentation files or visit `/admin` for an interactive guide.
