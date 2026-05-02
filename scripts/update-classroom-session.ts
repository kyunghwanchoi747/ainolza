import { getPayload } from 'payload'
import config from '../src/payload.config'

const classroomSlug = process.argv[2]
const week = Number(process.argv[3])
const field = process.argv[4]
const value = process.argv[5]

if (!classroomSlug || !week || !field) {
  console.error('Usage: tsx scripts/update-classroom-session.ts <slug> <week> <field> <value>')
  console.error('Example: tsx scripts/update-classroom-session.ts vibe-coding-advanced 4 guidebookUrl https://...')
  process.exit(1)
}

const payload = await getPayload({ config })

const result = await payload.find({
  collection: 'classrooms' as any,
  where: { slug: { equals: classroomSlug } },
  limit: 1,
  overrideAccess: true,
})

const classroom = result.docs[0] as any
if (!classroom) {
  console.error('강의실 없음:', classroomSlug)
  process.exit(1)
}

const sessions = Array.isArray(classroom.sessions) ? [...classroom.sessions] : []
const idx = sessions.findIndex((s: any) => Number(s.week) === week)
if (idx < 0) {
  console.error(`${week}회차 없음`)
  process.exit(1)
}

console.log('이전:', sessions[idx])
sessions[idx] = { ...sessions[idx], [field]: value || null }
console.log('이후:', sessions[idx])

await payload.update({
  collection: 'classrooms' as any,
  id: classroom.id,
  data: { sessions } as any,
  overrideAccess: true,
})

console.log('업데이트 완료')
process.exit(0)
