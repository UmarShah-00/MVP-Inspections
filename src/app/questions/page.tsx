"use client";

import { useState } from "react";
import QuestionForm from "@/components/questions/QuestionForm";
import QuestionList from "@/components/questions/QuestionList";

const categories = [
  { id: 1, name: "Site" },
  { id: 2, name: "Activity" },
  { id: 3, name: "Asset" },
];

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<
    { id: number; categoryName: string; text: string }[]
  >([]);

  const handleSave = (data: { categoryId: number; text: string }) => {
    const category = categories.find((c) => c.id === data.categoryId);
    setQuestions([
      ...questions,
      { id: questions.length + 1, categoryName: category?.name || "", text: data.text },
    ]);
  };

  const handleDelete = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  return (
    <div>
      <QuestionForm categories={categories} onSave={handleSave} />
      <QuestionList questions={questions} onDelete={handleDelete} />
    </div>
  );
}
