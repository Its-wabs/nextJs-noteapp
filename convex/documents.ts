import {v } from "convex/values";

import {mutation, query} from "./_generated/server";
import {  Id } from "./_generated/dataModel";


export const get = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    
    // Only get non-archived documents
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();

    return documents;
  }
});


export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")), // pass this if you want it inside a folder
    type: v.union(v.literal("note"), v.literal("folder")),
    lastEdited: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;

    const parentDoc = args.parentDocument
  ? await ctx.db.get(args.parentDocument)
  : null;

if (parentDoc && parentDoc.type !== "folder") {
  throw new Error("You can only create inside a folder.");

}

 // count siblings to assign new position
    const siblings = await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) =>
        q.eq("userId", userId).eq("parentDocument", args.parentDocument)
      )
      .collect();

        // Calculate next position
    const nextPosition = siblings.length === 0 
      ? 0 
      : Math.max(...siblings.map(s => s.position || 0)) + 1;

    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument, // link to folder if provided
      userId,
      type: args.type,
      isArchived: false,
      isPublished: false,
      lastEdited: args.lastEdited || Date.now(),
      position: nextPosition,
    });

    return document;
  },
});

export const getChildren = query({
  args: { parentDocument: v.optional(v.id("documents")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;

    return await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) =>
        q.eq("userId", userId).eq("parentDocument", args.parentDocument)
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();
  },
});

export const archive = mutation({
  args: {id:v.id("documents")},
  handler: async (ctx,args) => {
    const identity = await ctx.auth.getUserIdentity();


    if (!identity) {
      throw new Error("Not authenticated");
    }

const userId = identity.subject;
const existingDocument = await ctx.db.get(args.id);
if(!existingDocument) {
  throw new Error("Not found");
}

if(existingDocument.userId !== userId) {
  throw new Error("Unauthorized");
}

const recursiveArchive = async (documentId: Id<"documents">) => {
  const children = await ctx.db
  .query("documents")
  .withIndex("by_user_parent", (q) => (
    q
    .eq("userId",userId)
    .eq("parentDocument",documentId)
  )
)
.filter((q) => q.eq(q.field("isArchived"), false))
  .collect();

  for(const child of children) {
    await ctx.db.patch(child._id,{
      isArchived:true,
    });

    await recursiveArchive(child._id);
  }

}

const document = await ctx.db.patch(args.id, {
  isArchived: true,
});

recursiveArchive(args.id);

return document;
  }
});


export const getArchived = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect();

      return documents;
  },
});


export const restore = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    const existingDocument = await ctx.db.get(args.id);
    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

     // --- helper: get next available position
const getNextPosition = async (parent: Id<"documents"> | undefined) => {
  const siblings = await ctx.db
    .query("documents")
    .withIndex("by_user_parent", (q) =>
      q.eq("userId", userId).eq("parentDocument", parent)
    )
    .filter((q) => q.eq(q.field("isArchived"), false))
    .collect();
  
  // If no siblings, start at position 0
  if (siblings.length === 0) return 0;
  
  // Find the maximum position among existing documents
  const maxPosition = Math.max(...siblings.map(sibling => sibling.position || 0));
  
  // Return the next position (max + 1)
  return maxPosition + 1;
};
    // --- NEW helper: safely restore a document ---
    const restoreDocument = async (docId: Id<"documents">) => {
      const doc = await ctx.db.get(docId);
      if (!doc) return null;

      let parent = doc.parentDocument;

      // If the parent is archived, detach (make it a root note)
      if (parent) {
        const parentDoc = await ctx.db.get(parent);
        if (parentDoc?.isArchived) {
          parent = undefined;
        }
      }

      const newPosition = await getNextPosition(parent);

      // Restore the document with correct parent
      return ctx.db.patch(docId, {
        isArchived: false,
        parentDocument: parent,
        position: newPosition,
      });
    };

    // --- Recursive restore for children ---
    const recursiveRestore = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId)
        )
        .filter((q) => q.eq(q.field("isArchived"), true))
        .collect();

      for (const child of children) {
        await restoreDocument(child._id);
        await recursiveRestore(child._id);
      }
    };

    // Restore the main document first
    const restoredDoc = await restoreDocument(args.id);

    // Then recursively restore children
    await recursiveRestore(args.id);

    return restoredDoc;
  },
});

export const remove = mutation({
  args: {id : v.id("documents")},
  handler: async (ctx,args ) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if(!existingDocument) {
      throw new Error("Not found");
    }
    if(existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const document = await ctx.db.delete(args.id);

    return document;


  }
});

export const removeAllArchived = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;

    // Get all archived docs for this user
    const archivedDocs = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .collect();

    // Delete them one by one (Convex doesn’t have bulk delete yet)
    for (const doc of archivedDocs) {
      await ctx.db.delete(doc._id);
    }

    return { count: archivedDocs.length };
  },
});


export const getSearch = query({
  handler : async (ctx) => {

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;

    const documents = await ctx.db.query("documents")
    .withIndex("by_user",(q) => q.eq("userId",userId))
    .filter((q) =>
    q.eq(q.field("isArchived"),false)
  )
  .order("desc")
  .collect()

  return documents;

  }
});

export const getSearchArchived = query({
  handler : async (ctx) => {

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;

    const documents = await ctx.db.query("documents")
    .withIndex("by_user",(q) => q.eq("userId",userId))
    .filter((q) =>
    q.eq(q.field("isArchived"),true)
  )
  .order("desc")
  .collect()

  return documents;

  }
});

export const getById = query({
  args: { documentId:v.id("documents")},

  handler: async(ctx,args) => {

     const identity = await ctx.auth.getUserIdentity();
  

    const document = await ctx.db.get(args.documentId);

    if (!document) {
      throw new Error("Not found");
    }

    if(document.isPublished && !document.isArchived) {
      return document;

    }

    if(!identity) {
      throw new Error(" Not authenticated");
    }

    const userId = identity.subject;

    if(document.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return document;

  }
});

export const update = mutation({
  args: {
    id: v.id("documents"),
    title:v.optional(v.string()),
    content: v.optional(v.string()),
   plaintext: v.optional(v.string()),
    isPublished : v.optional(v.boolean())
  },
  handler : async (ctx,args) =>{
     const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;

    const { id, ...rest} = args;

    const existingDocument = await ctx.db.get(args.id);

    if(!existingDocument) {
      throw new Error("Not found");
    }
    if(existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const document = await ctx.db.patch(args.id, {
       ...rest,
       lastEdited: Date.now(),
    });

    return document;

  },
});

export const getAllSortedByLastEdited = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    // Only get documents for the current user
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false)) // Only non-archived docs
      .order("desc")
      .collect();

    return documents;
  },
});


