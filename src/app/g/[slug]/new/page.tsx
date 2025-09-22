"use client";

import { use } from "react";
import { LuxuryCreateIdeaForm } from "@/components/LuxuryCreateIdeaForm";

export default function CreateIdeaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  return <LuxuryCreateIdeaForm slug={slug} />;
}