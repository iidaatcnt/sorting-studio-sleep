'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Github,
  Info,
  Code2,
  Zap,
  Lightbulb,
  Moon,
  Sun,
  Clock,
  AlarmClock
} from 'lucide-react';

// --- Types ---
interface SleepElement {
  id: number;
  value: number;
  status: 'sleeping' | 'awake';
  progress: number; // 0 to 100
}

const ARRAY_SIZE = 8;
const SLEEP_SCALE = 50; // multiplier to make sleep visible (e.g., value 10 = 500ms)

const CODE_PYTHON = [
  "import threading",
  "import time",
  "",
  "def sleep_sort(arr):",
  "    result = []",
  "    def add_to_result(val):",
  "        time.sleep(val * 0.1)",
  "        result.append(val)",
  "",
  "    threads = []",
  "    for x in arr:",
  "        t = threading.Thread(target=add_to_result, args=(x,))",
  "        threads.append(t)",
  "        t.start()",
  "    return result"
];

export default function SleepSortStudio() {
  const [elements, setElements] = useState<SleepElement[]>([]);
  const [sortedList, setSortedList] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // Speed multiplier
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const frameRef = useRef<number>(0);

  const reset = useCallback(() => {
    const newElements: SleepElement[] = Array.from({ length: ARRAY_SIZE }, (_, i) => ({
      id: i,
      value: Math.floor(Math.random() * 40) + 10,
      status: 'sleeping',
      progress: 0
    }));
    setElements(newElements);
    setSortedList([]);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    reset();
  }, [reset]);

  useEffect(() => {
    if (isPlaying) {
      const startTime = Date.now();
      const initialProgress = elements.map(el => el.progress);

      const update = () => {
        const now = Date.now();
        const elapsed = (now - startTime) * speed;

        setElements((prev): SleepElement[] => {
          let allDone = true;
          const updated = prev.map((el): SleepElement => {
            const totalSleepTime = el.value * SLEEP_SCALE;
            const newProgress = Math.min(100, (elapsed / totalSleepTime) * 100);

            if (newProgress < 100) allDone = false;

            if (el.status === 'sleeping' && newProgress >= 100) {
              // Just woke up!
              setSortedList(s => [...s, el.value]);
              return { ...el, progress: 100, status: 'awake' };
            }

            return { ...el, progress: newProgress, status: el.status };
          });

          if (allDone) {
            setIsPlaying(false);
            return updated;
          }

          frameRef.current = requestAnimationFrame(update);
          return updated;
        });
      };

      frameRef.current = requestAnimationFrame(update);
    } else {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    }

    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [isPlaying, speed]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Background stars effect */}
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-slate-400 rounded-full opacity-10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
            }}
          />
        ))}
      </div>

      <header className="border-b border-slate-200 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Moon className="text-white w-5 h-5 fill-current" />
            </div>
            <h1 className="font-black italic tracking-tighter text-xl uppercase tracking-widest text-indigo-600">Sleep_Sort_Studio</h1>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://github.com/iidaatcnt/sorting-studio-sleep" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors">
              <Github size={20} />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        <div className="lg:col-span-8 flex flex-col gap-8">

          <div className="relative aspect-video lg:aspect-square max-h-[550px] bg-white rounded-[3rem] border border-slate-200 p-16 flex flex-col gap-8 overflow-hidden shadow-xl">
            <div className="absolute top-8 left-12 flex items-center gap-3 mono text-[9px] text-slate-400 uppercase font-black tracking-[0.2em] z-10">
              <Clock size={14} className="text-indigo-600" />
              Time-Based Physical Sorting // Sleep Logic
            </div>

            {/* Sleeping Zone */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="text-[10px] mono text-slate-400 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                <Moon size={12} /> Zzz... Sleeping Area
              </div>
              <div className="grid grid-cols-1 gap-3">
                {elements.map((el) => (
                  <div key={el.id} className="relative h-12 bg-slate-50 rounded-2xl border border-slate-100 flex items-center px-6 gap-6 overflow-hidden">
                    <div className="w-8 mono text-xs font-black text-slate-400">{el.value}</div>
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden relative">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.3)]"
                        style={{ width: `${el.progress}%` }}
                      />
                    </div>
                    <div className="w-20 text-right">
                      {el.status === 'sleeping' ? (
                        <span className="text-[10px] mono text-slate-400 animate-pulse">SLEEPING</span>
                      ) : (
                        <span className="text-[10px] mono text-amber-600 font-bold">WOKE UP!</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sorted Result Zone */}
            <div className="h-24 border-t border-slate-100 pt-8 flex items-center gap-3">
              <div className="text-[10px] mono text-slate-400 font-black uppercase tracking-widest mr-4">Sorted:</div>
              <div className="flex gap-2">
                <AnimatePresence>
                  {sortedList.map((val, idx) => (
                    <motion.div
                      key={`${val}-${idx}`}
                      initial={{ scale: 0, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center mono text-xs font-black text-indigo-600"
                    >
                      {val}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="px-10 py-8 bg-white rounded-[2.5rem] border border-slate-200 flex flex-col md:flex-row items-center gap-10 shadow-lg">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-20 h-20 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center hover:bg-indigo-500 transition-all active:scale-95 shadow-xl shadow-indigo-600/20"
              >
                {isPlaying ? <Pause fill="currentColor" size={24} /> : <Play fill="currentColor" size={24} className="ml-1" />}
              </button>
              <button onClick={reset} className="p-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors text-slate-500 ml-4"><RotateCcw size={20} /></button>
            </div>

            <div className="flex-1 w-full text-center md:text-left">
              <div className="flex items-center justify-between mono text-[10px] text-slate-400 uppercase font-black tracking-widest mb-3">
                <span>Time Dilation</span>
                <span className="text-indigo-600">x{speed.toFixed(1)}</span>
              </div>
              <div className="flex gap-4 items-center">
                <input type="range" min="0.5" max="5" step="0.1" value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} className="flex-1 appearance-none bg-slate-100 h-1.5 rounded-full accent-indigo-600 cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4 text-slate-500">
            <div className="mt-1 p-2 bg-white rounded-xl shrink-0 shadow-sm">
              <AlarmClock size={16} className="text-indigo-600" />
            </div>
            <p className="text-sm leading-relaxed font-medium">
              {isPlaying ? "要素たちが指定された時間だけ眠っています... 自然の摂理に従って整列されるのを待ちましょう。" : "スタートボタンを押して、スリープソートを開始してください。"}
            </p>
          </div>
        </div>

        {/* Right: Code & Theory */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="p-10 bg-white border border-slate-200 rounded-[3rem] shadow-lg">
            <div className="flex items-center gap-3 mb-8">
              <Lightbulb className="text-amber-500 w-5 h-5" />
              <h2 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">Concept_Data</h2>
            </div>
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 mb-8">
              <h3 className="text-indigo-600 font-black mb-3 text-sm">Sleep Sort</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                2ch（現5ch）のプログラミング掲示板で発明されたと言われるジョークアルゴリズム。
                各要素に対して「自分の値の秒数だけ寝てろ」とスレッドを立ち上げ、**「先に起きた順（小さい順）」**に拾い上げるという、天才的かつ物理的な手法です。
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 mono text-[9px] font-black uppercase tracking-tighter">
              <div className="p-4 bg-slate-50 rounded-2xl text-center border border-slate-100">
                <span className="text-slate-400 block mb-1">Complexity</span>
                <span className="text-indigo-600">O(max(N)) pt</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl text-center border border-slate-100">
                <span className="text-slate-400 block mb-1">Status</span>
                <span className="text-rose-500">Joke / Legend</span>
              </div>
            </div>
          </div>

          <div className="p-10 bg-[#0f172a] border border-slate-800 rounded-[3rem] flex-1 flex flex-col min-h-[450px] shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Code2 className="text-slate-500 w-5 h-5" />
                <h2 className="font-black text-[10px] uppercase tracking-widest text-slate-400">Source_Kernel</h2>
              </div>
              <div className="w-2 h-2 rounded-full bg-indigo-500/50" />
            </div>

            <div className="flex-1 bg-black/20 p-8 rounded-3xl mono text-[10px] leading-loose overflow-auto border border-slate-800 scrollbar-hide text-slate-300">
              {CODE_PYTHON.map((line, i) => (
                <div
                  key={i}
                  className="flex gap-6"
                >
                  <span className="text-slate-600 tabular-nums w-4 select-none opacity-50">{i + 1}</span>
                  <pre className="whitespace-pre">{line}</pre>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center opacity-20">
              <span className="text-[8px] mono text-slate-500 uppercase tracking-[0.5em]">multithreading_joke_v1</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t border-slate-200 py-16 text-center relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
          <Sun className="text-slate-200 w-8 h-8" />
          <p className="text-[8px] mono text-slate-400 uppercase tracking-[0.8em]">Interactive_Learning_Series // Informatics_I</p>
        </div>
      </footer>
    </div>
  );
}
