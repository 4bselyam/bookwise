'use client'

import React, { useState } from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { borrowBook } from '@/lib/actions/book'

interface Props {
	bookId: string
	userId: string
	borrowingEligibility: {
		isEligible: boolean
		message: string
	}
}

const BorrowBook = ({ bookId, userId, borrowingEligibility: { isEligible, message } }: Props) => {
	const router = useRouter()
	const [borrowing, setBorrowing] = useState(false)

	const handleBorrow = async () => {
		if (!isEligible) {
			toast.error('Error', { description: message })
			return
		}

		setBorrowing(true)

		try {
			const result = await borrowBook({ bookId, userId })

			if (result.success) {
				toast.success('Success', { description: 'Book borrowed successfully' })
				router.push('/my-profile')
			} else {
				toast.error('Error', { description: result.error })
			}
		} catch (error) {
			toast.error('Error', { description: 'Failed to borrow book' })
		} finally {
			setBorrowing(false)
		}
	}

	return (
		<Button className='book-overview_btn' onClick={handleBorrow} disabled={borrowing}>
			<Image src='/icons/book.svg' alt='book' width={22} height={22} />
			<p className='font-bebas-neue text-xl text-dark-100'>{borrowing ? 'Borrowing...' : 'Borrow Book'}</p>
		</Button>
	)
}

export default BorrowBook
