// Temporary script to update user to admin
// Run with: npx tsx src/scripts/set-admin.ts

import { getPayload } from 'payload'
import config from '../payload.config'

async function main() {
  const payload = await getPayload({ config })

  const userId = '1' // Target user ID based on previous script output

  console.log(`\nAttempting to update user ID "${userId}" to admin...`)

  try {
    const updatedUser = await payload.update({
      collection: 'users',
      id: userId,
      data: {
        userType: 'admin',
        group: 'none',
      } as any,
    })

    console.log(
      `\n✅ User "${(updatedUser as any).nickname || updatedUser.email}" (ID: ${updatedUser.id}) has been updated to admin!`,
    )
  } catch (error) {
    console.error('\n❌ Failed to update user:', error)
  }

  process.exit(0)
}

main().catch(console.error)
