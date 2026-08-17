# Digital Seba Resources - Implementation Guide

## 📋 Overview

This project provides a comprehensive Resources section for Digital Seba with:
- ✅ Bilingual support (Bengali & English)
- ✅ Clean, professional card-based design
- ✅ Search and filter functionality
- ✅ Automatic duplicate detection
- ✅ Invalid link reporting
- ✅ Organized folder structure
- ✅ Mobile-responsive layout

## 🚀 How to Add Your Google Drive Links

### Step 1: Prepare Your Data

Open the file: `src/data/resources-data.ts`

### Step 2: Format Your Links

Use this format:

```
## Folder Name / Bengali Name
File Name 1 https://drive.google.com/file/d/FILE_ID_1/view
File Name 2 https://drive.google.com/file/d/FILE_ID_2/view

## Another Folder / আরেকটি ফোল্ডার
File Name 3 https://drive.google.com/file/d/FILE_ID_3/view
File Name 4 https://docs.google.com/document/d/DOC_ID/edit
```

### Example:

```typescript
export const RAW_RESOURCES_DATA = `
## Academic Materials / একাডেমিক ম্যাটেরিয়াল
Introduction to Programming https://drive.google.com/file/d/1ABC123XYZ/view
Advanced Database Concepts https://drive.google.com/file/d/1DEF456UVW/view
Web Development Guide https://docs.google.com/document/d/1GHI789RST/edit

## Training Materials / প্রশিক্ষণ সামগ্রী
Video Tutorial - Basics https://drive.google.com/file/d/1JKL012MNO/view
Training Manual PDF https://drive.google.com/file/d/1PQR345STU/view

## Forms and Templates / ফর্ম এবং টেমপ্লেট
Application Form Template https://docs.google.com/spreadsheets/d/1VWX678YZA/edit
Registration Form https://drive.google.com/file/d/1BCD901EFG/view
`;
```

### Step 3: Supported URL Formats

The system automatically detects these Google Drive URL formats:

- `https://drive.google.com/file/d/FILE_ID/view`
- `https://drive.google.com/open?id=FILE_ID`
- `https://drive.google.com/folders/FOLDER_ID`
- `https://docs.google.com/document/d/DOC_ID/edit`
- `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`
- `https://docs.google.com/presentation/d/SLIDES_ID/edit`

## 📊 View Parsing Report

After adding your links, visit:
```
http://localhost:3000/resources/report
```

This page shows:
- Total, unique, duplicate, and invalid link counts
- Folder breakdown with file counts
- List of duplicate URLs (to remove)
- List of invalid URLs (to fix)
- Complete resource hierarchy

## 🎨 Customization

### Change Colors

Edit `src/app/resources/resources-client.tsx`:

```typescript
// Primary button color
className="bg-blue-600 hover:bg-blue-700"

// Badge color
className="bg-blue-100 text-blue-800"

// Change to green theme:
className="bg-green-600 hover:bg-green-700"
className="bg-green-100 text-green-800"
```

### Change Layout

Grid columns can be adjusted:
```typescript
// Currently: 1 col mobile, 2 col tablet, 3 col desktop
className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"

// Change to 4 columns on large screens:
className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
```

### Add Bengali Folder Names

In your data file, use this format:
```
## English Name / বাংলা নাম
```

The system automatically splits on ` / ` and displays both.

## 🔍 Features

### Search
Users can search for any file by name across all folders.

### Filter by Type
Automatically detects file types (PDF, DOC, SHEET, etc.) and allows filtering.

### Responsive Design
Works perfectly on mobile, tablet, and desktop.

### Hover Effects
Smooth transitions and shadows on card hover.

### External Links
All Drive links open in new tabs with proper security (`noopener noreferrer`).

## 📁 File Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage with hero section
│   ├── resources/
│   │   ├── page.tsx                # Resources main page
│   │   ├── resources-client.tsx     # Client component with search/filter
│   │   └── report/
│   │       └── page.tsx             # Parsing report page
├── data/
│   └── resources-data.ts            # YOUR GOOGLE DRIVE LINKS GO HERE
└── lib/
    └── parse-resources.ts           # Parser utility
```

## 🛠️ Maintenance

### Adding New Resources
1. Open `src/data/resources-data.ts`
2. Add new lines in the correct folder section
3. Save the file
4. Check `/resources/report` for any issues
5. View the updated resources at `/resources`

### Removing Duplicates
1. Visit `/resources/report`
2. Check the "Duplicate URLs" section
3. Remove duplicate entries from `resources-data.ts`

### Fixing Invalid Links
1. Visit `/resources/report`
2. Check the "Invalid URLs" section
3. Correct or remove invalid links from `resources-data.ts`

## 🎯 Quality Checklist

Before deploying, ensure:
- [ ] All Google Drive links are publicly accessible
- [ ] No duplicate URLs exist
- [ ] No invalid URLs exist
- [ ] All folders have meaningful names
- [ ] Bengali translations are accurate
- [ ] File names are descriptive
- [ ] Report page shows no errors
- [ ] Resources page displays correctly
- [ ] Search functionality works
- [ ] Filter functionality works
- [ ] Mobile view is responsive

## 🌐 URLs

- Homepage: `/`
- Resources: `/resources`
- Report: `/resources/report`

## 💡 Tips

1. **Keep file names descriptive**: Instead of "Document1", use "Digital Marketing Guide 2024"
2. **Group related files**: Put all training materials in one folder
3. **Use bilingual names**: Makes it accessible to both English and Bengali speakers
4. **Test links before adding**: Ensure they're publicly accessible
5. **Regular maintenance**: Check for broken links monthly

## 🔒 Security

- All external links use `rel="noopener noreferrer"`
- No sensitive data is stored in the codebase
- Google Drive permissions control file access

## 📝 Notes

- The parser automatically extracts file types from URLs and filenames
- Folders are created by lines starting with `##`
- Each file should be on its own line
- URLs are validated before being added to the resources
- Duplicates are automatically detected and reported

---

**Need Help?**
Check the `/resources/report` page for detailed analysis of your resource structure.
