# OpsPilot - AI SOP Generator

A web application that helps micro and small businesses create repeatable Standard Operating Procedures (SOPs) and onboarding checklists using AI.

## Features

- Upload videos (MP4, WebM, Loom) or documents (PDF, DOCX, TXT)
- AI transcription and text extraction
- AI-powered SOP generation using OpenAI GPT-5
- Editable SOP sections (Title, Purpose, Tools, Steps, Notes, Checklist)
- PDF export functionality
- Notion integration
- User authentication with Supabase Auth
- Dashboard to manage all generated SOPs

## Tech Stack

- **Frontend**: Next.js 14 + Tailwind CSS + React Hooks
- **Backend**: Node.js (API routes inside Next.js)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **AI APIs**: OpenAI GPT-5 for text → SOP, Whisper for transcription
- **PDF**: PDFKit
- **Hosting**: Vercel (frontend) + Supabase (backend)

## Prerequisites

- Node.js 18+
- Supabase account
- OpenAI API key
- Notion Integration Token (optional)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sop-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   NOTION_API_KEY=your_notion_api_key (optional)
   ```

4. **Set up Supabase**
   - Create a new project in Supabase
   - Enable Auth (Email/Password)
   - Create the following tables in the database:
     ```sql
     -- Users table (automatically created by Supabase Auth)
     
     -- SOPs table
     CREATE TABLE sops (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       user_id UUID REFERENCES auth.users(id),
       title TEXT,
       content JSONB,
       checklist JSONB,
       created_at TIMESTAMP DEFAULT NOW()
     );
     
     -- Files table
     CREATE TABLE files (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       user_id UUID REFERENCES auth.users(id),
       file_url TEXT,
       file_type TEXT,
       transcript TEXT,
       created_at TIMESTAMP DEFAULT NOW()
     );
     ```
   - Set up storage bucket named `sop-files`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Folder Structure

```
/app
  /api
    upload/route.js
    transcribe/route.js
    generate/route.js
    process/route.js
  /dashboard/page.jsx
  /new/page.jsx
  /sop/[id]/page.jsx
  /login/page.jsx
  /signup/page.jsx
  layout.tsx
  page.tsx
/components
  FileUploader.jsx
  SOPViewer.jsx
  Navbar.jsx
  LoadingSpinner.jsx
/lib
  openai.js
  supabase.js
  pdf.js
/styles
  globals.css
```

## Process Flow

1. User logs in via Supabase
2. Uploads video or document → saved in Supabase Storage
3. Backend checks file type:
   - If video → send to Whisper API → return transcript
   - If doc → extract text → return
4. Send extracted text to OpenAI API (GPT-5)
5. Receive formatted SOP text
6. Display in frontend editor and save to Supabase database
7. User can download PDF or export to Notion

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details."# SOP-app" 
