import { ChevronDown, FileText, Folder, LayoutGrid, LayoutList, MessageSquare, Star, Video } from "lucide-react"

export function getFileIcon(type: string) {
    switch (type) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />
      case 'docx':
        return <FileText className="h-4 w-4 text-blue-500" />
      case 'video':
        return <Video className="h-4 w-4 text-purple-500" />
      case 'folder':
        return <Folder className="h-4 w-4 text-purple-500" />
      case 'dot':
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />
      default:
        return <Folder className="h-4 w-4" />
    }
  }

export const getFileThumbnail = (type: string) => {
    switch (type) {
      case 'folder':
        return <Folder className="h-20 w-20 text-orange-400" />
      case 'pdf':
        return <FileText className="h-20 w-20 text-red-500" />
      case 'excel':
        return <FileText className="h-20 w-20 text-green-500" />
      case 'docx':
        return <FileText className="h-20 w-20 text-green-500" />
      case 'video':
          return <Video className="h-20 w-20 text-green-500" />
      default:
        return <FileText className="h-20 w-20" />
    }
  }