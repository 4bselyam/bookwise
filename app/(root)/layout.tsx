import { PropsWithChildren } from 'react'
import Header from '@/components/Header'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { after } from 'next/server'
import { db } from '@/database/drizzle'
import { users } from '@/database/schema'
import { eq } from 'drizzle-orm'

const Layout = async ({ children }: PropsWithChildren) => {
  const session = await auth()

  if (!session) {
    redirect('/sign-in')
  }

  after(async () => {
    if (!session?.user?.id) {
      return
    }

    // Get the user and see if the last activity date is today
    const user = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1)

    if (user[0].lastActivityDate === new Date().toISOString().slice(0, 10)) {
      return
    }

    await db
      .update(users)
      .set({ lastActivityDate: new Date().toISOString().slice(0, 10) })
      .where(eq(users.id, session.user.id))
  })

  return (
    <main className="root-container">
      <div className="mx-auto max-w-7xl">
        <Header session={session} />
        <div className="mt-20 pb-20">{children}</div>
      </div>
    </main>
  )
}

export default Layout
