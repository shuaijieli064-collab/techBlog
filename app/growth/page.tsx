import Link from "next/link";
import { TrendingUp, Calendar, Award, ArrowRight } from "lucide-react";
import { skills, growthEvents, typeLabels, typeColors } from "@/lib/growth";

export default function GrowthPage() {
  const totalEvents = growthEvents.length;
  const milestones = growthEvents.filter((e) => e.type === "milestone").length;
  const avgSkill = Math.round(skills.reduce((s, k) => s + k.level, 0) / skills.length);

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Growth</p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">成长中心</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          技能画像与成长时间线，记录每一步里程碑。
        </p>
      </div>

      <div className="mb-12 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-900/30">
              <TrendingUp size={20} className="text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{avgSkill}%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">平均技能水平</div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-900/30">
              <Calendar size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{totalEvents}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">成长事件</div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-900/30">
              <Award size={20} className="text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{milestones}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">关键里程碑</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">技能画像</h2>
          <Link href="/learning" className="flex items-center gap-1 text-sm text-sky-600 hover:text-sky-500">
            学习路线 <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900 dark:text-slate-50">{skill.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{skill.category}</div>
                </div>
                <span className="text-lg font-bold text-sky-600">{skill.level}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full ${skill.color} transition-all duration-500`}
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-6">成长时间线</h2>
        <div className="relative ml-3 border-l-2 border-slate-200 pl-8 dark:border-slate-800">
          {growthEvents.map((event) => {
            const colors = typeColors[event.type];
            return (
              <div key={event.id} className="relative mb-8 last:mb-0">
                <span
                  className={`absolute -left-[41px] top-1.5 h-4 w-4 rounded-full border-2 border-white ${colors.dot} dark:border-slate-950`}
                />
                <article className="rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
                      {typeLabels[event.type]}
                    </span>
                    <time className="text-xs text-slate-500 dark:text-slate-400" dateTime={event.date}>
                      {event.date}
                    </time>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{event.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{event.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
