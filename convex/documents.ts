import { paginationOptsValidator } from "convex/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { prosemirrorSync } from "./prosemirror";

export const getByIds = query({
  args: { ids: v.array(v.id("documents")) },
  handler: async (ctx, { ids }) => {
    const documents = [];

    for (const id of ids) {
      const document = await ctx.db.get(id);

      if (document) {
        documents.push({ id: document._id, name: document.title });
      } else {
        documents.push({ id, name: "[Removed]" });
      }
    }

    return documents;
  },
});

export const create = mutation({
  args: {
    title: v.optional(v.string()),
    initialContent: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    // No authentication - create document for anonymous user
    const docId = await ctx.db.insert("documents", {
      title: args.title ?? "Untitled document",
      ownerId: "anonymous",
      organizationId: undefined,
    });

    await prosemirrorSync.create(ctx, docId, {
      type: "doc",
      content: args.initialContent,
    });

    return docId;
  },
});

export const get = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
  },
  handler: async (ctx, { search, paginationOpts }) => {
    // No authentication - return all documents
    if (search) {
      return (
        (await ctx.db
          .query("documents")
          .withSearchIndex("search_title", (q) => q.search("title", search))
          .paginate(paginationOpts)) ?? []
      );
    }

    return (
      (await ctx.db
        .query("documents")
        .order("desc")
        .paginate(paginationOpts)) ?? []
    );
  },
});

export const removeById = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    // No authentication - allow deletion of any document
    const document = await ctx.db.get(args.id);

    if (!document) {
      throw new Error("Document not found");
    }

    return await ctx.db.delete(args.id);
  },
});

export const updateById = mutation({
  args: { id: v.id("documents"), title: v.string() },
  handler: async (ctx, args) => {
    // No authentication - allow update of any document
    const document = await ctx.db.get(args.id);

    if (!document) {
      throw new Error("Document not found");
    }

    return await ctx.db.patch(args.id, { title: args.title });
  },
});

export const updateContent = mutation({
  args: {
    id: v.id("documents"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // No authentication - allow update of any document content
    const document = await ctx.db.get(args.id);

    if (!document) {
      throw new Error("Document not found");
    }

    return await ctx.db.patch(args.id, { initialContent: args.content });
  },
});

export const getById = query({
  args: { id: v.id("documents") },
  handler: async (ctx, { id }) => {
    const document = await ctx.db.get(id);

    if (!document) {
      throw new Error("Document not found");
    }

    return document;
  },
});
