import { test, expect } from "@playwright/test";
import { Client } from "pg";
import { randomBytes,createHash } from "node:crypto";
const origin=process.env.E2E_BASE_URL||"http://localhost:3000";
test("authorization, CSRF and public signup boundaries",async({request})=>{
 expect((await request.get("/api/cron/email")).status()).toBe(401);
 expect((await request.post("/api/admin/upload",{headers:{Origin:origin}})).status()).toBe(401);
 expect((await request.post("/api/subscribe",{headers:{Origin:"https://untrusted.example"},data:{}})).status()).toBe(403);
 expect((await request.post("/api/auth/sign-up/email",{headers:{Origin:origin},data:{name:"Public signup",email:"signup@example.com",password:"NotAnAllowedAccount123!"}})).status()).toBeGreaterThanOrEqual(400);
 if(process.env.E2E_ADMIN_PASSWORD){
 const signed=await request.post("/api/auth/sign-in/email",{headers:{Origin:origin},data:{email:"ordinary@tpav-test.example",password:process.env.E2E_ADMIN_PASSWORD}});expect(signed.status()).toBeGreaterThanOrEqual(400);
 }
});
test("expired token remains inactive and malformed token is rejected",async({request})=>{
 const database=process.env.E2E_DATABASE_URL;test.skip(!database,"Requires an isolated test database.");
 if(!new URL(database!).pathname.includes("tpav_codex_test_"))throw new Error("Refusing to modify a non-test database.");
 const client=new Client({connectionString:database});await client.connect();
 const raw=randomBytes(32).toString("hex"),id="expired-"+Date.now();
 try{
 await client.query('INSERT INTO "Subscriber" (id,name,email,"verificationToken","verificationExpiresAt","createdAt","updatedAt") VALUES ($1,\'Expired Test\',$2,$3,(CURRENT_TIMESTAMP AT TIME ZONE \'UTC\')-INTERVAL \'1 hour\',NOW(),NOW())',[id,id+"@example.com",createHash("sha256").update(raw).digest("hex")]);
 expect((await request.post("/api/subscription",{headers:{Origin:origin},data:{action:"verify",token:raw}})).status()).toBe(410);
 expect((await request.post("/api/subscription",{headers:{Origin:origin},data:{action:"verify",token:"bad"}})).status()).toBe(400);
 expect((await client.query('SELECT subscribed FROM "Subscriber" WHERE id=$1',[id])).rows[0].subscribed).toBe(false);
 }finally{await client.query('DELETE FROM "Subscriber" WHERE id=$1',[id]);await client.end();}
});
