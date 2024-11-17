import { CheckCircle, CheckCircle2, CheckCircle2Icon, CheckCircleIcon, CheckIcon, CheckSquareIcon, ChevronDown, Clock, FileText, Folder, ImagePlayIcon, LayoutGrid, LayoutList, LucideCheckCircle2, MessageSquare, Star, StopCircle, Video, Workflow } from "lucide-react"

export function getIcon(type: string, style:string="h-5") {
    switch (type) {
      case 'pdf':
        return <FileText strokeWidth={1} className={`${style} text-red-500 fill`} />
      case 'docx':
        return <FileText strokeWidth={1} className={`${style} text-blue-500`} />
      case 'mp4':
      case 'video':
        return <Video className={`${style} text-purple-500`} />
      case 'folder':
        return <Folder strokeWidth={1} className={`${style} fill-orange-300`} />
      case 'dot':
        return <div className={`${style} bg-blue-500 rounded-full`} />
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
        return <ImagePlayIcon className={`${style} text-green-500`} />;
      case 'workflow':
        return <Workflow strokeWidth={2} className={`${style} text-black-500`} />
      case undefined:
        return <div className={`${style} bg-blue-500 rounded-full`} />
      case 'check':
        return <CheckCircle2Icon strokeWidth={1} className={`${style} text-green-500`} />
      case 'star':
        return <Star strokeWidth={1} className={`${style}`} />
      case 'clock' :
        return <Clock className={`${style}`} />
      case 'on time':
        return <Clock className={`${style} text-blue-800 rounded-full scale-x-[-1] fill-blue-300`} />
      case 'stopped':
        return <div className={` ${style} rounded-full bg-red-500 flex items-center justify-center`}>
                  <div className=" rounded-[10%] h-[53%] w-[53%] bg-white" />
                </div>
      default:
        return <FileText strokeWidth={1} className={`${style} text-gray-950 fill-gray-400`} />
    }
  }

