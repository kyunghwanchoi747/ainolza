import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import { PlayCircle, Clock, Search, BookOpen, User } from 'lucide-react'
import type { Course } from '@/payload-types'

export default async function CoursesPage() {
  try {
    const payload = await getPayload({ config })

    const { docs: courses } = await payload.find({ collection: 'courses' })

    return (
      <div className="min-h-screen bg-black pt-20">
        {/* Search & Intro */}
        <section className="border-b border-white/10 bg-white/5 py-12">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div>
                <h1 className="text-4xl font-black tracking-tight text-white">AI 놀자 강의실</h1>
                <p className="mt-2 text-gray-400">나의 속도에 맞춰 성장하는 AI 실무 러닝 플랫폼</p>
              </div>
              <div className="flex w-full max-w-md items-center gap-2 rounded-2xl border border-white/10 bg-black/50 px-4 py-2">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="어떤 기술을 배우고 싶으신가요?"
                  className="w-full bg-transparent py-2 text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar / Categories */}
            <aside className="w-full lg:w-64 space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h3 className="flex items-center gap-2 font-bold text-white mb-4">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  강의 카테고리
                </h3>
                <ul className="space-y-2">
                  {['전체강의', '기초입문', '실무활용', '생성형AI', '자동화/코딩'].map((cat) => (
                    <li key={cat}>
                      <button className="w-full text-left px-4 py-2 text-sm rounded-xl transition-colors text-gray-400 hover:bg-white/5 hover:text-white">
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Course Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {courses.length > 0 ? (
                  courses.map((course: Course) => (
                    <div
                      key={course.id}
                      className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 transition-all hover:bg-white/10"
                    >
                      <div className="relative aspect-video w-full overflow-hidden bg-gray-800">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100">
                          <PlayCircle className="h-16 w-16 text-white" />
                        </div>
                      </div>

                      <div className="flex flex-col p-6 text-white">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="rounded-lg bg-blue-600/20 px-2 py-1 text-[10px] font-bold text-blue-400 uppercase">
                            COURSE
                          </span>
                          <div className="flex items-center gap-1 text-[10px] text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{course.duration || '2시간 30분'}</span>
                          </div>
                        </div>

                        <h2 className="text-xl font-bold leading-tight group-hover:text-blue-400 transition-colors">
                          {course.title}
                        </h2>
                        <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                          {course.description}
                        </p>

                        <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-6">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                              <User className="h-4 w-4 text-blue-400" />
                            </div>
                            <span className="text-xs font-medium text-gray-300">
                              AI Nolja Instructor
                            </span>
                          </div>
                          <Link
                            href={`/courses/${course.id}`}
                            className="rounded-xl bg-white px-4 py-2 text-xs font-black text-black transition-all hover:scale-105 active:scale-95"
                          >
                            수강 시작
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-24 text-center">
                    <p className="text-gray-500 font-bold uppercase tracking-widest">
                      준비된 강의가 없습니다.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading courses:', error)
    return (
      <div className="min-h-screen bg-black pt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-2">강의 로드 실패</h1>
            <p className="text-gray-400">강의를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.</p>
          </div>
        </div>
      </div>
    )
  }
}
