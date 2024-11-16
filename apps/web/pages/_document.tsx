import { Html, Head, Main, NextScript } from "next/document";
import { Toaster } from "@/components/ui/toaster"

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased">
        <Main />
        <NextScript />
        <Toaster />
      </body>
    </Html>
  );
}


workflows: [
        {
            "id": "ba604056-5af7-4945-8af8-7ecb24d5a96a",
            "status": "on time",
            "dueDate": null,
            "workflowName": "30079647 - NFA WF - 10/Sep/2024 03:16",
            "currentStep": "NFA Form - 10/Sep/2024 03:16 PM",
            "assignedTo": "Mohit Jain",
            "startDate": "2024-11-15T11:47:55.239Z"
        },
        {
            "id": "ba074564-e84d-423b-84e0-7cd787d897f9",
            "status": "on time",
            "dueDate": null,
            "workflowName": "30079647 - NFA WF - 10/Sep/2024 03:16",
            "currentStep": "NFA WF - 10/Sep/2024 03:16",
            "assignedTo": "Mohit Jain",
            "startDate": "2024-11-15T14:33:10.774Z"
        }
    ]