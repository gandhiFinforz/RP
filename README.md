# RinggitPay Website

Modern, animated payment gateway website built with React, Next.js, and Framer Motion.

## 🚀 Features

- ✨ Smooth animations with Framer Motion
- 🎨 Blue and white gradient design
- 📱 Fully responsive layout
- ⚡ Next.js for optimal performance
- 🎯 Reusable animated components
- 🔄 Infinite sliders and carousels
- 📊 Review carousel with navigation
- 🎪 Scrollable card stacks
- 🌊 Hole background effects

## 📦 Components

- **Navbar** - Fixed navigation with smooth animations
- **Hero** - Landing section with floating cards
- **Features** - 6 feature cards with hover effects
- **InfiniteSlider** - Continuously scrolling company logos
- **ReviewsCarousel** - Testimonials with navigation
- **ScrollableCardStack** - Multi-step process with stacking effect
- **MotionCarousel** - Industry solutions with motion
- **CTA** - Call-to-action section with stats
- **Footer** - Complete footer with links

## 🛠️ Tech Stack

- **Next.js 14** - React framework
- **Framer Motion** - Animation library
- **Tailwind CSS** - Utility-first CSS
- **React 18** - UI library

## 📋 Prerequisites

- Node.js 16+ 
- npm or yarn

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd D:\Projects\RP
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
npm start
```

## 📝 Customization

### Update Content

Edit the content directly in each component file:

- `components/Navbar.jsx` - Navigation items
- `components/Hero.jsx` - Hero headline and CTA
- `components/Features.jsx` - Feature list (features array)
- `components/InfiniteSlider.jsx` - Companies (companies array)
- `components/ReviewsCarousel.jsx` - Reviews (reviews array)
- `components/MotionCarousel.jsx` - Solutions (solutions array)
- `components/CTA.jsx` - Call-to-action content

### Update Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: '#0066FF',      // Change primary blue
  'primary-dark': '#0052CC'
}
```

Or use Tailwind color utilities in components.

### Add Images

Replace text/emojis with image tags:

```jsx
// Instead of:
<div className="text-4xl">💳</div>

// Use:
<img src="/images/payment.png" alt="Payment" className="w-12 h-12" />
```

Create a `public/images` folder for your assets.

## 🎨 Color Scheme

- **Primary Blue**: `#0066FF` (main actions, accents)
- **Dark Blue**: `#0052CC` (hover states)
- **Background**: White to Blue gradient
- **Text**: Gray 900 (dark content), Gray 600 (secondary)

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

## 🔧 Configuration

### Animation Timing

Adjust animation delays and durations in individual components:

```jsx
transition={{ duration: 0.8, delay: 0.2 }}
```

### Hover Effects

Customize hover states:

```jsx
whileHover={{ scale: 1.05, y: -5 }}
whileTap={{ scale: 0.95 }}
```

## 📚 File Structure

```
D:\Projects\RP
├── app/
│   ├── layout.jsx        # Root layout
│   ├── page.jsx          # Homepage
│   └── globals.css       # Global styles
├── components/
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── Features.jsx
│   ├── InfiniteSlider.jsx
│   ├── ReviewsCarousel.jsx
│   ├── ScrollableCardStack.jsx
│   ├── MotionCarousel.jsx
│   ├── CTA.jsx
│   └── Footer.jsx
├── public/               # Static assets
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── next.config.js
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Deploy to Other Platforms

The project is a standard Next.js app and can be deployed to:
- Netlify
- AWS Amplify
- Docker containers
- Traditional hosting (with Node.js)

## 🎯 Performance Tips

1. **Image Optimization**: Use Next.js Image component
2. **Code Splitting**: Components auto-split with Next.js
3. **CSS**: Tailwind purges unused styles automatically
4. **Animations**: Framer Motion optimizes with transform/opacity

## 📖 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Framer Motion Docs](https://www.framer.com/motion)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 🤝 Support

For issues or customizations, check the component files for detailed comments and adjust animations/colors as needed.

## 📄 License

Private project - RinggitPay
