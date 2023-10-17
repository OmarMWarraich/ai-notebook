'use client';

import React from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';

type Props = {}

const CreateNoteDialogue = (props: Props) => {
    const [input, setInput] = React.useState('')
    const router = useRouter()
    const createNoteBook = useMutation({
        mutationFn: async () => {
            const response = await axios.post('/api/createNotebook', {
                name: input
            })
            return response.data
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        if (input === '') {
            window.alert('Please enter a name for the notebook')
            return
        }

        createNoteBook.mutate(undefined, {
            onSuccess: ({note_id}) => {
                console.log("created new note:",{note_id})
                router.push(`/notebook/${note_id}`)
            },
            onError: (error) => {
                console.error(error)
            }
        })
    }

  return (
    <Dialog>
        <DialogTrigger>
            <div className="border-dashed border-2 flex border-green-600 h-full rounded-lg items-center justify-center sm:flex-col hover:shadow-xl transition hover:-translate-y-1 flex-row p-4">
                <Plus className="w-6 h-6 text-green-600 strokeWidth={3}"/>
                <h2 className="font-semibold text-green-600 sm:mt-2">
                    New NoteBook
                </h2>
            </div>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    New NoteBook
                </DialogTitle>
                <DialogDescription>
                    You can create a new dialog by clicking the button below.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
                <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Name..." />
                <div className="h-4"></div>
                <div className="flex items-center gap-2">
                    <Button type="reset" variant="secondary">
                        Cancel
                    </Button>
                    <Button type="submit" className='bg-green-600'>
                        Create
                    </Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default CreateNoteDialogue