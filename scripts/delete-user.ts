import { getPayload } from 'payload'
import config from '../src/payload.config'

const email = process.argv[2]
if (!email) { console.error('Usage: tsx scripts/delete-user.ts <email>'); process.exit(1) }

const payload = await getPayload({ config })

const users = await payload.find({
  collection: 'users',
  where: { email: { equals: email } },
  overrideAccess: true,
})

if (users.docs.length === 0) {
  console.log('유저 없음:', email)
  process.exit(0)
}

const user = users.docs[0]
console.log('유저 발견:', user.id, user.email)

const orders = await payload.find({
  collection: 'orders',
  where: { user: { equals: user.id } },
  limit: 999,
  overrideAccess: true,
})
console.log('연결된 주문:', orders.docs.length)

for (const order of orders.docs) {
  await payload.update({ collection: 'orders', id: order.id, data: { user: null }, overrideAccess: true })
  console.log('주문 user NULL 처리:', order.id)
}

await payload.delete({ collection: 'users', id: user.id, overrideAccess: true })
console.log('삭제 완료:', email)
process.exit(0)
