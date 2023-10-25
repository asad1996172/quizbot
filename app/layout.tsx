import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@styles/globals.css'

import Nav from '@components/Nav'
import Provider from '@components/Provider'
import { ChatGPTAPIProvider } from '@context/ChatGPTAPIContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QuizBot',
  description: 'Test you knowledge using ChatGPT as your quizmaster.',
  icons: {
    icon: '/assets/images/logo.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body>
        <ChatGPTAPIProvider>
          <Provider session={undefined as any}>
            <div className='main'>
              <div />
            </div>

            <main className='app'>
              <Nav />
              {children}
            </main>
          </Provider>
        </ChatGPTAPIProvider>
      </body>
    </html>

  )
}
