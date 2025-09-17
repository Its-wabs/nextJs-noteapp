import {defineSchema, defineTable} from "convex/server";
import {v } from "convex/values";

export default defineSchema({
    documents: defineTable({
        title : v.string(),
        userId: v.string(),
        isArchived: v.boolean(),
        parentDocument: v.optional(v.id("documents")),
        type: v.union(v.literal("note"), v.literal("folder")),
        content : v.optional(v.string()),
        isPublished: v.boolean(),
        plaintext: v.optional(v.string()),
        position: v.optional(v.number()),
        lastEdited: v.optional(v.number()),
    })
    .index("by_user",["userId"])

    .index("by_user_parent",["userId","parentDocument"])
  
});
