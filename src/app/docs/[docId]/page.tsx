import { NotionEditor } from "@/components/tiptap-templates/notion-like/notion-like-editor";
import { fetchQuery } from "convex/nextjs";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ docId: string }>;
}) {
  const docId = (await params).docId;
  const document = await fetchQuery(api.documents.getById, {
    id: docId as Id<"documents">,
  });
  if (!document) {
    return { title: "doc" };
  }
  return { title: `docs/${document?.title}.txt` };
}

export default async function Page({
  params,
}: {
  params: Promise<{ docId: string }>;
}) {
  const docId = (await params).docId;
  return <NotionEditor documentId={docId as Id<"documents">} />;
}
