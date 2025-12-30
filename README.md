# Sturdy Final - AI-Powered Parenting Script Generator

A React Native/Expo application that helps parents generate AI-powered parenting scripts for challenging situations with their children.

## Features

- 🤖 **AI-Generated Scripts**: Get personalized parenting advice using GPT-4
- 🔐 **User Authentication**: Secure sign-in with Supabase
- 📱 **Cross-Platform**: Works on iOS, Android, and Web
- 💾 **Script History**: Save and manage your generated scripts
- ⭐ **Favorites**: Mark important scripts for quick access
- 🎯 **Customizable**: Adjust tone and context for each situation

## Tech Stack

- **Frontend**: React Native with Expo
- **Routing**: Expo Router
- **Backend**: Supabase (Authentication, Database, Edge Functions)
- **AI**: OpenAI GPT-4 (via Supabase Edge Functions)
- **Styling**: React Native StyleSheet with custom components

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Expo CLI
- A Supabase account and project
- An OpenAI API key (for Edge Functions)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mrhtly83-cmd/sturdy-final-final.git
   cd sturdy-final-final
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**
   
   Follow the instructions in:
   - `SUPABASE_SETUP.md` - Database schema and setup
   - `SUPABASE_EDGE_FUNCTION_SETUP.md` - Edge Functions deployment

5. **Run the app**
   ```bash
   # For web
   npm run web

   # For iOS
   npm run ios

   # For Android
   npm run android
   ```

## Deployment

### Web Deployment to Vercel

See `VERCEL_DEPLOYMENT.md` for detailed instructions on deploying to Vercel.

Quick start:
```bash
# Build for web
npm run build

# Output will be in web-build/ directory
```

### Mobile Deployment

Follow [Expo's deployment guide](https://docs.expo.dev/distribution/introduction/) for iOS App Store and Google Play Store.

## Project Structure

```
sturdy-final-final/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Tab navigation screens
│   └── quiz/              # Quiz flow screens
├── src/
│   ├── components/        # Reusable components
│   ├── contexts/          # React contexts (Auth, FormData)
│   ├── lib/               # Utilities and configurations
│   └── services/          # API services (AI, Database)
├── supabase/
│   └── functions/         # Edge Functions
├── assets/                # Images and static files
├── .env.example           # Environment variables template
├── vercel.json            # Vercel deployment config
└── package.json           # Dependencies and scripts
```

## Key Files

- **`vercel.json`**: Vercel deployment configuration
- **`app.json`**: Expo app configuration
- **`src/lib/supabase.ts`**: Supabase client initialization
- **`src/services/aiService.ts`**: AI script generation service
- **`src/services/databaseService.ts`**: Database operations

## Available Scripts

- `npm start` - Start Expo development server
- `npm run dev` - Alias for start
- `npm run build` - Build for web (outputs to web-build/)
- `npm run web` - Start web development server
- `npm run ios` - Start iOS development
- `npm run android` - Start Android development
- `npm run lint` - Run ESLint

## Environment Variables

Required environment variables:

```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL=       # Your Supabase project URL
EXPO_PUBLIC_SUPABASE_ANON_KEY=  # Your Supabase anonymous key

# OpenAI (set in Supabase Edge Function secrets)
OPENAI_API_KEY=                 # Your OpenAI API key
```

**⚠️ Security Note**: Never commit `.env` files with real credentials. The `.env.example` file contains placeholders only.

## Documentation

- **[Vercel Deployment](VERCEL_DEPLOYMENT.md)** - Deploy to Vercel
- **[Supabase Setup](SUPABASE_SETUP.md)** - Database and authentication setup
- **[Edge Functions](SUPABASE_EDGE_FUNCTION_SETUP.md)** - Server-side AI integration
- **[OpenAI Setup](OPENAI_KEY_SETUP.md)** - API key configuration

## Troubleshooting

### Build fails with "supabaseUrl is required"

**Solution**: Ensure your `.env` file exists and contains valid Supabase credentials.

### "expo module not found" during build

**Solution**: Run `npm install` to install all dependencies.

### Edge Functions not working

**Solution**: Make sure you've deployed your Edge Functions to Supabase and set the `OPENAI_API_KEY` secret.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation in the `/docs` folder
- Review Expo and Supabase documentation

## Acknowledgments

- Built with [Expo](https://expo.dev/)
- Backend powered by [Supabase](https://supabase.com/)
- AI by [OpenAI](https://openai.com/)
