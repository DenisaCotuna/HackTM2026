# Property Images Setup

## Image Folder Location
Place your property listing images in: `/public/property-images/`

## How to Add Images
1. Add your property images to the `/public/property-images/` folder
2. Update the listings in [app/owners/dashboard/page.tsx](app/owners/dashboard/page.tsx) with your image filenames:

```javascript
const [listings, setListings] = useState([
    { id: 1, photo: '/property-images/listing1.jpg', address: '123 Main St, City Center', price: '€600/month', status: 'Active' },
    { id: 2, photo: '/property-images/listing2.jpg', address: '456 Elm St, Student Complex', price: '€500/month', status: 'Rented' },
    { id: 3, photo: '/property-images/listing3.jpg', address: '789 Oak St, Iulius Town', price: '€700/month', status: 'Paused' }
]);
```

## Design Updates Made

### Dashboard Page (`/owners/dashboard`)
✅ **Soft Colored Bubbles** - Added decorative background bubbles in soft blue and pink  
✅ **Button Colors:**
- **Delete buttons** - Red gradient with white text
- **Edit buttons** - Blue gradient with white text  
- **Search button** - Blue gradient with white text

✅ **Card Styling** - Added soft backdrop filter effects to cards for a modern look

### Search Students Page (`/owners/search`)
✅ **Filter Panel** - Soft green background with subtle borders  
✅ **Student Cards** - Soft pink background with gradient effects  
✅ **Search Button** - Blue gradient styled button matching the dashboard

## CSS Files Updated
- [app/owners/dashboard/dashboard.css](app/owners/dashboard/dashboard.css)
- [app/owners/search/search.css](app/owners/search/search.css)

## Supported Image Formats
- JPG
- PNG
- WebP
- GIF

## Image Size Recommendations
- Width: 400-600px (for good quality on cards)
- Height: 300-400px (maintains aspect ratio)
- File size: < 500KB per image
