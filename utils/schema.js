import { pgTable, serial, text, varchar, uuid, timestamp } from 'drizzle-orm/pg-core';

export const MockInterview = pgTable('mockInterview', {
    id: serial('id').primaryKey(),
    mockId: uuid('mockId').defaultRandom(),
    jsonMockResp: text('jsonMockResp').notNull(),
    jobPosition: varchar('jobPosition').notNull(),
    jobDesc: varchar('jobDesc').notNull(),
    jobExperience: varchar('jobExperience').notNull(),
    createdBy: varchar('createdBy').notNull(),
    createdAt:varchar('createdAt')
});

export const UserAnswer=pgTable('userAnswer',{
    id:serial('id').primaryKey(),
    mockIdRef:uuid('mockId').notNull(),
    question:varchar('question').notNull(),
    correctAns:varchar('correctAns'),
    userAns:text('UserAns'),
    feedback:text('feedback'),
    rating:varchar('rating'),
    userEmail:varchar('userEmail'),
    createdAt:varchar('createdAt')
});




