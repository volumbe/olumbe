import { NotionEditor } from "@/components/tiptap-templates/notion-like/notion-like-editor";
import { Id } from "@/convex/_generated/dataModel";

export default async function Page({
  params,
}: {
  params: Promise<{ docId: string }>;
}) {
  const docId = (await params).docId;
  return <NotionEditor documentId={docId as Id<"documents">} />;
}
