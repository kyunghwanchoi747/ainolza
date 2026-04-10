import Link from 'next/link'

export default function PaymentFailPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
      <div className="max-w-[500px] text-center">
        <div className="text-6xl mb-6">&#9888;</div>
        <h1 className="text-3xl font-bold text-ink mb-4">결제에 실패했습니다</h1>
        <p className="text-body text-sm mb-8">
          결제 처리 중 문제가 발생했습니다.<br/>
          다른 결제수단으로 다시 시도하거나 문의해주세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/store" className="px-6 py-3 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-all text-sm">
            다시 시도하기
          </Link>
          <Link href="/contact" className="px-6 py-3 border border-line text-ink font-bold rounded-xl hover:bg-surface transition-all text-sm">
            문의하기
          </Link>
        </div>
      </div>
    </div>
  )
}
