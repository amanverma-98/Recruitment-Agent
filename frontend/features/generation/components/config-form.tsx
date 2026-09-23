"use client";

import React from "react";
import { useGenerationStore } from "@/store/use-generation-store";
import { useBulkGenerate } from "../hooks/use-generate";
import { useToast } from "@/lib/hooks/use-toast";
import { Sparkles, Loader2, Check } from "lucide-react";

const TOPICS = [
  "SQL",
  "HTML",
  "CSS",
  "JavaScript",
  "Python",
  "C",
  "Statistics",
  "Probability",
  "Aptitude",
];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export default function ConfigForm() {
  const store = useGenerationStore();
  const { mutate, isPending, progress } = useBulkGenerate();
  const { showToast } = useToast();

  const handleGenerate = () => {
    if (store.topics.length === 0 || store.difficulties.length === 0) return;

    // Fixed payload properties to match the new bulkGenerateQuestions implementation
    mutate({
      topics: store.topics,
      difficulties: store.difficulties,
      count: store.questionsPerTopic, // Updated parameter name from countPerCombo to count
    });
  };

  const handleTopicToggle = (topic: string) => {
    const newTopics = store.topics.includes(topic)
      ? store.topics.filter((t) => t !== topic)
      : [...store.topics, topic];
    store.setTopics(newTopics);
  };

  const handleDifficultyToggle = (d: string) => {
    const newDifficulties = store.difficulties.includes(d)
      ? store.difficulties.filter((x) => x !== d)
      : [...store.difficulties, d];
    store.setDifficulties(newDifficulties);
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Select Topics (Spans 7 cols on large screens) */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-900 block mb-1">
              Select Topics
            </label>
            <p className="text-xs text-gray-400">
              Choose one or more topics for generation
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {TOPICS.map((topic) => {
              const isSelected = store.topics.includes(topic);
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => handleTopicToggle(topic)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border text-left
                    ${
                      isSelected
                        ? "bg-purple-100 border-purple-200 text-purple-700 shadow-sm shadow-purple-100"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                >
                  <span>{topic}</span>
                  {isSelected && (
                    <Check className="w-4 h-4 text-purple-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Difficulties & Count (Spans 5 cols on large screens) */}
        <div className="lg:col-span-5 space-y-6 border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-8">
          {/* Select Difficulties */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-semibold text-gray-900 block mb-1">
                Select Difficulties
              </label>
              <p className="text-xs text-gray-400">
                Target multiple expertise tiers
              </p>
            </div>

            <div className="flex gap-2.5">
              {DIFFICULTIES.map((d) => {
                const isSelected = store.difficulties.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleDifficultyToggle(d)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border
                      ${
                        isSelected
                          ? "bg-purple-100 border-purple-200 text-purple-800 shadow-sm shadow-purple-100"
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Questions per count */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900 block">
              Total Target Questions
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                max={15}
                value={store.questionsPerTopic}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value > 15) {
                    showToast("Not more than 15 questions can be generated at a time", "error");
                    store.setQuestionsPerTopic(15);
                    return;
                  }
                  store.setQuestionsPerTopic(value);
                }}
                className="w-full text-black px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all pr-12 font-medium"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 uppercase">
                Qty
              </span>
            </div>

            {store.topics.length > 0 && store.difficulties.length > 0 && (
              <div className="bg-purple-50/50 rounded-xl p-3 border border-purple-100/60">
                <p className="text-xs text-purple-900/80 leading-relaxed font-medium">
                  {store.topics.length} topic
                  {store.topics.length > 1 ? "s" : ""} ×{" "}
                  {store.difficulties.length} level
                  {store.difficulties.length > 1 ? "s" : ""} format passed as
                  bulk to generate{" "}
                  <span className="text-purple-700 font-bold underline decoration-wavy decoration-purple-300 underline-offset-2">
                    {store.questionsPerTopic} Questions
                  </span>
                  .
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

     
      {/* Actions */}
      <div className="pt-2 space-y-4">
        {/* Progress Bar */}
        {isPending && progress && (
          <div className="space-y-3 bg-gradient-to-r from-purple-50 via-white to-purple-50 p-5 rounded-xl border border-purple-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Header with percentage */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-5 h-5">
                  <div className="absolute inset-0 rounded-full border-2 border-purple-200" />
                  <div className="absolute inset-0 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  Generating Questions...
                </span>
              </div>
              <span className="text-sm font-bold text-purple-700">
                {progress.percent}%
              </span>
            </div>

            {/* Progress track */}
            <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress.percent}%` }}
              />
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-400/30 to-purple-500/30 rounded-full animate-pulse"
                style={{ width: `${progress.percent}%` }}
              />
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">
                {progress.current} of {progress.total} completed
              </span>
              <div className="flex items-center gap-3">
                <span className="text-emerald-600 font-semibold">
                  ✓ {progress.generated} success
                </span>
                {progress.failed > 0 && (
                  <span className="text-rose-500 font-semibold">
                    ✗ {progress.failed} failed
                  </span>
                )}
              </div>
            </div>

            {/* Current processing info */}
            {progress.last_topic && (
              <div className="flex items-center gap-2 text-xs text-gray-400 pt-1 border-t border-purple-100/60">
                <Loader2 className="w-3 h-3 animate-spin text-purple-400" />
                <span>
                  Processing <span className="font-semibold text-gray-600">{progress.last_topic}</span>
                  {' '}· <span className="font-semibold text-gray-600">{progress.last_difficulty}</span>
                </span>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={
            isPending ||
            store.topics.length === 0 ||
            store.difficulties.length === 0
          }
          className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-200 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed hover:translate-y-[-1px] active:translate-y-[0px]"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating{progress ? ` (${progress.percent}%)` : ''}...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate Questions</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
