import { describe, it, expect, beforeAll } from 'vitest';
import { appRouter } from './routers';
import * as db from './db';

describe('API Procedures', () => {
  describe('Pests API', () => {
    it('should list all pests', async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const pests = await caller.pests.list();
      
      expect(pests).toBeDefined();
      expect(Array.isArray(pests)).toBe(true);
      expect(pests.length).toBeGreaterThan(0);
      expect(pests.length).toBe(230); // Should have all 230 migrated pests
    });

    it('should search pests by query', async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const results = await caller.pests.search({ query: 'gorse' });
      
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(p => p.title.toLowerCase().includes('gorse'))).toBe(true);
    });

    it('should get pest by title', async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const pest = await caller.pests.getByTitle({ title: 'Gorse' });
      
      expect(pest).toBeDefined();
      expect(pest?.title).toBe('Gorse');
      expect(pest?.latin).toBeDefined();
    });

    it('should return empty array for non-matching search', async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const results = await caller.pests.search({ query: 'xyznonexistent123' });
      
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });
  });

  describe('Submissions API', () => {
    it('should create a submission without photo', async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: { 
          headers: { 'user-agent': 'test-agent' },
          socket: { remoteAddress: '127.0.0.1' }
        } as any,
        res: {} as any,
      });

      const result = await caller.submissions.create({
        pestId: 1,
        pestTitle: 'Test Pest',
        location: 'Test Location',
        observationDate: new Date('2025-01-01'),
        notes: 'Test observation',
        impactWhenua: 'medium',
        impactWai: 'low',
        impactTangata: 'none',
        submitterName: 'Test User',
        submitterEmail: 'test@example.com',
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should require admin role to list submissions', async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      await expect(caller.submissions.list()).rejects.toThrow();
    });

    it('should allow admin to list submissions', async () => {
      const caller = appRouter.createCaller({
        user: { 
          id: 1, 
          openId: 'test-admin', 
          role: 'admin',
          name: 'Admin User',
          email: null,
          loginMethod: null,
          lastSignedIn: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        req: {} as any,
        res: {} as any,
      });

      const submissions = await caller.submissions.list();
      
      expect(submissions).toBeDefined();
      expect(Array.isArray(submissions)).toBe(true);
    });
  });

  describe('Authentication API', () => {
    it('should return null for unauthenticated user', async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const user = await caller.auth.me();
      
      expect(user).toBeNull();
    });

    it('should return user data for authenticated user', async () => {
      const mockUser = {
        id: 1,
        openId: 'test-user',
        role: 'user' as const,
        name: 'Test User',
        email: 'test@example.com',
        loginMethod: 'oauth' as const,
        lastSignedIn: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const caller = appRouter.createCaller({
        user: mockUser,
        req: {} as any,
        res: {} as any,
      });

      const user = await caller.auth.me();
      
      expect(user).toEqual(mockUser);
    });
  });
});
