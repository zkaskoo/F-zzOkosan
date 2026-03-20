import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { AuthenticatedRequest } from '../auth/interfaces';

// ============================================================
// Shared test fixtures
// ============================================================

const mockUserId = 'user-uuid-1';
const otherUserId = 'user-uuid-2';
const mockRecipeId = 'recipe-uuid-1';

const mockAuthenticatedRequest = {
  user: { id: mockUserId, email: 'chef@example.com', name: 'Test Chef' },
} as unknown as AuthenticatedRequest;

const mockRecipeSummary = {
  id: mockRecipeId,
  userId: mockUserId,
  title: 'Gulyas leves',
  description: 'Klasszikus magyar gulyas',
  imageUrl: null,
  cookingTime: 90,
  servings: 4,
  difficulty: 'MEDIUM',
  isPublic: true,
  createdAt: new Date('2026-01-01T10:00:00Z'),
  updatedAt: new Date('2026-01-01T10:00:00Z'),
  user: { id: mockUserId, name: 'Test Chef', avatar: null },
  _count: { likes: 0, comments: 0 },
};

const mockRecipeFull = {
  ...mockRecipeSummary,
  steps: [{ id: 'step-1', stepNumber: 1, instruction: 'Vagjuk fel a hust.' }],
  ingredients: [],
  categories: [],
};

const mockPaginatedResult = {
  data: [mockRecipeSummary],
  total: 1,
  page: 1,
  limit: 10,
  totalPages: 1,
};

const mockCreateDto = {
  title: 'Gulyas leves',
  description: 'Klasszikus magyar gulyas',
  cookingTime: 90,
  servings: 4,
  difficulty: 'MEDIUM' as const,
  isPublic: true,
  steps: [{ stepNumber: 1, instruction: 'Vagjuk fel a hust.' }],
  ingredients: [],
};

const mockUpdateDto = { title: 'Gulyas leves - frissitve' };

// ============================================================
// Mock RecipesService
// ============================================================

const mockRecipesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

// ============================================================
// RecipesController Unit Tests
// ============================================================

describe('RecipesController', () => {
  let controller: RecipesController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [{ provide: RecipesService, useValue: mockRecipesService }],
    }).compile();

    controller = module.get<RecipesController>(RecipesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ============================================================
  // POST /recipes
  // ============================================================

  describe('POST /recipes - create()', () => {
    it('testBR001_PostRecipesCreatesRecipe - delegates to service with dto and caller userId', async () => {
      // Given: service will return a new recipe
      mockRecipesService.create.mockResolvedValue(mockRecipeFull);

      // When: authenticated user POSTs a new recipe
      const result = await controller.create(
        mockCreateDto,
        mockAuthenticatedRequest,
      );

      // Then: service.create is called with the DTO and the authenticated user's ID
      expect(mockRecipesService.create).toHaveBeenCalledWith(
        mockCreateDto,
        mockUserId,
      );
      expect(result).toEqual(mockRecipeFull);
    });

    it('testBR002_PostRecipesUsesRequestUserNotBody - userId passed to service comes from req.user, not body', async () => {
      mockRecipesService.create.mockResolvedValue(mockRecipeFull);

      await controller.create(mockCreateDto, mockAuthenticatedRequest);

      const calledArgs = mockRecipesService.create.mock.calls[0] as [
        unknown,
        string,
      ];
      expect(calledArgs[1]).toBe(mockUserId);
    });

    it('testEdge_PostRecipesForwardsServiceErrors - propagates errors thrown by service', async () => {
      mockRecipesService.create.mockRejectedValue(new Error('DB error'));

      await expect(
        controller.create(mockCreateDto, mockAuthenticatedRequest),
      ).rejects.toThrow('DB error');
    });
  });

  // ============================================================
  // GET /recipes
  // ============================================================

  describe('GET /recipes - findAll()', () => {
    it('testBR003_GetRecipesReturnsPaginatedList - returns paginated recipe list from service', async () => {
      // Given: service returns paginated list
      mockRecipesService.findAll.mockResolvedValue(mockPaginatedResult);

      // When: GET /recipes?page=1&limit=10
      const result = await controller.findAll(1, 10, undefined, undefined);

      // Then: result matches paginated structure
      expect(result).toEqual(mockPaginatedResult);
      expect(mockRecipesService.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ page: 1, limit: 10 }),
      );
    });

    it('testBR004_GetRecipesWithUserIdFilter - passes userId filter to service when query param is provided', async () => {
      mockRecipesService.findAll.mockResolvedValue(mockPaginatedResult);

      await controller.findAll(1, 10, mockUserId, undefined);

      expect(mockRecipesService.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ userId: mockUserId }),
      );
    });

    it('testBR005_GetRecipesWithAuthenticatedRequester - passes requesterId when user is authenticated', async () => {
      mockRecipesService.findAll.mockResolvedValue(mockPaginatedResult);

      await controller.findAll(1, 10, undefined, mockAuthenticatedRequest);

      expect(mockRecipesService.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ requesterId: mockUserId }),
      );
    });

    it('testEdge_GetRecipesWithoutAuthenticatedUser - requesterId is undefined for unauthenticated request', async () => {
      mockRecipesService.findAll.mockResolvedValue(mockPaginatedResult);

      // No authenticated user - pass undefined/null request
      await controller.findAll(1, 10, undefined, undefined);

      const callArg = mockRecipesService.findAll.mock.calls[0]?.[0] as {
        requesterId?: string;
      };
      expect(callArg.requesterId).toBeUndefined();
    });

    it('testEdge_GetRecipesDefaultPagination - uses page=1, limit=10 when no pagination params given', async () => {
      mockRecipesService.findAll.mockResolvedValue(mockPaginatedResult);

      await controller.findAll(undefined, undefined, undefined, undefined);

      expect(mockRecipesService.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          page: expect.any(Number),
          limit: expect.any(Number),
        }),
      );
    });
  });

  // ============================================================
  // GET /recipes/:id
  // ============================================================

  describe('GET /recipes/:id - findOne()', () => {
    it('testBR006_GetRecipeByIdReturnsSingleRecipe - returns recipe with full relations', async () => {
      // Given: service resolves with full recipe
      mockRecipesService.findOne.mockResolvedValue(mockRecipeFull);

      // When: GET /recipes/:id
      const result = await controller.findOne(mockRecipeId, undefined);

      // Then: correct recipe is returned and service was queried with id
      expect(result).toEqual(mockRecipeFull);
      expect(mockRecipesService.findOne).toHaveBeenCalledWith(
        mockRecipeId,
        undefined,
      );
    });

    it('testBR007_GetRecipeByIdPassesRequesterIdForPrivacyCheck - passes authenticated user id to service', async () => {
      mockRecipesService.findOne.mockResolvedValue(mockRecipeFull);

      await controller.findOne(mockRecipeId, mockAuthenticatedRequest);

      expect(mockRecipesService.findOne).toHaveBeenCalledWith(
        mockRecipeId,
        mockUserId,
      );
    });

    it('testError_GetRecipeByIdForwardsNotFoundFromService - propagates NotFoundException from service', async () => {
      mockRecipesService.findOne.mockRejectedValue(
        new NotFoundException('A recept nem található'),
      );

      await expect(
        controller.findOne('non-existent-id', undefined),
      ).rejects.toThrow(NotFoundException);
    });

    it('testError_GetRecipeByIdForwardsForbiddenFromService - propagates NotFoundException for private recipe', async () => {
      mockRecipesService.findOne.mockRejectedValue(
        new NotFoundException('A recept nem található'),
      );

      const otherRequest = {
        user: { id: otherUserId, email: 'other@example.com', name: 'Other' },
      } as unknown as AuthenticatedRequest;

      await expect(
        controller.findOne(mockRecipeId, otherRequest),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ============================================================
  // PATCH /recipes/:id
  // ============================================================

  describe('PATCH /recipes/:id - update()', () => {
    it('testBR008_PatchRecipeUpdatesRecipeForOwner - calls service update with id, dto and caller userId', async () => {
      // Given: service returns updated recipe
      const updatedRecipe = {
        ...mockRecipeFull,
        title: 'Gulyas leves - frissitve',
      };
      mockRecipesService.update.mockResolvedValue(updatedRecipe);

      // When: authenticated owner PATCHes the recipe
      const result = await controller.update(
        mockRecipeId,
        mockUpdateDto,
        mockAuthenticatedRequest,
      );

      // Then: service.update is called with correct arguments
      expect(mockRecipesService.update).toHaveBeenCalledWith(
        mockRecipeId,
        mockUpdateDto,
        mockUserId,
      );
      expect(result).toEqual(updatedRecipe);
    });

    it('testError_PatchRecipeForwardsForbiddenFromService - propagates ForbiddenException for non-owner', async () => {
      mockRecipesService.update.mockRejectedValue(
        new ForbiddenException('Access denied'),
      );

      const otherRequest = {
        user: { id: otherUserId, email: 'other@example.com', name: 'Other' },
      } as unknown as AuthenticatedRequest;

      await expect(
        controller.update(mockRecipeId, mockUpdateDto, otherRequest),
      ).rejects.toThrow(ForbiddenException);
    });

    it('testError_PatchRecipeForwardsNotFoundFromService - propagates NotFoundException when recipe is missing', async () => {
      mockRecipesService.update.mockRejectedValue(
        new NotFoundException('A recept nem található'),
      );

      await expect(
        controller.update(
          'non-existent-id',
          mockUpdateDto,
          mockAuthenticatedRequest,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ============================================================
  // DELETE /recipes/:id
  // ============================================================

  describe('DELETE /recipes/:id - remove()', () => {
    it('testBR009_DeleteRecipeRemovesRecipeForOwner - calls service remove with id and caller userId', async () => {
      // Given: service confirms deletion
      mockRecipesService.remove.mockResolvedValue({
        message: 'A recept sikeresen törölve',
      });

      // When: authenticated owner DELETEs the recipe
      const result = await controller.remove(
        mockRecipeId,
        mockAuthenticatedRequest,
      );

      // Then: service.remove called with id and userId
      expect(mockRecipesService.remove).toHaveBeenCalledWith(
        mockRecipeId,
        mockUserId,
      );
      expect(result).toHaveProperty('message');
    });

    it('testError_DeleteRecipeForwardsForbiddenFromService - propagates ForbiddenException for non-owner', async () => {
      mockRecipesService.remove.mockRejectedValue(
        new ForbiddenException('Access denied'),
      );

      const otherRequest = {
        user: { id: otherUserId, email: 'other@example.com', name: 'Other' },
      } as unknown as AuthenticatedRequest;

      await expect(
        controller.remove(mockRecipeId, otherRequest),
      ).rejects.toThrow(ForbiddenException);
    });

    it('testError_DeleteRecipeForwardsNotFoundFromService - propagates NotFoundException when recipe is missing', async () => {
      mockRecipesService.remove.mockRejectedValue(
        new NotFoundException('A recept nem található'),
      );

      await expect(
        controller.remove('non-existent-id', mockAuthenticatedRequest),
      ).rejects.toThrow(NotFoundException);
    });

    it('testEdge_DeleteRecipeReturnsConfirmationMessage - deletion response contains a message string', async () => {
      mockRecipesService.remove.mockResolvedValue({
        message: 'A recept sikeresen törölve',
      });

      const result = await controller.remove(
        mockRecipeId,
        mockAuthenticatedRequest,
      );

      expect(typeof result.message).toBe('string');
    });
  });
});
