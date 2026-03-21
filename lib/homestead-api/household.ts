import {
    eq,
    supabaseInsertOne,
    supabaseList,
    supabaseRemove,
    supabaseSingle,
    supabaseUpdateOne,
} from '@/lib/supabase';
import type {
    ChildRecord,
    CreateChildInput,
    CreateFamilyInput,
    CreateParentInput,
    FamilyRecord,
    ParentRecord,
    UpdateChildInput,
    UpdateFamilyInput,
    UpdateParentInput,
} from './types';

export const familiesApi = {
    create: (input: CreateFamilyInput) => supabaseInsertOne<FamilyRecord>('families', input),
    getById: (familyId: string) => supabaseSingle<FamilyRecord>('families', { id: eq(familyId) }),
    list: () => supabaseList<FamilyRecord>('families'),
    remove: (familyId: string) => supabaseRemove('families', { id: eq(familyId) }),
    update: (familyId: string, input: UpdateFamilyInput) =>
        supabaseUpdateOne<FamilyRecord>('families', input, { id: eq(familyId) }),
};

export const parentsApi = {
    create: (input: CreateParentInput) => supabaseInsertOne<ParentRecord>('parents', input),
    listByFamily: (familyId: string) => supabaseList<ParentRecord>('parents', { familyId: eq(familyId) }),
    remove: (parentId: string) => supabaseRemove('parents', { id: eq(parentId) }),
    update: (parentId: string, input: UpdateParentInput) =>
        supabaseUpdateOne<ParentRecord>('parents', input, { id: eq(parentId) }),
};

export const childrenApi = {
    create: (input: CreateChildInput) => supabaseInsertOne<ChildRecord>('children', input),
    listByFamily: (familyId: string) => supabaseList<ChildRecord>('children', { familyId: eq(familyId) }),
    remove: (childId: string) => supabaseRemove('children', { id: eq(childId) }),
    update: (childId: string, input: UpdateChildInput) =>
        supabaseUpdateOne<ChildRecord>('children', input, { id: eq(childId) }),
};
