import { eq } from "drizzle-orm"

import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { uploadFileToFirebase } from "@/lib/firebase";

export async function POST(req: Request){
    try {
        const {noteId} = await req.json();
        // extract out the dalle imageUrl
        const notes = await db.select().from($notes).where(
            eq($notes.id, parseInt(noteId))
        )
        // save it to firebase
        if(!notes[0].imageUrl){
            return new NextResponse('no image url', { status: 400 });
        }
        const firebase_url = await uploadFileToFirebase(notes[0].imageUrl, notes[0].name);

        await db.update($notes).set({
            imageUrl: firebase_url
        }).where(
            eq($notes.id, parseInt(noteId))
        );
        return new NextResponse('ok', { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse('failed to upload to firebase', { status: 500 });        
    }
}