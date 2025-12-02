import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";
import { storagePut } from "./storage";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ 
      code: 'FORBIDDEN',
      message: 'Admin access required' 
    });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ==================== PEST ROUTES ====================
  pests: router({
    // Public: Get all visible pests
    list: publicProcedure.query(async () => {
      return await db.getAllPests();
    }),

    // Public: Search pests
    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        if (!input.query.trim()) {
          return await db.getAllPests();
        }
        return await db.searchPests(input.query);
      }),

    // Public: Get pest by ID
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const pest = await db.getPestById(input.id);
        if (!pest) {
          throw new TRPCError({ 
            code: 'NOT_FOUND',
            message: 'Pest not found' 
          });
        }
        return pest;
      }),

    // Public: Get pest by title
    getByTitle: publicProcedure
      .input(z.object({ title: z.string() }))
      .query(async ({ input }) => {
        const pest = await db.getPestByTitle(input.title);
        if (!pest) {
          throw new TRPCError({ 
            code: 'NOT_FOUND',
            message: 'Pest not found' 
          });
        }
        return pest;
      }),

    // Admin: Create pest
    create: adminProcedure
      .input(z.object({
        title: z.string(),
        latin: z.string().optional(),
        alsoKnownAs: z.string().optional(),
        keywords: z.string().optional(),
        pestGroups: z.string().optional(),
        pestTypes: z.string().optional(),
        managementApproaches: z.string().optional(),
        alert: z.boolean().optional(),
        pinned: z.boolean().optional(),
        visible: z.boolean().optional(),
        featuredImage: z.string().optional(),
        link: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createPest(input);
        return { success: true };
      }),

    // Admin: Update pest
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          title: z.string().optional(),
          latin: z.string().optional(),
          alsoKnownAs: z.string().optional(),
          keywords: z.string().optional(),
          pestGroups: z.string().optional(),
          pestTypes: z.string().optional(),
          managementApproaches: z.string().optional(),
          alert: z.boolean().optional(),
          pinned: z.boolean().optional(),
          visible: z.boolean().optional(),
          featuredImage: z.string().optional(),
          link: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await db.updatePest(input.id, input.data);
        return { success: true };
      }),

    // Admin: Delete pest
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deletePest(input.id);
        return { success: true };
      }),
  }),

  // ==================== SUBMISSION ROUTES ====================
  submissions: router({
    // Admin: Get all submissions
    list: adminProcedure.query(async () => {
      return await db.getAllSubmissions();
    }),

    // Admin: Get submission by ID
    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const submission = await db.getSubmissionById(input.id);
        if (!submission) {
          throw new TRPCError({ 
            code: 'NOT_FOUND',
            message: 'Submission not found' 
          });
        }
        return submission;
      }),

    // Public: Create submission (with photo upload)
    create: publicProcedure
      .input(z.object({
        pestId: z.number(),
        pestTitle: z.string(),
        location: z.string(),
        observationDate: z.date(),
        notes: z.string().optional(),
        impactWhenua: z.enum(["none", "low", "medium", "high", "severe"]).optional(),
        impactWai: z.enum(["none", "low", "medium", "high", "severe"]).optional(),
        impactTangata: z.enum(["none", "low", "medium", "high", "severe"]).optional(),
        photoBase64: z.string().optional(), // Base64 encoded photo
        submitterName: z.string().optional(),
        submitterEmail: z.string().email().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        let photoUrl: string | null = null;
        let photoKey: string | null = null;

        // Handle photo upload to S3
        if (input.photoBase64) {
          try {
            // Extract base64 data and convert to buffer
            const matches = input.photoBase64.match(/^data:(.+);base64,(.+)$/);
            if (matches) {
              const mimeType = matches[1];
              const base64Data = matches[2];
              const buffer = Buffer.from(base64Data, 'base64');
              
              // Generate unique key
              const timestamp = Date.now();
              const randomSuffix = Math.random().toString(36).substring(7);
              photoKey = `submissions/${timestamp}-${randomSuffix}.jpg`;
              
              // Upload to S3
              const result = await storagePut(photoKey, buffer, mimeType);
              photoUrl = result.url;
            }
          } catch (error) {
            console.error("Error uploading photo:", error);
            // Continue without photo if upload fails
          }
        }

        // Get client IP and user agent
        const ipAddress = ctx.req.headers['x-forwarded-for'] as string || 
                         ctx.req.headers['x-real-ip'] as string ||
                         ctx.req.socket.remoteAddress || null;
        const userAgent = ctx.req.headers['user-agent'] || null;

        await db.createSubmission({
          pestId: input.pestId,
          pestTitle: input.pestTitle,
          location: input.location,
          observationDate: input.observationDate,
          notes: input.notes || null,
          impactWhenua: input.impactWhenua || null,
          impactWai: input.impactWai || null,
          impactTangata: input.impactTangata || null,
          photoUrls: photoUrl,
          photoKeys: photoKey,
          submitterName: input.submitterName || null,
          submitterEmail: input.submitterEmail || null,
          ipAddress: ipAddress,
          userAgent: userAgent,
        });

        return { success: true };
      }),

    // Admin: Delete submission
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteSubmission(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
