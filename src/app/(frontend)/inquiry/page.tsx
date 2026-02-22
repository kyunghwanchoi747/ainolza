import React from 'react'
import { HelpCircle, Mail, Send, CheckCircle2 } from 'lucide-react'

export default function InquiryPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-black tracking-tight text-white mb-4">문의하기</h1>
            <p className="text-gray-400">
              궁금하신 점이나 제안하고 싶은 내용이 있다면 언제든 말씀해 주세요.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Contact Info */}
            <div className="space-y-8 lg:col-span-1">
              <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
                <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-tighter">
                  Quick Contact
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 rounded-xl bg-blue-600/20 p-2">
                      <Mail className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase">Email</p>
                      <p className="text-sm font-medium text-white">support@ainolja.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 rounded-xl bg-purple-600/20 p-2">
                      <HelpCircle className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase">kakao</p>
                      <p className="text-sm font-medium text-white">@AI놀자_공식</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[2.5rem] border border-blue-600/30 bg-blue-600/5 p-8">
                <div className="flex items-center gap-2 text-blue-400 mb-4">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-black uppercase tracking-widest italic">
                    Operating Hours
                  </span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  평일 10:00 - 18:00
                  <br />
                  점심시간 12:00 - 13:00
                  <br />
                  (주말 및 공휴일 제외)
                </p>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="lg:col-span-2">
              <form className="rounded-[3rem] border border-white/10 bg-white/5 p-10 shadow-2xl space-y-8">
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">
                    문의 유형
                  </label>
                  <select className="w-full rounded-2xl border border-white/10 bg-black/50 px-6 py-4 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors appearance-none">
                    <option>강의 관련 문의</option>
                    <option>결제/환불 문의</option>
                    <option>커뮤니티 이용 문의</option>
                    <option>기타 일반 문의</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">
                    문의 제목
                  </label>
                  <input
                    type="text"
                    placeholder="제목을 입력해 주세요"
                    className="w-full rounded-2xl border border-white/10 bg-black/50 px-6 py-4 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">
                    문의 내용
                  </label>
                  <textarea
                    rows={6}
                    placeholder="상세 내용을 입력해 주세요. (가급적 구체적으로 적어주시면 빠른 답변이 가능합니다.)"
                    className="w-full rounded-3xl border border-white/10 bg-black/50 px-6 py-4 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-5 text-sm font-black text-black transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Send className="h-4 w-4" />
                  문의 내용 전송하기
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
