import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@styles/globals.css'

import Nav from '@components/Nav'
import Provider from '@components/Provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QuizBot',
  description: 'Test you knowledge using ChatGPT as your quizmaster.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body>
        <Provider session={undefined as any}>
          <div className='main'>
            <div />
          </div>

          <main className='app'>
            <Nav />
            {children}
          </main>
        </Provider>
      </body>
    </html>

  )
}
