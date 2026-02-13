import { z } from 'zod';

// ---------- Constants ----------

export const MATCH_STATUS = {
    SCHEDULED: 'scheduled',
    LIVE: 'live',
    FINISHED: 'finished',
};

// ---------- Reusable fields ----------

const coercedPositiveInt = z.coerce.number().int().positive();
const coercedNonNegativeInt = z.coerce.number().int().min(0);

const isoDateString = z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Must be a valid ISO date string',
    });

// ---------- Schemas ----------

export const listMatchesQuerySchema = z.object({
    limit: coercedPositiveInt.max(100).optional(),
});

export const matchIdParamSchema = z.object({
    id: coercedPositiveInt,
});

export const createMatchSchema = z
    .object({
        sport: z.string().min(1, 'sport is required'),
        homeTeam: z.string().min(1, 'homeTeam is required'),
        awayTeam: z.string().min(1, 'awayTeam is required'),
        startTime: isoDateString,
        endTime: isoDateString,
        homeScore: coercedNonNegativeInt.optional(),
        awayScore: coercedNonNegativeInt.optional(),
    })
    .superRefine((data, ctx) => {
        if (Date.parse(data.endTime) <= Date.parse(data.startTime)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['endTime'],
                message: 'endTime must be chronologically after startTime',
            });
        }
    });

export const updateScoreSchema = z.object({
    homeScore: coercedNonNegativeInt,
    awayScore: coercedNonNegativeInt,
});