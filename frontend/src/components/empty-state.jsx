"use client"
import { Button } from "./ui/button"
import { FileText, Plus } from "lucide-react"

export function EmptyState({ onCreateNote }) {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <div className="bg-gray-100 p-6 rounded-full mb-4">
        <FileText className="h-12 w-12 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold mb-2">No notes yet</h2>
      <p className="text-gray-500 mb-6 max-w-md">Create your first note to get started with NotionLite.</p>
      <Button onClick={onCreateNote}>
        <Plus className="h-4 w-4 mr-2" />
        Create New Note
      </Button>
    </div>
  )
}
