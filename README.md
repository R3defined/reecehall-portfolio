# macOS User-friendly Portfolio

A modern, interactive portfolio website built with Astro, React, and Tailwind CSS, featuring a macOS-inspired interface.

## 🚀 Features

- **Modern Tech Stack**: Built with Astro, React, and Tailwind CSS
- **Terminal Interface**: macOS terminal-inspired UI integrating a chatbot for a unique user experience
- **Easily customizable user data**: The user can easily create their own version by editing the data in the `userconfig.ts` file.
- **Projects' Summary**: The user can add all their project for a project structure preview, in addition to the screenshots and github links.
- **Notes App**: The user can add all their related data in user-friendly story-telling way.
- **Responsive Design**: Fully responsive layout that works on all devices
- **SEO Optimized**: Built-in sitemap generation and SEO tools
- **TypeScript Support**: Full TypeScript integration for better development experience
- **Vercel Deployment**: Optimized for deployment on Vercel

## 🛠️ Tech Stack

- [Astro](https://astro.build/) - Modern static site builder
- [React](https://reactjs.org/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Vercel](https://vercel.com/) - Deployment platform

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/aabdoo23/portfolio
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
GROQ_API_KEY = YOUR_GROQ_API_KEY
```
4. Access the `userconfig.ts` file and start putting in your data.

5. To generate json files for your projects, I have provided a `github_repo_parser.py` file in the `util` folder, you can provide a github token to avoid rate limiting to the call of the parser in the main
```python
def main():
    parser = GitHubRepoParser('ghp_YOUR_TOKEN_HERE')
    
```

## 🚀 Development

To start the development server:

```bash
npm run dev
```

This will start the development server at `http://localhost:4321`.

## 🏗️ Building for Production

To build the project for production:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Deploy to vercel:
```bash
npx vercel deploy --prod
```
or 
```bash
npx vercel deploy
```
and select the image from the vercel dashboard.

There is a bug with direct deployment from github, i can't seem to figure it out tbf, so for the time being use the above commands after running ```npm run build```.

## 📁 Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── layouts/        # Layout components
│   ├── pages/          # Astro pages
│   ├── styles/         # Global styles
│   ├── config/         # Configuration files
│   └── assets/         # Static assets
├── public/             # Public assets
├── .astro/             # Astro build files
├── util/               # Utility functions
└── astro.config.mjs    # Astro configuration
```

## 🔧 Configuration

The project is configured through several key files:

- `astro.config.mjs`: Main Astro configuration
- `tsconfig.json`: TypeScript configuration
- `tailwind.config.js`: Tailwind CSS configuration

## 🚀 Deployment

The project is configured for deployment on Vercel. To deploy:

1. Push your changes to your GitHub repository
2. Connect your repository to Vercel
3. Vercel will automatically deploy your site

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by macOS terminal interface
- Built with modern web technologies
- Thanks to all contributors and maintainers of the open-source tools used in this project

## 📞 Contact

For questions or support, please open an issue on GitHub.

Original version made with ❤️ in Austin, TX by Johnny Culbreth
Modified with ❤️ in Detroit, Mi By R3defined
