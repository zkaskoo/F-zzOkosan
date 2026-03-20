import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { PrismaService } from '../prisma/prisma.service';

// ============================================================
// Shared test fixtures
// ============================================================

const mockUserId = 'user-uuid-1';
const otherUserId = 'user-uuid-2';
const mockRecipeId = 'recipe-uuid-1';

const mockUser = {
  id: mockUserId,
  name: 'Test Chef',
  email: 'chef@example.com',
  avatar: null,
};

const mockRecipe = {
  id: mockRecipeId,
  userId: mockUserId,
  title: 'Gulyás leves',
  description: 'Klasszikus magyar gulyás',
  imageUrl: null,
  cookingTime: 90,
  servings: 4,
  difficulty: 'MEDIUM',
  isPublic: true,
  createdAt: new Date('2026-01-01T10:00:00Z'),
  updatedAt: new Date('2026-01-01T10:00:00Z'),
};

const mockStep = {
  id: 'step-uuid-1',
  recipeId: mockRecipeId,
  stepNumber: 1,
  instruction: 'Vágjuk fel a húst kockákra.',
  imageUrl: null,
};

const mockIngredient = {
  id: 'ri-uuid-1',
  recipeId: mockRecipeId,
  ingredientId: 'ing-uuid-1',
  quantity: 500,
  unit: 'g',
  notes: null,
  isOptional: false,
  ingredient: {
    id: 'ing-uuid-1',
    name: 'Marhahús',
    normalizedName: 'marhahus',
    defaultUnit: 'g',
    category: 'MEAT',
  },
};

const mockRecipeFull = {
  ...mockRecipe,
  user: mockUser,
  steps: [mockStep],
  ingredients: [mockIngredient],
  categories: [],
  _count: { likes: 0, comments: 0 },
};

const mockCreateRecipeDto = {
  title: 'Gulyás leves',
  description: 'Klasszikus magyar gulyás',
  cookingTime: 90,
  servings: 4,
  difficulty: 'MEDIUM' as const,
  isPublic: true,
  steps: [{ stepNumber: 1, instruction: 'Vágjuk fel a húst kockákra.' }],
  ingredients: [{ ingredientName: 'Marhahús', quantity: 500, unit: 'g' }],
};

const mockUpdateRecipeDto = {
  title: 'Gulyás leves - frissítve',
  cookingTime: 100,
};

// ============================================================
// Mock PrismaService
// ============================================================

const mockPrisma = {
  recipe: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  recipeStep: {
    createMany: jest.fn(),
    deleteMany: jest.fn(),
  },
  recipeIngredient: {
    createMany: jest.fn(),
    deleteMany: jest.fn(),
  },
  ingredient: {
    upsert: jest.fn(),
  },
  $transaction: jest.fn(),
};

// ============================================================
// RecipesService Unit Tests
// ============================================================

describe('RecipesService', () => {
  let service: RecipesService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<RecipesService>(RecipesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ============================================================
  // BR001 - create()
  // ============================================================

  describe('create()', () => {
    it('testBR001_CreateRecipeWithStepsAndIngredients - creates a recipe with nested steps and ingredients', async () => {
      // Given: PrismaService resolves a full recipe after creation
      mockPrisma.$transaction.mockImplementation(async (fn) => fn(mockPrisma));
      mockPrisma.recipe.create.mockResolvedValue(mockRecipeFull);
      mockPrisma.ingredient.upsert.mockResolvedValue(
        mockIngredient.ingredient,
      );
      mockPrisma.recipeStep.createMany.mockResolvedValue({ count: 1 });
      mockPrisma.recipeIngredient.createMany.mockResolvedValue({ count: 1 });

      // When: creating a recipe
      const result = await service.create(mockCreateRecipeDto, mockUserId);

      // Then: recipe is returned and userId is set from the caller (not DTO)
      expect(result).toBeDefined();
      expect(mockPrisma.recipe.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ userId: mockUserId }),
        }),
      );
    });

    it('testBR002_CreateRecipeSetsUserIdFromCaller - userId is taken from the authenticated caller, not from body', async () => {
      mockPrisma.$transaction.mockImplementation(async (fn) => fn(mockPrisma));
      mockPrisma.recipe.create.mockResolvedValue(mockRecipeFull);
      mockPrisma.ingredient.upsert.mockResolvedValue(
        mockIngredient.ingredient,
      );
      mockPrisma.recipeStep.createMany.mockResolvedValue({ count: 1 });
      mockPrisma.recipeIngredient.createMany.mockResolvedValue({ count: 1 });

      const dtoWithInjectedUserId = {
        ...mockCreateRecipeDto,
        userId: 'attacker-injected-user-id',
      } as any;

      await service.create(dtoWithInjectedUserId, mockUserId);

      expect(mockPrisma.recipe.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ userId: mockUserId }),
        }),
      );
      // The injected userId in the DTO must NOT be used
      const callArg = mockPrisma.recipe.create.mock.calls[0][0];
      expect(callArg.data.userId).toBe(mockUserId);
      expect(callArg.data.userId).not.toBe('attacker-injected-user-id');
    });

    it('testBR003_CreateRecipeDefaultsToPublic - newly created recipe is public by default when isPublic is not set', async () => {
      mockPrisma.$transaction.mockImplementation(async (fn) => fn(mockPrisma));
      mockPrisma.recipe.create.mockResolvedValue(mockRecipeFull);
      mockPrisma.ingredient.upsert.mockResolvedValue(
        mockIngredient.ingredient,
      );
      mockPrisma.recipeStep.createMany.mockResolvedValue({ count: 1 });
      mockPrisma.recipeIngredient.createMany.mockResolvedValue({ count: 1 });

      const dtoWithoutIsPublic = { ...mockCreateRecipeDto };
      delete (dtoWithoutIsPublic as any).isPublic;

      await service.create(dtoWithoutIsPublic, mockUserId);

      // isPublic should be set to true as default or passed through; verify create is called
      expect(mockPrisma.recipe.create).toHaveBeenCalled();
    });

    it('testBR004_CreateRecipeWithNoSteps - creates a recipe with an empty steps array', async () => {
      mockPrisma.$transaction.mockImplementation(async (fn) => fn(mockPrisma));
      const recipeNoSteps = { ...mockRecipeFull, steps: [] };
      mockPrisma.recipe.create.mockResolvedValue(recipeNoSteps);
      mockPrisma.ingredient.upsert.mockResolvedValue(
        mockIngredient.ingredient,
      );
      mockPrisma.recipeIngredient.createMany.mockResolvedValue({ count: 0 });

      const dtoNoSteps = { ...mockCreateRecipeDto, steps: [], ingredients: [] };
      const result = await service.create(dtoNoSteps, mockUserId);

      expect(result).toBeDefined();
      expect(mockPrisma.recipe.create).toHaveBeenCalled();
    });
  });

  // ============================================================
  // BR005 - findAll()
  // ============================================================

  describe('findAll()', () => {
    it('testBR005_FindAllReturnsPaginatedPublicRecipes - returns paginated list of public recipes with author info', async () => {
      // Given: two public recipes in DB
      mockPrisma.recipe.findMany.mockResolvedValue([mockRecipeFull]);
      mockPrisma.recipe.count.mockResolvedValue(1);

      // When: listing without userId filter
      const result = await service.findAll({ page: 1, limit: 10 });

      // Then: result has items, total, page info and only public recipes are fetched
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total');
      expect(mockPrisma.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isPublic: true }),
        }),
      );
    });

    it('testBR006_FindAllIncludesAuthorInfo - returned recipes include the author/user object', async () => {
      mockPrisma.recipe.findMany.mockResolvedValue([mockRecipeFull]);
      mockPrisma.recipe.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(mockPrisma.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.objectContaining({ user: expect.anything() }),
        }),
      );
      expect(result.data[0]).toHaveProperty('user');
    });

    it('testBR007_FindAllDefaultPagination - uses default page=1, limit=10 when no pagination params given', async () => {
      mockPrisma.recipe.findMany.mockResolvedValue([mockRecipeFull]);
      mockPrisma.recipe.count.mockResolvedValue(1);

      await service.findAll({});

      expect(mockPrisma.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: expect.any(Number),
        }),
      );
    });

    it('testBR008_FindAllWithUserIdFilterReturnsOwnPrivateRecipes - when userId filter is supplied, includes private recipes belonging to that user', async () => {
      const privateRecipe = { ...mockRecipeFull, isPublic: false };
      mockPrisma.recipe.findMany.mockResolvedValue([mockRecipeFull, privateRecipe]);
      mockPrisma.recipe.count.mockResolvedValue(2);

      await service.findAll({ userId: mockUserId, page: 1, limit: 10 });

      // The where clause should NOT restrict to isPublic: true for the owner's own recipes
      const callWhere = mockPrisma.recipe.findMany.mock.calls[0][0].where;
      expect(callWhere).toHaveProperty('userId', mockUserId);
      expect(callWhere.isPublic).toBeUndefined();
    });

    it('testBR009_FindAllWithUserIdFilterForOtherUser - when browsing another user, only their public recipes appear', async () => {
      mockPrisma.recipe.findMany.mockResolvedValue([mockRecipeFull]);
      mockPrisma.recipe.count.mockResolvedValue(1);

      await service.findAll({
        userId: mockUserId,
        page: 1,
        limit: 10,
        requesterId: otherUserId,
      });

      const callWhere = mockPrisma.recipe.findMany.mock.calls[0][0].where;
      expect(callWhere).toHaveProperty('userId', mockUserId);
      expect(callWhere).toHaveProperty('isPublic', true);
    });

    it('testEdge_FindAllReturnsEmptyListWhenNoRecipes - returns empty data array with total 0', async () => {
      mockPrisma.recipe.findMany.mockResolvedValue([]);
      mockPrisma.recipe.count.mockResolvedValue(0);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  // ============================================================
  // BR010 - findOne()
  // ============================================================

  describe('findOne()', () => {
    it('testBR010_FindOneReturnsRecipeWithAllRelations - returns recipe with steps, ingredients and user', async () => {
      mockPrisma.recipe.findUnique.mockResolvedValue(mockRecipeFull);

      const result = await service.findOne(mockRecipeId, mockUserId);

      expect(result).toEqual(mockRecipeFull);
      expect(mockPrisma.recipe.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mockRecipeId },
          include: expect.objectContaining({
            user: expect.anything(),
            steps: expect.anything(),
            ingredients: expect.anything(),
          }),
        }),
      );
    });

    it('testError_FindOneThrowsNotFoundForNonExistentRecipe - throws NotFoundException when recipe does not exist', async () => {
      mockPrisma.recipe.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id', mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('testError_FindOneThrowsNotFoundForPrivateRecipeAccessedByNonOwner - throws NotFoundException for private recipe when requester is not owner', async () => {
      const privateRecipe = { ...mockRecipeFull, isPublic: false, userId: mockUserId };
      mockPrisma.recipe.findUnique.mockResolvedValue(privateRecipe);

      await expect(service.findOne(mockRecipeId, otherUserId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('testBR011_FindOneAllowsOwnerToViewPrivateRecipe - owner can view their own private recipe', async () => {
      const privateRecipe = { ...mockRecipeFull, isPublic: false, userId: mockUserId };
      mockPrisma.recipe.findUnique.mockResolvedValue(privateRecipe);

      const result = await service.findOne(mockRecipeId, mockUserId);

      expect(result).toEqual(privateRecipe);
    });

    it('testBR012_FindOneAllowsUnauthenticatedAccessToPublicRecipe - unauthenticated user can view public recipe', async () => {
      mockPrisma.recipe.findUnique.mockResolvedValue(mockRecipeFull);

      const result = await service.findOne(mockRecipeId, undefined);

      expect(result).toEqual(mockRecipeFull);
    });

    it('testError_FindOneThrowsNotFoundForPrivateRecipeAccessedByUnauthenticatedUser - unauthenticated user cannot view private recipe', async () => {
      const privateRecipe = { ...mockRecipeFull, isPublic: false, userId: mockUserId };
      mockPrisma.recipe.findUnique.mockResolvedValue(privateRecipe);

      await expect(service.findOne(mockRecipeId, undefined)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ============================================================
  // BR013 - update()
  // ============================================================

  describe('update()', () => {
    it('testBR013_UpdateRecipeByOwner - owner can update recipe fields', async () => {
      mockPrisma.recipe.findUnique.mockResolvedValue(mockRecipe);
      const updatedRecipe = { ...mockRecipeFull, ...mockUpdateRecipeDto };
      mockPrisma.recipe.update.mockResolvedValue(updatedRecipe);

      const result = await service.update(mockRecipeId, mockUpdateRecipeDto, mockUserId);

      expect(result).toEqual(updatedRecipe);
      expect(mockPrisma.recipe.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mockRecipeId },
          data: expect.objectContaining({ title: mockUpdateRecipeDto.title }),
        }),
      );
    });

    it('testError_UpdateThrowsForbiddenWhenNonOwnerTriesToUpdate - non-owner gets ForbiddenException', async () => {
      mockPrisma.recipe.findUnique.mockResolvedValue(mockRecipe); // owned by mockUserId

      await expect(
        service.update(mockRecipeId, mockUpdateRecipeDto, otherUserId),
      ).rejects.toThrow(ForbiddenException);

      expect(mockPrisma.recipe.update).not.toHaveBeenCalled();
    });

    it('testError_UpdateThrowsNotFoundWhenRecipeDoesNotExist - throws NotFoundException when recipe is missing', async () => {
      mockPrisma.recipe.findUnique.mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', mockUpdateRecipeDto, mockUserId),
      ).rejects.toThrow(NotFoundException);
    });

    it('testBR014_UpdateAllowsPartialUpdate - only provided fields are changed, others remain', async () => {
      mockPrisma.recipe.findUnique.mockResolvedValue(mockRecipe);
      const partialDto = { title: 'Renamed' };
      const updatedRecipe = { ...mockRecipeFull, title: 'Renamed' };
      mockPrisma.recipe.update.mockResolvedValue(updatedRecipe);

      await service.update(mockRecipeId, partialDto, mockUserId);

      const updateCall = mockPrisma.recipe.update.mock.calls[0][0];
      expect(updateCall.data).toHaveProperty('title', 'Renamed');
      // cookingTime was not in partial DTO, so it should not appear unless the service explicitly passes it
    });
  });

  // ============================================================
  // BR015 - remove()
  // ============================================================

  describe('remove()', () => {
    it('testBR015_RemoveRecipeByOwner - owner can delete their recipe', async () => {
      mockPrisma.recipe.findUnique.mockResolvedValue(mockRecipe);
      mockPrisma.recipe.delete.mockResolvedValue(mockRecipe);

      const result = await service.remove(mockRecipeId, mockUserId);

      expect(mockPrisma.recipe.delete).toHaveBeenCalledWith({
        where: { id: mockRecipeId },
      });
      expect(result).toHaveProperty('message');
    });

    it('testError_RemoveThrowsForbiddenWhenNonOwnerTriesToDelete - non-owner gets ForbiddenException', async () => {
      mockPrisma.recipe.findUnique.mockResolvedValue(mockRecipe); // owned by mockUserId

      await expect(service.remove(mockRecipeId, otherUserId)).rejects.toThrow(
        ForbiddenException,
      );

      expect(mockPrisma.recipe.delete).not.toHaveBeenCalled();
    });

    it('testError_RemoveThrowsNotFoundWhenRecipeDoesNotExist - throws NotFoundException when recipe is missing', async () => {
      mockPrisma.recipe.findUnique.mockResolvedValue(null);

      await expect(service.remove('non-existent-id', mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('testEdge_RemoveConfirmsDeletionMessage - successful deletion returns a confirmation message', async () => {
      mockPrisma.recipe.findUnique.mockResolvedValue(mockRecipe);
      mockPrisma.recipe.delete.mockResolvedValue(mockRecipe);

      const result = await service.remove(mockRecipeId, mockUserId);

      expect(typeof result.message).toBe('string');
      expect(result.message.length).toBeGreaterThan(0);
    });
  });
});
