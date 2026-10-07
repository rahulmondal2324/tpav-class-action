import "server-only";

import { randomUUID, timingSafeEqual } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const setupSchema = z.object({
    email: z
        .string()
        .trim()
        .email()
        .max(254)
        .transform((value) => value.toLowerCase()),

    name: z
        .string()
        .trim()
        .min(2)
        .max(100),

    password: z
        .string()
        .min(12)
        .max(128),
});

function secureEqual(
    supplied: string,
    expected: string,
) {
    const suppliedBuffer =
        Buffer.from(supplied);

    const expectedBuffer =
        Buffer.from(expected);

    if (
        suppliedBuffer.length !==
        expectedBuffer.length
    ) {
        return false;
    }

    return timingSafeEqual(
        suppliedBuffer,
        expectedBuffer,
    );
}

export async function POST(
    request: Request,
) {
    try {
        /* ==========================================
           REQUIRE SETUP SECRET
        ========================================== */

        const expectedSecret =
            process.env.ADMIN_SETUP_SECRET;

        if (!expectedSecret) {
            return Response.json(
                {
                    error:
                        "Admin setup is disabled.",
                },
                {
                    status: 404,
                },
            );
        }

        const suppliedSecret =
            request.headers.get(
                "x-admin-setup-secret",
            );

        if (
            !suppliedSecret ||
            !secureEqual(
                suppliedSecret,
                expectedSecret,
            )
        ) {
            return Response.json(
                {
                    error: "Unauthorized.",
                },
                {
                    status: 401,
                },
            );
        }

        /* ==========================================
           ONLY ALLOW FIRST ADMIN
        ========================================== */

        const existingAdmin =
            await prisma.user.findFirst({
                where: {
                    role: "admin",
                },

                select: {
                    id: true,
                },
            });

        if (existingAdmin) {
            return Response.json(
                {
                    error:
                        "An administrator already exists. Setup is disabled.",
                },
                {
                    status: 409,
                },
            );
        }

        /* ==========================================
           VALIDATE BODY
        ========================================== */

        const body =
            setupSchema.parse(
                await request.json(),
            );

        /* ==========================================
           MAKE SURE EMAIL DOESN'T EXIST
        ========================================== */

        const existingUser =
            await prisma.user.findUnique({
                where: {
                    email: body.email,
                },

                select: {
                    id: true,
                },
            });

        if (existingUser) {
            return Response.json(
                {
                    error:
                        "An account with this email already exists.",
                },
                {
                    status: 409,
                },
            );
        }

        /* ==========================================
           HASH PASSWORD
        ========================================== */

        const passwordHash =
            await hashPassword(
                body.password,
            );

        const userId =
            randomUUID();

        /* ==========================================
           CREATE BETTER AUTH USER + ACCOUNT
        ========================================== */

        await prisma.user.create({
            data: {
                id: userId,

                email: body.email,

                name: body.name,

                emailVerified: true,

                role: "admin",

                accounts: {
                    create: {
                        id: randomUUID(),

                        accountId: userId,

                        providerId:
                            "credential",

                        password:
                            passwordHash,
                    },
                },
            },
        });

        return Response.json(
            {
                success: true,

                message:
                    "Production administrator created successfully.",
            },
            {
                status: 201,
            },
        );
    } catch (error) {
        console.error(
            "Admin setup failed:",
            error,
        );

        if (error instanceof z.ZodError) {
            return Response.json(
                {
                    error:
                        "Please provide a valid email, name and password of at least 12 characters.",
                },
                {
                    status: 400,
                },
            );
        }

        return Response.json(
            {
                error:
                    "Unable to create administrator.",
            },
            {
                status: 500,
            },
        );
    }
}