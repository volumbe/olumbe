"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2, Plus, Search, FileText, Loader2 } from "lucide-react";

export function DocsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const documents = useQuery(api.documents.get, {
    paginationOpts: { numItems: 50, cursor: null },
    search: search || undefined,
  });

  const createDocument = useMutation(api.documents.create);
  const deleteDocument = useMutation(api.documents.removeById);

  const handleCreateDocument = async () => {
    setIsCreating(true);
    const date = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZoneName: "short",
    });
    const formattedDateTime = formatter.format(date);
    try {
      const docId = await createDocument({
        title: formattedDateTime,
        initialContent: [{ type: "paragraph", content: [] }],
      });
      router.push(`/docs/${docId}`);
    } catch (error) {
      console.error("Failed to create document:", error);
      setIsCreating(false);
    }
  };

  const handleDocumentClick = (docId: Id<"documents">) => {
    router.push(`/docs/${docId}`);
  };

  const handleDeleteDocument = async (
    e: React.MouseEvent,
    docId: Id<"documents">
  ) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this document?")) {
      try {
        await deleteDocument({ id: docId });
      } catch (error) {
        console.error("Failed to delete document:", error);
      }
    }
  };

  return (
    <div className="w-full h-full max-w-7xl mx-auto p-6 space-y-6 flex-1">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white">Documents</h1>
          <p className="text-gray-400 mt-1">Create and manage your documents</p>
        </div>
        <Button
          onClick={handleCreateDocument}
          disabled={isCreating}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              New Document
            </>
          )}
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
        />
      </div>

      {documents === undefined ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : documents.page.length === 0 ? (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <FileText className="h-16 w-16 text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No documents yet
            </h3>
            <p className="text-gray-400 mb-6">
              Create your first document to get started
            </p>
            <Button
              onClick={handleCreateDocument}
              disabled={isCreating}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Document
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.page.map((doc) => (
            <Card
              key={doc._id}
              className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all cursor-pointer group"
              onClick={() => handleDocumentClick(doc._id)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-white text-lg truncate pr-2">
                    {doc.title}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 h-8 w-8"
                    onClick={(e) => handleDeleteDocument(e, doc._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription className="text-gray-400">
                  {new Date(doc._creationTime).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Owner: {doc.ownerId || "Anonymous"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {documents?.continueCursor && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => {
              console.log("Load more documents");
            }}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
