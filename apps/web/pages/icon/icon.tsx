import { CheckCircle2, CheckCircle2Icon, ChevronDown, Clock, FileText, Folder, ImagePlayIcon, LayoutGrid, LayoutList, LucideCheckCircle2, MessageSquare, Star, Video, Workflow } from "lucide-react"

export function getFileIcon(type: string, style:string="h-5") {
    switch (type) {
      case 'pdf':
        return <FileText strokeWidth={1} className={`${style} text-red-500 fill`} />
      case 'docx':
        return <FileText strokeWidth={1} className={`${style} text-blue-500`} />
      case 'video':
        return <Video className={`${style} text-purple-500`} />
      case 'folder':
        return <Folder strokeWidth={1} className={`${style}text-purple-500 fill-orange-300`} />
      case 'dot':
        return <div className={`${style} bg-blue-500 rounded-full`} />
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
        return <ImagePlayIcon className="h-4 w-4 text-green-500" />;
      case 'workflow':
        return <Workflow strokeWidth={2} className={`${style} text-black-500`} />
      case undefined:
        return <div className={`${style} bg-blue-500 rounded-full`} />
      case 'check':
        return <LucideCheckCircle2 strokeWidth={1} className={`${style} text-green-500`} />
      case 'star':
        return <Star strokeWidth={1} className={`${style}`} />
      case 'clock' :
        return <Clock className={`${style}`} />
      default:
        return <FileText strokeWidth={1} className={`${style} text-gray-950 fill-gray-400`} />
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