# Product Searcher

A comprehensive Next.js application that provides product search and comparison across multiple Japanese e-commerce platforms, along with PDF to CSV conversion capabilities.

## 🚀 Features

### 🔍 Product Search & Comparison
- **Multi-platform Search**: Search products across Amazon, Yahoo Shopping, and Rakuten
- **JAN Code Integration**: Automatic JAN code detection and search
- **Price Comparison**: Compare prices across different platforms
- **Top Products Display**: Shows the 3 cheapest products across all platforms
- **Real-time Search**: Instant search results with React Query caching

### 📄 PDF to CSV Converter
- **PDF Upload**: Drag and drop or click to upload PDF files
- **Custom Format Parsing**: Define custom column formats for data extraction
- **AI-Powered Parsing**: Uses Google's Generative AI for intelligent data extraction
- **CSV Export**: Download extracted data as CSV files
- **Multiple Item Support**: Handles multiple item numbers and equivalent items

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **State Management**: TanStack React Query + Redux Toolkit
- **UI Components**: Material-UI + Radix UI
- **PDF Processing**: PDF-lib + Google Generative AI

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# API Configuration
API_ENDPOINT=http://localhost:8000
API_TOKEN=your_api_token_here

# App Configuration
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_HOST=http://localhost:3000
```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd product-search-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Product Search
1. Navigate to the home page (`/`)
2. Enter a product name or model number in the search box
3. Click "検索" (Search) or press Enter
4. View results from Amazon, Yahoo Shopping, and Rakuten
5. Compare prices and find the best deals

### PDF to CSV Conversion
1. Navigate to `/pdf-converter`
2. Upload a PDF file using the upload area
3. Define the column format (e.g., "No, 品名, 型番, 数量, 単価, 金額")
4. Click "変換する" (Convert)
5. Download the generated CSV file

## 🌐 API Endpoints

### Product Search
- **POST** `/api/search`
  - Searches products across multiple platforms
  - Requires `keyword` in request body
  - Returns product data with JAN codes

### PDF Parser
- **POST** `/api/parser`
  - Parses PDF files and extracts structured data
  - Requires `pdf` file and `formats` array
  - Returns extracted data in JSON format

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Compatible with Next.js
- **AWS Amplify**: Full support for Next.js apps
- **Docker**: Use `Dockerfile` for containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
