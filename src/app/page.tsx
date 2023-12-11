import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <button className="primary-button">
        <Link href="/chat">Go to chat</Link>
      </button>
    </main>
  )
}
