import { serve } from '@upstash/workflow/nextjs'

interface InitialData {
  userId: string
  email: string
  name: string
}

export const { POST } = serve<InitialData>(async (context) => {
  const { userId, email, name } = context.requestPayload

  await context.run('new-signup', async () => {
    await sendEmail('Welcome to our service!', email)
  })

  await context.sleep('wait-for-3-days', 60 * 60 * 24 * 3)

  while (true) {
    const state = await context.run('check-user-state', async () => {
      return await getUserState()
    })

    if (state === 'non-active') {
      await context.run('send-email-non-active', async () => {
        await sendEmail('Email to non-active users', email)
      })
    } else if (state === 'active') {
      await context.run('send-email-active', async () => {
        await sendEmail('Send newsletter to active users', email)
      })
    }

    await context.sleep('wait-for-1-month', 60 * 60 * 24 * 30)
  }
})

async function sendEmail(message: string, email: string) {
  console.log(`Sending email to ${email} with message: ${message}`)
}

type UserState = 'non-active' | 'active'

async function getUserState(): Promise<UserState> {
  console.log('Checking user state...')
  return 'active'
}
