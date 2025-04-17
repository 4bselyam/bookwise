import { books } from './schema'
import dummyBooks from '../dummybooks.json'
import ImageKit from 'imagekit'
import { config } from 'dotenv'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

config({ path: '.env.local' })
const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql)

const imagekit = new ImageKit({
	publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
	urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
	privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
})

const seed = async () => {
	console.log('Seeding database...')

	try {
		for (const book of dummyBooks) {
			const coverUrl = (await uploadToImageKit(book.coverUrl, `${book.title}.jpg`, '/books/covers')) as string
			const videoUrl = (await uploadToImageKit(book.videoUrl, `${book.title}.mp4`, '/books/videos')) as string

			await db.insert(books).values({
				...book,
				coverUrl,
				videoUrl,
			})
		}

		console.log('Database seeded successfully')
	} catch (error) {
		console.error('Error seeding database:', error)
	}
}

const uploadToImageKit = async (coverUrl: string, fileName: string, folder: string) => {
	try {
		const response = await imagekit.upload({
			file: coverUrl,
			fileName,
			folder,
		})

		return response.filePath
	} catch (error) {
		console.log('Error uploading to ImageKit:', error)
	}
}

seed()
