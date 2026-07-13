import https from 'https'

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID
const DRY_RUN = process.argv.includes('--dry-run')
const SERVICE_DAYS = 100

interface Order {
  id: string
  orderNumber: string
  buyerName: string
  buyerEmail: string
  status: string
  productType: string
  paidAt?: string
  createdAt?: string
}

async function fetchFromD1(query: string, retries = 3): Promise<any[]> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await new Promise((resolve, reject) => {
        const data = JSON.stringify({ sql: query })
        const options = {
          hostname: 'api.cloudflare.com',
          path: `/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/d1-db/query`,
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
            'Content-Length': data.length,
          },
        }

        const req = https.request(options, (res) => {
          let body = ''
          res.on('data', chunk => body += chunk)
          res.on('end', () => {
            try {
              const result = JSON.parse(body)
              if (!result.success) {
                console.error(`D1 Query Error (attempt ${attempt}/${retries}):`, result.errors)
                reject(new Error(result.errors?.[0]?.message || 'D1 Query failed'))
              }
              const results = result.result?.[0]?.results || []
              resolve(results)
            } catch (e) {
              reject(e)
            }
          })
        })

        req.on('error', reject)
        req.write(data)
        req.end()
      })
    } catch (error) {
      console.warn(`⚠️  D1 쿼리 실패 (시도 ${attempt}/${retries}): ${(error as Error).message}`)
      if (attempt === retries) {
        throw error
      }
      // 지수 백오프: 1초, 2초, 4초
      const delay = Math.pow(2, attempt - 1) * 1000
      console.log(`   ${delay / 1000}초 후 재시도...`)
      await new Promise(r => setTimeout(r, delay))
    }
  }
  throw new Error('Should not reach here')
}

async function updateOrderStatus(orderId: string, newStatus: string, retries = 3): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await new Promise((resolve, reject) => {
        const query = `
          UPDATE orders
          SET status = '${newStatus}', updated_at = datetime('now')
          WHERE id = '${orderId}'
        `
        const data = JSON.stringify({ sql: query })
        const options = {
          hostname: 'api.cloudflare.com',
          path: `/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/d1-db/query`,
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
            'Content-Length': data.length,
          },
        }

        const req = https.request(options, (res) => {
          let body = ''
          res.on('data', chunk => body += chunk)
          res.on('end', () => {
            try {
              const result = JSON.parse(body)
              if (!result.success) {
                console.error(`Update failed for ${orderId} (attempt ${attempt}/${retries}):`, result.errors)
                reject(new Error(result.errors?.[0]?.message || 'Update failed'))
              }
              resolve()
            } catch (e) {
              reject(e)
            }
          })
        })

        req.on('error', reject)
        req.write(data)
        req.end()
      })
    } catch (error) {
      console.warn(`⚠️  UPDATE 실패 (주문 ${orderId}, 시도 ${attempt}/${retries}): ${(error as Error).message}`)
      if (attempt === retries) {
        throw error
      }
      const delay = Math.pow(2, attempt - 1) * 1000
      console.log(`   ${delay / 1000}초 후 재시도...`)
      await new Promise(r => setTimeout(r, delay))
    }
  }
  throw new Error('Should not reach here')
}

async function main() {
  console.log(`🔍 수강 기간 만료 주문 확인 시작 (${DRY_RUN ? 'DRY RUN' : 'LIVE'})`)
  const koreanNow = new Date(new Date().getTime() + 9 * 60 * 60 * 1000) // UTC → 한국시간
  console.log(`📅 기준 날짜: ${koreanNow.toISOString().split('T')[0]} (한국시간)`)
  console.log(`⏱️  수강 기간: ${SERVICE_DAYS}일\n`)

  try {
    // 강의(class) 주문 중 결제 완료(paid) 또는 이용중(active) 상태인 것만 조회
    const orders = await fetchFromD1(`
      SELECT id, orderNumber, buyerName, buyerEmail, status, productType, paidAt, createdAt
      FROM orders
      WHERE status IN ('paid', 'active') AND productType = 'class'
      ORDER BY paidAt ASC
    `) as Order[]

    console.log(`✅ 조회된 강의 주문: ${orders.length}건 (전자책/종이책 제외)\n`)

    let completedCount = 0
    const now = new Date()

    for (const order of orders) {
      // paidAt은 필수 (결제 확정 날짜 기준) — createdAt 폴백 위험 (무통장 pending 주문 오류 방지)
      if (!order.paidAt) {
        console.log(`⚠️  [${order.orderNumber}] ${order.buyerName} - paidAt 미설정 (스킵) / 관리자: 주문 상세에서 paidAt 설정 필요`)
        continue
      }

      const paidDate = order.paidAt

      const paid = new Date(paidDate)
      const expiry = new Date(paid)
      expiry.setDate(expiry.getDate() + SERVICE_DAYS)

      // 한국시간 기준으로 만료일 판단
      const koreanNowTime = new Date().getTime() + 9 * 60 * 60 * 1000
      const daysLeft = Math.ceil((expiry.getTime() - koreanNowTime) / (1000 * 60 * 60 * 24))

      if (daysLeft <= 0) {
        console.log(`📋 [${order.orderNumber}] ${order.buyerName} (${order.buyerEmail})`)
        console.log(`   결제일: ${paid.toISOString().split('T')[0]}`)
        console.log(`   만료일: ${expiry.toISOString().split('T')[0]}`)
        console.log(`   상태: ${daysLeft === 0 ? '오늘 만료' : `${Math.abs(daysLeft)}일 전 만료`}`)

        if (!DRY_RUN) {
          await updateOrderStatus(order.id, 'completed')
          console.log(`   ✨ 상태 변경: ${order.status} → completed`)
        } else {
          console.log(`   [DRY RUN] 상태 변경 예정: ${order.status} → completed`)
        }
        completedCount++
        console.log()
      }
    }

    console.log(`\n✅ 작업 완료`)
    console.log(`${DRY_RUN ? '예상 변경 건수' : '변경된 주문'}: ${completedCount}건`)

    if (DRY_RUN && completedCount > 0) {
      console.log(`💡 다시 실행할 때 --dry-run 플래그를 빼면 실제 변경됩니다.`)
    }
  } catch (error) {
    console.error('❌ 오류:', error)
    process.exit(1)
  }
}

main()
